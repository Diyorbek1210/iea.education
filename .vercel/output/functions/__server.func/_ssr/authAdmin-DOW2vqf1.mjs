import { r as createServerFn } from "./server-ihsQcs9K.mjs";
import { t as createServerRpc } from "./createServerRpc-DDBl6s_L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/authAdmin-DOW2vqf1.js
function isDeleteAuthUserInput(data) {
	return typeof data === "object" && data !== null && typeof data.uid === "string" && typeof data.idToken === "string";
}
function base64UrlEncode(bytes) {
	let binary = "";
	for (const b of bytes) binary += String.fromCharCode(b);
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function base64UrlDecode(input) {
	const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
	const padded = b64 + "=".repeat((4 - b64.length % 4) % 4);
	const binary = atob(padded);
	return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}
function decodeJwtPart(part) {
	return JSON.parse(new TextDecoder().decode(base64UrlDecode(part)));
}
async function importRsaPrivateKey(pem) {
	const cleaned = pem.replace(/\\n/g, "\n").replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "").replace(/\s/g, "");
	const der = Uint8Array.from(atob(cleaned), (c) => c.charCodeAt(0));
	return crypto.subtle.importKey("pkcs8", der.buffer, {
		name: "RSASSA-PKCS1-v1_5",
		hash: "SHA-256"
	}, false, ["sign"]);
}
var GOOGLE_SECURETOKEN_JWKS = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
async function verifyAdminIdToken(idToken, projectId, adminEmail) {
	const [headerPart, payloadPart, signaturePart] = idToken.split(".");
	if (!headerPart || !payloadPart || !signaturePart) throw new Error("Malformed ID token");
	const header = decodeJwtPart(headerPart);
	const payload = decodeJwtPart(payloadPart);
	if (header.alg !== "RS256" || !header.kid) throw new Error("Unexpected token algorithm");
	if (payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error("Token issuer mismatch");
	if (payload.aud !== projectId) throw new Error("Token audience mismatch");
	if (!payload.exp || payload.exp * 1e3 < Date.now()) throw new Error("Token expired");
	const jwk = (await (await fetch(GOOGLE_SECURETOKEN_JWKS)).json()).keys.find((k) => k.kid === header.kid);
	if (!jwk) throw new Error("Signing key not found");
	const key = await crypto.subtle.importKey("jwk", jwk, {
		name: "RSASSA-PKCS1-v1_5",
		hash: "SHA-256"
	}, false, ["verify"]);
	if (!await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, base64UrlDecode(signaturePart).buffer, new TextEncoder().encode(`${headerPart}.${payloadPart}`))) throw new Error("Invalid token signature");
	if (payload.email !== adminEmail) throw new Error("Only the site admin can delete accounts");
}
var cachedToken = null;
async function getAccessToken(clientEmail, privateKeyPem) {
	if (cachedToken && cachedToken.expiresAt > Date.now() + 6e4) return cachedToken.value;
	const key = await importRsaPrivateKey(privateKeyPem);
	const now = Math.floor(Date.now() / 1e3);
	const signingInput = `${base64UrlEncode(new TextEncoder().encode(JSON.stringify({
		alg: "RS256",
		typ: "JWT"
	})))}.${base64UrlEncode(new TextEncoder().encode(JSON.stringify({
		iss: clientEmail,
		scope: "https://www.googleapis.com/auth/identitytoolkit",
		aud: "https://oauth2.googleapis.com/token",
		iat: now,
		exp: now + 3600
	})))}`;
	const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(signingInput));
	const jwt = `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`;
	const response = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
			assertion: jwt
		})
	});
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Could not authenticate the service account: ${body}`);
	}
	const json = await response.json();
	cachedToken = {
		value: json.access_token,
		expiresAt: Date.now() + json.expires_in * 1e3
	};
	return json.access_token;
}
var deleteAuthUser_createServerFn_handler = createServerRpc({
	id: "4cd9fd6db330fd332d42575b02c398a3e8b8020671124b61669ccc5d7b97b509",
	name: "deleteAuthUser",
	filename: "src/lib/authAdmin.ts"
}, (opts) => deleteAuthUser.__executeServer(opts));
var deleteAuthUser = createServerFn({ method: "POST" }).validator((data) => {
	if (!isDeleteAuthUserInput(data)) throw new Error("Invalid input: expected { uid: string, idToken: string }");
	return {
		uid: data.uid,
		idToken: data.idToken
	};
}).handler(deleteAuthUser_createServerFn_handler, async ({ data }) => {
	const clientEmail = process.env["FIREBASE_CLIENT_EMAIL"];
	const privateKey = process.env["FIREBASE_PRIVATE_KEY"];
	const projectId = process.env["FIREBASE_PROJECT_ID"] || "salom-4f3bd";
	const adminEmail = process.env["ADMIN_EMAIL"] || "diyorbekmuzaffarovich4@gmail.com";
	if (!clientEmail || !privateKey) throw new Error("Auth deletion isn't configured on the server. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY — see .env.example.");
	await verifyAdminIdToken(data.idToken, projectId, adminEmail);
	const accessToken = await getAccessToken(clientEmail, privateKey);
	const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:delete`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`
		},
		body: JSON.stringify({ localId: data.uid })
	});
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Firebase Auth deletion failed: ${body}`);
	}
	return { deleted: true };
});
//#endregion
export { deleteAuthUser_createServerFn_handler };
