import { useEffect, useState } from "react";

import { useAppSelector } from "@/app/store";
import { verifyAdmin } from "@/lib/authAdmin";
import { auth, isFirebaseConfigured } from "@/shared/config/firebase";

/**
 * Server-verified admin status for the current browser session.
 *
 * The Redux `isAdmin` flag decides what to *render*, but it lives in the
 * browser and anyone can set it. Anything gated here waits for the server to
 * re-check the caller's Firebase ID token signature against Google's JWKS, so
 * the admin panel's data queries are not even issued until the server agrees.
 *
 * With Firebase unconfigured there is no ID token to verify and the gate is
 * therefore demo-grade only: it trusts the same `isAdmin` value the rest of the
 * UI renders from, which is derived from the signed-in demo account's address.
 * Demo mode is a local preview fallback and grants no real data access, since
 * every admin query is additionally refused by Firestore rules in production.
 */
export type AdminAccessStatus = "checking" | "allowed" | "denied";

export function useAdminAccess(): AdminAccessStatus {
  const [status, setStatus] = useState<AdminAccessStatus>("checking");

  const demoIsAdmin = useAppSelector((s) => s.auth.isAdmin);
  const authReady = useAppSelector((s) => s.auth.ready);
  const signedInUid = useAppSelector((s) => s.auth.user?.uid ?? null);

  useEffect(() => {
    // Wait for the auth bootstrap so the first check does not race the token.
    if (!authReady) return;

    if (!isFirebaseConfigured || !auth) {
      setStatus(demoIsAdmin ? "allowed" : "denied");
      return;
    }

    let cancelled = false;
    setStatus("checking");

    void (async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          if (!cancelled) setStatus("denied");
          return;
        }
        const idToken = await currentUser.getIdToken();
        const result = await verifyAdmin({ data: { idToken } });
        if (!cancelled) setStatus(result.isAdmin ? "allowed" : "denied");
      } catch {
        if (!cancelled) setStatus("denied");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, demoIsAdmin, signedInUid]);

  return status;
}
