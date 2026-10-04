import { assertSameOrigin, enforceRateLimit } from "./server-security";

/**
 * Firebase service-account primitives, server-side only.
 *
 * The client SDK can only read/write what the signed-in user is entitled to, so
 * anything needing cross-user or privilege-escalated access goes through the
 * Admin REST API. Everything runs on WebCrypto + fetch so it also works on
 * Cloudflare Workers, where the Node firebase-admin SDK cannot.
 *
 * Secrets come from FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY and never
 * leave the server.
 */

const DEFAULT_PROJECT_ID = "salom-4f3bd";
const DEFAULT_ADMIN_EMAIL = "diyorbekmuzaffarovich4@gmail.com";
const GOOGLE_SECURETOKEN_JWKS =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

const FIRESTORE_SCOPE = "https://www.googleapis.com/auth/cloud-platform";
const IDENTITY_SCOPE = "https://www.googleapis.com/auth/identitytoolkit";

export function serverProjectId(): string {
  return process.env["FIREBASE_PROJECT_ID"] || DEFAULT_PROJECT_ID;
}

/**
 * Admin address from the server environment. Falls back to the same address the
 * client uses so a misconfigured deploy keeps one working admin rather than
 * silently locking everyone out — the password is never involved.
 */
export function serverAdminEmail(): string {
  return (process.env["ADMIN_EMAIL"] || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
}

/* ------------------------- small JWT helpers ------------------------- */

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

/* ----------------- verify the caller is the site admin ----------------- */

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
  if (payload.email !== adminEmail) throw new Error("Only the site admin can perform this action");
}

/* ----------------- mint a service-account access token ----------------- */

/**
 * Access tokens are cached per scope. A single shared slot would hand an
 * identity-scope token to Firestore (or the reverse) and silently fail the call
 * with a permission error, so the scope is part of the cache key.
 */
const tokenCache = new Map<string, { value: string; expiresAt: number }>();

async function mintAccessToken(
  clientEmail: string,
  privateKeyPem: string,
  scope: string,
): Promise<string> {
  const cached = tokenCache.get(scope);
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.value;

  const key = await importRsaPrivateKey(privateKeyPem);
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })),
  );
  const claims = base64UrlEncode(
    new TextEncoder().encode(
      JSON.stringify({
        iss: clientEmail,
        scope,
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
    throw new Error(`Could not authenticate the service account: ${await response.text()}`);
  }
  const json = (await response.json()) as { access_token: string; expires_in: number };
  tokenCache.set(scope, {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  });
  return json.access_token;
}

export async function getAuthAdminToken(): Promise<string> {
  const { clientEmail, privateKey } = await loadServiceAccountEnv();
  return mintAccessToken(clientEmail!, privateKey!, IDENTITY_SCOPE);
}

export async function getFirestoreAdminToken(): Promise<string> {
  const { clientEmail, privateKey } = await loadServiceAccountEnv();
  return mintAccessToken(clientEmail!, privateKey!, FIRESTORE_SCOPE);
}

/**
 * Loads the Firebase service-account secrets from disk.
 *
 * Vite dev loads VITE_-prefixed vars only; production via Nitro/Cloudflare
 * injects them automatically — but Cloudflare Workers need secrets set in the
 * dashboard. The dotenv fallback covers local dev; override: true is needed
 * because Vite may set empty-string values that dotenv won't replace.
 */
export async function loadServiceAccountEnv(): Promise<{
  clientEmail: string | undefined;
  privateKey: string | undefined;
}> {
  if (!process.env["FIREBASE_CLIENT_EMAIL"]) {
    try {
      const dotenv = await import("dotenv");
      const { resolve, dirname } = await import("node:path");
      const { fileURLToPath } = await import("node:url");
      const cwd = process.cwd();
      const srcDir = dirname(fileURLToPath(import.meta.url));
      dotenv.config({ path: resolve(cwd, ".env"), override: true });
      if (!process.env["FIREBASE_CLIENT_EMAIL"]) {
        dotenv.config({ path: resolve(srcDir, "../../.env"), override: true });
      }
      if (!process.env["FIREBASE_CLIENT_EMAIL"]) {
        dotenv.config({ path: resolve(srcDir, "../../../.env"), override: true });
      }
    } catch {
      // Production Cloudflare Workers can't read the filesystem;
      // secrets must be set via the deployment dashboard.
    }
  }
  return {
    clientEmail: process.env["FIREBASE_CLIENT_EMAIL"],
    privateKey: process.env["FIREBASE_PRIVATE_KEY"],
  };
}

/* ------------------------- Firestore REST reads ------------------------- */

interface FirestoreDocument {
  name: string;
  fields?: Record<string, { stringValue?: string; doubleValue?: number }>;
}

/**
 * Reads a whole collection through the Admin API and projects it down to the
 * listed fields. Used where a cross-user aggregate is needed but the raw
 * documents must not leave the server.
 */
export async function readCollectionWithAdmin(
  collection: string,
  fields: string[],
): Promise<Array<Record<string, string | number>>> {
  const token = await getFirestoreAdminToken();
  const projectId = serverProjectId();
  const url =
    `https://firestore.googleapis.com/v1/projects/${projectId}` +
    `/databases/(default)/documents/${collection}?pageSize=1000&mask.fieldPaths=${fields.join(",")}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Firestore read failed: ${response.status}`);
  }
  const payload = (await response.json()) as { documents?: FirestoreDocument[] };

  return (payload.documents ?? []).map((document) => {
    const row: Record<string, string | number> = {
      id: document.name.split("/").pop() ?? "",
    };
    for (const field of fields) {
      const value = document.fields?.[field];
      if (!value) continue;
      if (value.stringValue !== undefined) row[field] = value.stringValue;
      else if (value.doubleValue !== undefined) row[field] = value.doubleValue;
    }
    return row;
  });
}

export { assertSameOrigin, enforceRateLimit };
