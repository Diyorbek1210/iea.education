import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  assertSameOrigin,
  enforceRateLimit,
  getAuthAdminToken,
  loadServiceAccountEnv,
  serverAdminEmail,
  serverProjectId,
  verifyAdminIdToken,
} from "./firebaseAdmin";

/**
 * Server-side Firebase Auth administration.
 *
 * The client SDK can only delete the currently signed-in user's own account, so
 * removing a student from Firebase Auth happens here, with a service account.
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

/**
 * Authoritative admin check for the caller's Firebase ID token.
 *
 * The browser also keeps an `isAdmin` flag for rendering, but that value is
 * attacker-controlled. Anything that must actually be restricted calls this
 * instead: it re-verifies the RS256 signature, issuer, audience and expiry
 * against Google's live JWKS before answering.
 */
export const verifyAdmin = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idToken: z.string().min(1).max(4096),
    }),
  )
  .handler(async ({ data }) => {
    assertSameOrigin();
    enforceRateLimit("admin-verify", 30, 60_000);

    try {
      await verifyAdminIdToken(data.idToken, serverProjectId(), serverAdminEmail());
      return { isAdmin: true };
    } catch (error) {
      // A non-admin token is an expected answer, not a server fault — report it
      // as a value so the caller can redirect instead of surfacing a 500.
      return {
        isAdmin: false,
        reason: error instanceof Error ? error.message : "Not an admin",
      };
    }
  });

export const deleteAuthUser = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!isDeleteAuthUserInput(data)) {
      throw new Error("Invalid input: expected { uid: string, idToken: string }");
    }
    return { uid: data.uid, idToken: data.idToken };
  })
  .handler(async ({ data }) => {
    assertSameOrigin();
    enforceRateLimit("admin-delete-user", 20, 60 * 60 * 1000);

    const { clientEmail, privateKey } = await loadServiceAccountEnv();
    if (!clientEmail || !privateKey) {
      console.error(
        "[deleteAuthUser] FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY is missing from process.env. " +
          "In production, set them as secrets in the deployment dashboard (Project Settings → Environment Variables).",
      );
      return { deleted: false, reason: "missing_keys" };
    }

    await verifyAdminIdToken(data.idToken, serverProjectId(), serverAdminEmail());

    const projectId = serverProjectId();
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAuthAdminToken()}`,
        },
        body: JSON.stringify({ localId: data.uid }),
      },
    );
    if (!response.ok) {
      throw new Error(`Firebase Auth deletion failed: ${await response.text()}`);
    }
    return { deleted: true };
  });
