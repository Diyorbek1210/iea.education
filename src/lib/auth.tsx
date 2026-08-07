import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from "firebase/auth";

import { ADMIN_EMAIL, ADMIN_PASSWORD, auth, isFirebaseConfigured } from "@/firebaseConfig";
import { createUserProfile, getUserProfile } from "./db";
import type { UserProfile } from "./types";

interface AuthContextValue {
  user: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (name: string, email: string, password: string, level: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ isAdmin: boolean }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "iea_session_uid";
const ADMIN_KEY = "iea_session_admin";
const CRED_KEY = "iea_credentials";

type Credentials = Record<string, { uid: string; password: string }>;

function readCreds(): Credentials {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(CRED_KEY) ?? "{}") as Credentials;
  } catch {
    return {};
  }
}

function writeCreds(creds: Credentials) {
  window.localStorage.setItem(CRED_KEY, JSON.stringify(creds));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid: string) => {
    const profile = await getUserProfile(uid);
    setUser(profile);
  }, []);

  useEffect(() => {
    let active = true;

    if (isFirebaseConfigured && auth) {
      const unsub = onAuthStateChanged(auth, async (fbUser) => {
        if (!active) return;
        if (fbUser) {
          setIsAdmin(fbUser.email === ADMIN_EMAIL);
          await loadProfile(fbUser.uid);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });
      return () => {
        active = false;
        unsub();
      };
    }

    // local demo mode
    const uid = window.localStorage.getItem(SESSION_KEY);
    const admin = window.localStorage.getItem(ADMIN_KEY) === "true";
    setIsAdmin(admin);
    if (uid) {
      loadProfile(uid).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    return () => {
      active = false;
    };
  }, [loadProfile]);

  const signUp = useCallback(
    async (name: string, email: string, password: string, level: string) => {
      let uid: string;
      if (isFirebaseConfigured && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        uid = cred.user.uid;
      } else {
        const creds = readCreds();
        if (creds[email.toLowerCase()]) throw new Error("This email is already registered.");
        uid = crypto.randomUUID();
        creds[email.toLowerCase()] = { uid, password };
        writeCreds(creds);
        window.localStorage.setItem(SESSION_KEY, uid);
        window.localStorage.setItem(ADMIN_KEY, "false");
      }

      const profile: UserProfile = {
        uid,
        name,
        email,
        level,
        createdAt: new Date().toISOString(),
        videosWatched: [],
        mockResults: [],
      };
      await createUserProfile(profile);
      setUser(profile);
      setIsAdmin(email === ADMIN_EMAIL);
    },
    [],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const admin = email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;

    if (isFirebaseConfigured && auth) {
      if (admin) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch {
          /* admin may not exist in Auth — front-end admin access is still granted */
        }
        setIsAdmin(true);
        window.localStorage.setItem(ADMIN_KEY, "true");
        return { isAdmin: true };
      }
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await loadProfile(cred.user.uid);
      setIsAdmin(false);
      return { isAdmin: false };
    }

    if (admin) {
      setIsAdmin(true);
      window.localStorage.setItem(ADMIN_KEY, "true");
      return { isAdmin: true };
    }

    const creds = readCreds();
    const entry = creds[email.trim().toLowerCase()];
    if (!entry || entry.password !== password) {
      throw new Error("Incorrect email or password.");
    }
    window.localStorage.setItem(SESSION_KEY, entry.uid);
    window.localStorage.setItem(ADMIN_KEY, "false");
    setIsAdmin(false);
    await loadProfile(entry.uid);
    return { isAdmin: false };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    }
    window.localStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem(ADMIN_KEY);
    setUser(null);
    setIsAdmin(false);
  }, []);

  const refresh = useCallback(async () => {
    if (user) await loadProfile(user.uid);
  }, [user, loadProfile]);

  const value = useMemo(
    () => ({ user, isAdmin, loading, signUp, signIn, signOut, refresh }),
    [user, isAdmin, loading, signUp, signIn, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
