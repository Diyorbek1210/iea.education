import { createServerFn } from "@tanstack/react-start";

/**
 * Server-side Firebase Auth administration.
 * The client SDK can only delete the currently signed-in user's own account,
 * so removing a student from Firebase Auth must happen here, using a service
 * account (FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY in the server env).
 * Everything runs with WebCrypto + REST so it works on Cloudflare Workers too,
 * where the Node firebase-admin SDK cannot run.
 */

interface DeleteAuthUserInput {
  uid: string;
  idToken: string;
}

function isDeleteAuthUserInput(data: unknown): data is DeleteAuthUserInput {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as { uid?: unknown }).uid === "string" &&
    typeof (data as { idToken?: unknown }).idToken === "string"
  );
}

/* ------------------------- small JWT helpers ------------------------- */

// Exported for tests/scripts; only deleteAuthUser is used by the app itself.

export function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64UrlDecode(input: string): Uint8Array {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export function decodeJwtPart<T>(part: string): T {
  return JSON.parse(new TextDecoder().decode(base64UrlDecode(part))) as T;
}

export async function importRsaPrivateKey(pem: string): Promise<CryptoKey> {
  const cleaned = pem
    .replace(/\\n/g, "\n")
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const der = Uint8Array.from(atob(cleaned), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    der.buffer as ArrayBuffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

/* ----------------- verify the caller is the site admin ---------------- */

const GOOGLE_SECURETOKEN_JWKS =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

export async function verifyAdminIdToken(
  idToken: string,
  projectId: string,
  adminEmail: string,
): Promise<void> {
  const [headerPart, payloadPart, signaturePart] = idToken.split(".");
  if (!headerPart || !payloadPart || !signaturePart) {
    throw new Error("Malformed ID token");
  }

  const header = decodeJwtPart<{ alg?: string; kid?: string }>(headerPart);
  const payload = decodeJwtPart<{ iss?: string; aud?: string; exp?: number; email?: string }>(
    payloadPart,
  );

  if (header.alg !== "RS256" || !header.kid) throw new Error("Unexpected token algorithm");
  if (payload.iss !== `https://securetoken.google.com/${projectId}`)
    throw new Error("Token issuer mismatch");
  if (payload.aud !== projectId) throw new Error("Token audience mismatch");
  if (!payload.exp || payload.exp * 1000 < Date.now()) throw new Error("Token expired");

  const jwks = (await (await fetch(GOOGLE_SECURETOKEN_JWKS)).json()) as {
    keys: Array<JsonWebKey & { kid?: string }>;
  };
  const jwk = jwks.keys.find((k) => k.kid === header.kid);
  if (!jwk) throw new Error("Signing key not found");

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64UrlDecode(signaturePart).buffer as ArrayBuffer,
    new TextEncoder().encode(`${headerPart}.${payloadPart}`),
  );
  if (!valid) throw new Error("Invalid token signature");
  if (payload.email !== adminEmail) throw new Error("Only the site admin can delete accounts");
}

/* ----------------- mint a service-account access token ---------------- */

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(clientEmail: string, privateKeyPem: string): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const key = await importRsaPrivateKey(privateKeyPem);
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })),
  );
  const claims = base64UrlEncode(
    new TextEncoder().encode(
      JSON.stringify({
        iss: clientEmail,
        scope: "https://www.googleapis.com/auth/identitytoolkit",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      }),
    ),
  );
  const signingInput = `${header}.${claims}`;
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput),
  );
  const jwt = `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Could not authenticate the service account: ${body}`);
  }
  const json = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return json.access_token;
}

/* --------------------------- the server function --------------------------- */

export const deleteAuthUser = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!isDeleteAuthUserInput(data)) {
      throw new Error("Invalid input: expected { uid: string, idToken: string }");
    }
    return { uid: data.uid, idToken: data.idToken };
  })
  .handler(async ({ data }) => {
    // `vite dev` doesn't load plain (non-VITE_-prefixed) .env vars into process.env —
    // only the production build (via nitro/Cloudflare) does that automatically. This
    // branch is dev-only and dead-code-eliminated from the production bundle.
    if (import.meta.env.DEV && !process.env["FIREBASE_CLIENT_EMAIL"]) {
      const dotenv = await import("dotenv");
      dotenv.config();
    }

    const clientEmail = process.env["FIREBASE_CLIENT_EMAIL"];
    const privateKey = process.env["FIREBASE_PRIVATE_KEY"];
    // Fallbacks mirror the values hardcoded in firebaseConfig.ts; keep in sync.
    const projectId = process.env["FIREBASE_PROJECT_ID"] || "salom-4f3bd";
    const adminEmail = process.env["ADMIN_EMAIL"] || "diyorbekmuzaffarovich4@gmail.com";

    if (!clientEmail || !privateKey) {
      throw new Error(
        "Auth deletion isn't configured on the server. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY — see .env.example.",
      );
    }

    await verifyAdminIdToken(data.idToken, projectId, adminEmail);

    const accessToken = await getAccessToken(clientEmail, privateKey);
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ localId: data.uid }),
      },
    );
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Firebase Auth deletion failed: ${body}`);
    }
    return { deleted: true };
  });
