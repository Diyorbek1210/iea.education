import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Reads a Vite env var, treating blank/whitespace-only values as absent.
 *
 * A copied `.env.example` leaves `VITE_FIREBASE_API_KEY=` and friends empty,
 * and `"" ?? fallback` would keep the empty string — producing an app that
 * believes it is configured but cannot initialise Firebase at all.
 */
function env(name: string, fallback: string): string {
  const value = import.meta.env[name];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : fallback;
}

/**
 * Firebase web config values are public identifiers by design — they ship in
 * every client bundle and are only meaningful together with the Firestore /
 * Auth security rules. The real credentials (service account, R2, AI keys) are
 * server-only and read from `process.env` inside server functions.
 */
export const firebaseConfig = {
  apiKey: env("VITE_FIREBASE_API_KEY", "AIzaSyCC5TBm4rC7AleakQl92W_yRPaiNoGoV9s"),
  authDomain: env("VITE_FIREBASE_AUTH_DOMAIN", "salom-4f3bd.firebaseapp.com"),
  databaseURL: env("VITE_FIREBASE_DATABASE_URL", "https://salom-4f3bd-default-rtdb.firebaseio.com"),
  projectId: env("VITE_FIREBASE_PROJECT_ID", "salom-4f3bd"),
  storageBucket: env("VITE_FIREBASE_STORAGE_BUCKET", "salom-4f3bd.firebasestorage.app"),
  messagingSenderId: env("VITE_FIREBASE_MESSAGING_SENDER_ID", "223747081418"),
  appId: env("VITE_FIREBASE_APP_ID", "1:223747081418:web:5d1d89c7e00cc1a0b82033"),
  measurementId: env("VITE_FIREBASE_MEASUREMENT_ID", "G-JYXYC0S8DX"),
};

export const isFirebaseConfigured = ["apiKey", "authDomain", "projectId", "appId"].every((key) => {
  const value = firebaseConfig[key as keyof typeof firebaseConfig];
  return typeof value === "string" && value.trim() !== "" && !value.startsWith("YOUR_");
});

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
}

export const firebaseApp = app;
export const auth = authInstance;
export const db = dbInstance;

/**
 * Identifies the admin account. An address is a label, not a credential, so it
 * is safe in the client bundle — what matters is that no password ever is, and
 * that access is re-verified server-side (see `verifyAdmin` server function)
 * and by the Firestore rules rather than by this string.
 *
 * Set VITE_ADMIN_EMAIL to change admins without a rebuild of the constant.
 */
export const ADMIN_EMAIL = env(
  "VITE_ADMIN_EMAIL",
  "diyorbekmuzaffarovich4@gmail.com",
).toLowerCase();

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}
