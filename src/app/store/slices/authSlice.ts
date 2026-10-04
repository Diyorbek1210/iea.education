import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from "firebase/auth";
import { auth, isAdminEmail, isFirebaseConfigured } from "@/shared/config/firebase";
import {
  authenticateDemoUser,
  purgeLegacyPlaintextCredentials,
  registerDemoUser,
} from "@/lib/demoAuth";
import { createUserProfile, getUserProfile, recordActivity } from "@/lib/db";
import { DEFAULT_DAILY_GOAL, weekStartKey } from "@/lib/gamification";
import type { UserProfile } from "@/shared/types/types";

const SESSION_KEY = "iea_session_uid";

/**
 * The signed-in uid is the only thing persisted. Neither a password nor an
 * `isAdmin` flag is written to storage: admin status is re-derived from the
 * Firebase-authenticated identity on every page load, so editing localStorage
 * cannot escalate privileges.
 */
function readSessionUid(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

function writeSessionUid(uid: string) {
  window.localStorage.setItem(SESSION_KEY, uid);
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

async function restoreProfile(uid: string): Promise<UserProfile | null> {
  try {
    return await loadProfileThunk(uid);
  } catch {
    return null;
  }
}

function emptyProfile(uid: string, name: string, email: string): UserProfile {
  return {
    uid,
    name,
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
  };
}

export const initAuth = createAsyncThunk(
  "auth/init",
  async (_, { dispatch }) => {
    purgeLegacyPlaintextCredentials();

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
          // `fbUser.email` comes from a verified Firebase session, not from
          // anything the browser can rewrite.
          const isAdmin = isAdminEmail(fbUser.email);
          const profile = await restoreProfile(fbUser.uid);
          dispatch(setAuth({ user: profile, isAdmin }));
          resolve();
        });
      });
      return;
    }

    const uid = readSessionUid();
    if (!uid) {
      dispatch(setAuth({ user: null, isAdmin: false }));
      return;
    }
    const profile = await restoreProfile(uid);
    dispatch(setAuth({ user: profile, isAdmin: isAdminEmail(profile?.email) }));
  },
  { condition: (_, { getState }) => !(getState() as { auth: AuthState }).auth.ready },
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
      uid = await registerDemoUser(email, password);
      writeSessionUid(uid);
    }

    const placementCompleted = Boolean(level);
    const profile: UserProfile = {
      ...emptyProfile(uid, name, email),
      level: level || "Beginner",
    };
    await createUserProfile(profile);

    let finalProfile = profile;
    if (placementCompleted) {
      await recordActivity(profile, "placementTest");
      finalProfile = (await getUserProfile(uid)) ?? profile;
    }
    // A freshly created account is never admin: admin status is an outcome of
    // signing in as a pre-provisioned admin, never of registering.
    return { user: finalProfile, isAdmin: false };
  },
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: { email: string; password: string }) => {
    if (isFirebaseConfigured && auth) {
      // Single path for everyone. The admin account is provisioned in the
      // Firebase console; there is no code path that can mint one, and no
      // credential to compare against in the bundle.
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const isAdmin = isAdminEmail(cred.user.email);
      const profile = await loadProfileThunk(cred.user.uid);
      if (!profile && isAdmin) {
        await createUserProfile(emptyProfile(cred.user.uid, "Admin", cred.user.email ?? email));
      }
      const resolved = profile ?? (await loadProfileThunk(cred.user.uid));
      return { user: resolved, isAdmin };
    }

    const entry = await authenticateDemoUser(email, password);
    writeSessionUid(entry.uid);
    const profile = await loadProfileThunk(entry.uid);
    return { user: profile, isAdmin: isAdminEmail(entry.email) };
  },
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  if (isFirebaseConfigured && auth) {
    await fbSignOut(auth);
  }
  if (typeof window !== "undefined") window.localStorage.removeItem(SESSION_KEY);
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
    builder.addCase(initAuth.rejected, (state, action) => {
      if (action.meta.condition) return;
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
