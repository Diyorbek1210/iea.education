import { createContext, useContext, useMemo, type ReactNode } from "react";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { initAuth, refreshUser, signIn, signOut, signUp } from "@/app/store/slices/authSlice";
import type { UserProfile } from "@/shared/types/types";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = useAppSelector((s) => s.auth.isAdmin);
  const loading = useAppSelector((s) => s.auth.loading);

  const signUpFn: AuthContextValue["signUp"] = (name, email, password, level) =>
    dispatch(signUp({ name, email, password, level })).then(() => undefined);
  const signInFn: AuthContextValue["signIn"] = async (email, password) => {
    const res = await dispatch(signIn({ email, password })).unwrap();
    return { isAdmin: Boolean(res && (res as { isAdmin?: boolean }).isAdmin) };
  };
  const signOutFn: AuthContextValue["signOut"] = () => dispatch(signOut()).then(() => undefined);
  const refreshFn: AuthContextValue["refresh"] = () =>
    dispatch(refreshUser()).then(() => undefined);

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      loading,
      signUp: signUpFn,
      signIn: signInFn,
      signOut: signOutFn,
      refresh: refreshFn,
    }),
    [dispatch, user, isAdmin, loading, signUpFn, signInFn, signOutFn, refreshFn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export { initAuth };
