import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from "firebase/auth";
import { ADMIN_EMAIL, ADMIN_PASSWORD, auth, isFirebaseConfigured } from "@/shared/config/firebase";
import { createUserProfile, getUserProfile, recordActivity } from "@/lib/db";
import { DEFAULT_DAILY_GOAL, weekStartKey } from "@/lib/gamification";
import type { UserProfile } from "@/shared/types/types";

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

interface AuthState {
  user: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  ready: boolean;
}

const initialState: AuthState = {
  user: null,
  isAdmin: false,
  loading: true,
  ready: false,
};

async function loadProfileThunk(uid: string): Promise<UserProfile | null> {
  return getUserProfile(uid);
}

export const initAuth = createAsyncThunk(
  "auth/init",
  async (_, { dispatch }) => {
    if (isFirebaseConfigured && auth) {
      const fbAuth = auth;
      await new Promise<void>((resolve) => {
        const unsub = onAuthStateChanged(fbAuth, async (fbUser) => {
          unsub();
          if (!fbUser) {
            dispatch(setAuth({ user: null, isAdmin: false }));
            resolve();
            return;
          }
          const isAdmin = fbUser.email === ADMIN_EMAIL;
          const profile = await loadProfileThunk(fbUser.uid);
          dispatch(setAuth({ user: profile, isAdmin }));
          resolve();
        });
      });
      return;
    }

    const uid = window.localStorage.getItem(SESSION_KEY);
    const isAdmin = window.localStorage.getItem(ADMIN_KEY) === "true";
    if (uid) {
      const profile = await loadProfileThunk(uid);
      dispatch(setAuth({ user: profile, isAdmin }));
    } else {
      dispatch(setAuth({ user: null, isAdmin }));
    }
  },
  { condition: (_, { getState }) => (getState() as { auth: AuthState }).auth.ready },
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({
    name,
    email,
    password,
    level,
  }: {
    name: string;
    email: string;
    password: string;
    level: string;
  }) => {
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

    const placementCompleted = Boolean(level);
    const profile: UserProfile = {
      uid,
      name,
      email,
      level: level || "Beginner",
      createdAt: new Date().toISOString(),
      mockResults: [],
      xp: 0,
      streak: 0,
      longestStreak: 0,
      todayXp: 0,
      weeklyXp: 0,
      weekStartDate: weekStartKey(),
      dailyGoal: DEFAULT_DAILY_GOAL,
      badges: [],
      gamesPlayed: 0,
      placementCompleted: false,
    };
    await createUserProfile(profile);

    let finalProfile = profile;
    if (placementCompleted) {
      await recordActivity(profile, "placementTest");
      finalProfile = (await getUserProfile(uid)) ?? profile;
    }
    return { user: finalProfile, isAdmin: email === ADMIN_EMAIL };
  },
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: { email: string; password: string }) => {
    const admin = email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;

    if (isFirebaseConfigured && auth) {
      if (admin) {
        let fbUser = null as { uid: string } | null;
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          fbUser = cred.user;
        } catch {
          try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            fbUser = cred.user;
            const existing = await getUserProfile(cred.user.uid);
            if (!existing) {
              await createUserProfile({
                uid: cred.user.uid,
                name: "Admin",
                email,
                level: "Advanced",
                createdAt: new Date().toISOString(),
                mockResults: [],
                xp: 0,
                streak: 0,
                longestStreak: 0,
                todayXp: 0,
                weeklyXp: 0,
                weekStartDate: weekStartKey(),
                dailyGoal: DEFAULT_DAILY_GOAL,
                badges: [],
                gamesPlayed: 0,
                placementCompleted: false,
              });
            }
          } catch {
            /* Creation also failed — still grant admin access for this session. */
          }
        }
        window.localStorage.setItem(ADMIN_KEY, "true");
        if (fbUser) {
          const profile = await loadProfileThunk(fbUser.uid);
          return { user: profile, isAdmin: true };
        }
        return { user: null, isAdmin: true };
      }
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const profile = await loadProfileThunk(cred.user.uid);
      return { user: profile, isAdmin: false };
    }

    if (admin) {
      window.localStorage.setItem(ADMIN_KEY, "true");
      return { user: null, isAdmin: true };
    }

    const creds = readCreds();
    const entry = creds[email.trim().toLowerCase()];
    if (!entry || entry.password !== password) {
      throw new Error("Incorrect email or password.");
    }
    window.localStorage.setItem(SESSION_KEY, entry.uid);
    window.localStorage.setItem(ADMIN_KEY, "false");
    const profile = await loadProfileThunk(entry.uid);
    return { user: profile, isAdmin: false };
  },
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  if (isFirebaseConfigured && auth) {
    await fbSignOut(auth);
  }
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(ADMIN_KEY);
});

export const refreshUser = createAsyncThunk("auth/refresh", async (_, { getState }) => {
  const { user } = (getState() as { auth: AuthState }).auth;
  if (!user) return null;
  return loadProfileThunk(user.uid);
});

interface SetAuthPayload {
  user: UserProfile | null;
  isAdmin: boolean;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<SetAuthPayload>) {
      state.user = action.payload.user;
      state.isAdmin = action.payload.isAdmin;
      state.loading = false;
      state.ready = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initAuth.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(initAuth.fulfilled, (state) => {
      state.loading = false;
      state.ready = true;
    });

    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isAdmin = action.payload.isAdmin;
      state.loading = false;
      state.ready = true;
    });
    builder.addCase(signIn.rejected, (state) => {
      state.loading = false;
      state.ready = true;
    });

    builder.addCase(signUp.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isAdmin = action.payload.isAdmin;
      state.loading = false;
      state.ready = true;
    });
    builder.addCase(signUp.rejected, (state) => {
      state.loading = false;
      state.ready = true;
    });

    builder.addCase(signOut.fulfilled, (state) => {
      state.user = null;
      state.isAdmin = false;
      state.loading = false;
      state.ready = true;
    });

    builder.addCase(refreshUser.fulfilled, (state, action) => {
      if (action.payload) state.user = action.payload;
      state.loading = false;
    });
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
