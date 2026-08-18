import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  arrayRemove,
  arrayUnion,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { auth, db, isFirebaseConfigured } from "@/firebaseConfig";
import { deleteAuthUser } from "./authAdmin";
import { placementQuestions as staticPlacementQuestions } from "@/data/placement";
import { IELTS_RESOURCES } from "@/data/resources";
import { BADGES, type BadgeDef } from "@/data/badges";
import {
  applyStreak,
  applyWeeklyReset,
  evaluateBadges,
  todayKey,
  withGamificationDefaults,
  xpForActivity,
} from "./gamification";
import type {
  ActivityType,
  Level,
  MockResult,
  PlacementQuestion,
  PracticeSession,
  ResourceDoc,
  StudyPlanRecord,
  UserProfile,
  WritingSubmission,
} from "./types";

/* ------------------------------------------------------------------ *
 * Level calculation based on IELTS overall band score
 * ------------------------------------------------------------------ */

export function levelForBand(overall: number): Level {
  if (overall >= 6.5) return "Advanced";
  if (overall >= 5.5) return "Upper-Intermediate";
  if (overall >= 4.5) return "Intermediate";
  if (overall >= 3.5) return "Elementary";
  return "Beginner";
}

/* ------------------------------------------------------------------ *
 * Local demo store — used automatically until firebaseConfig.ts holds
 * real credentials. Keeps every screen functional in the browser.
 * ------------------------------------------------------------------ */

const KEYS = {
  users: "iea_users",
  mocks: "iea_mock_results",
  resources: "iea_resources",
  placement: "iea_placement_questions",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

const seedPlacementQuestions: PlacementQuestion[] = staticPlacementQuestions.map(
  (question, index) => ({
    id: `p${index + 1}`,
    ...question,
    createdAt: new Date().toISOString(),
  }),
);

function localPlacementQuestions(): PlacementQuestion[] {
  const existing = read<PlacementQuestion[] | null>(KEYS.placement, null);
  if (existing && existing.length) return existing;
  write(KEYS.placement, seedPlacementQuestions);
  return seedPlacementQuestions;
}

/* ------------------------------------------------------------------ *
 * File uploads via Cloudflare R2
 * ------------------------------------------------------------------ */

import { uploadToR2 } from "./r2Server";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] || "");
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export async function uploadResourceFile(file: File): Promise<string> {
  const fileBase64 = await fileToBase64(file);
  const { objectUrl } = await uploadToR2({
    data: {
      fileBase64,
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      folder: "resources",
    },
  });
  return objectUrl;
}

/* ------------------------------------------------------------------ *
 * Users
 * ------------------------------------------------------------------ */

export async function listUsers(): Promise<UserProfile[]> {
  if (!isFirebaseConfigured || !db)
    return read<UserProfile[]>(KEYS.users, []).map(withGamificationDefaults);
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) =>
    withGamificationDefaults({ uid: d.id, ...(d.data() as Omit<UserProfile, "uid">) }),
  );
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured || !db) {
    const found = read<UserProfile[]>(KEYS.users, []).find((u) => u.uid === uid) ?? null;
    return found ? withGamificationDefaults(found) : null;
  }
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists()
    ? withGamificationDefaults({ uid, ...(snap.data() as Omit<UserProfile, "uid">) })
    : null;
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const users = read<UserProfile[]>(KEYS.users, []);
    write(KEYS.users, [...users.filter((u) => u.uid !== profile.uid), profile]);
    return;
  }
  const { uid, ...rest } = profile;
  await setDoc(doc(db, "users", uid), rest);
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const users = read<UserProfile[]>(KEYS.users, []);
    write(
      KEYS.users,
      users.map((u) => (u.uid === uid ? { ...u, ...data } : u)),
    );
    return;
  }
  await updateDoc(doc(db, "users", uid), data);
}

/**
 * Deletes a student's Firestore profile AND their Firebase Auth account.
 */
export async function deleteUserProfile(uid: string): Promise<boolean> {
  if (!isFirebaseConfigured || !db) {
    write(
      KEYS.users,
      read<UserProfile[]>(KEYS.users, []).filter((u) => u.uid !== uid),
    );
    return true;
  }

  let authDeleted = false;
  const current = auth?.currentUser;
  if (current) {
    try {
      const idToken = await current.getIdToken();
      const result = await deleteAuthUser({ data: { uid, idToken } });
      authDeleted = result?.deleted === true;
    } catch (error) {
      console.warn("Firebase Auth account removal failed:", error);
    }
  }
  await deleteDoc(doc(db, "users", uid));
  return authDeleted;
}

export async function markMockTestCompleted(uid: string, mockTestId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const users = read<UserProfile[]>(KEYS.users, []);
    write(
      KEYS.users,
      users.map((u) =>
        u.uid === uid
          ? {
              ...u,
              completedMockTests: Array.from(
                new Set([...(u.completedMockTests ?? []), mockTestId]),
              ),
            }
          : u,
      ),
    );
    return;
  }
  await updateDoc(doc(db, "users", uid), { completedMockTests: arrayUnion(mockTestId) });
}

/* ------------------------------------------------------------------ *
 * Gamification
 * ------------------------------------------------------------------ */

export async function recordActivity(
  profile: UserProfile,
  activity: ActivityType,
  opts?: { gameScore?: number },
): Promise<{ xpGained: number; newBadges: BadgeDef[] }> {
  const today = todayKey();
  const streakPatch = applyStreak(profile, today);
  const weekPatch = applyWeeklyReset(profile, today);
  const xpGained = xpForActivity(activity, opts);

  const merged = {
    ...profile,
    ...streakPatch,
    ...weekPatch,
    xp: (profile.xp ?? 0) + xpGained,
    todayXp: streakPatch.todayXp + xpGained,
    weeklyXp: weekPatch.weeklyXp + xpGained,
    gamesPlayed: (profile.gamesPlayed ?? 0) + (activity === "game" ? 1 : 0),
    placementCompleted: profile.placementCompleted || activity === "placementTest",
  };
  const newBadgeIds = evaluateBadges(merged);

  const patch: Partial<UserProfile> = {
    xp: merged.xp,
    streak: merged.streak,
    longestStreak: merged.longestStreak,
    lastActivityDate: merged.lastActivityDate,
    todayXp: merged.todayXp,
    weeklyXp: merged.weeklyXp,
    weekStartDate: merged.weekStartDate,
    gamesPlayed: merged.gamesPlayed,
    badges: [...(profile.badges ?? []), ...newBadgeIds],
    ...(activity === "placementTest" ? { placementCompleted: true } : {}),
  };
  await updateUserProfile(profile.uid, patch);
  return { xpGained, newBadges: BADGES.filter((b) => newBadgeIds.includes(b.id)) };
}

export async function setDailyGoal(uid: string, goalXp: number): Promise<void> {
  await updateUserProfile(uid, { dailyGoal: goalXp });
}

/* ------------------------------------------------------------------ *
 * Resources
 * ------------------------------------------------------------------ */

function seedLocalResources(): ResourceDoc[] {
  const existing = read<ResourceDoc[] | null>(KEYS.resources, null);
  if (existing && existing.length) return existing;
  const seeded = IELTS_RESOURCES.map((r, i) => ({
    ...r,
    sourceType: "link" as const,
    thumbnail: "",
    order: i,
    createdAt: new Date().toISOString(),
  }));
  write(KEYS.resources, seeded);
  return seeded;
}

export async function listResources(): Promise<ResourceDoc[]> {
  if (!isFirebaseConfigured || !db) {
    return seedLocalResources().sort((a, b) => a.order - b.order);
  }
  const snap = await getDocs(query(collection(db, "resources"), orderBy("order", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ResourceDoc, "id">) }));
}

export async function addResource(resource: Omit<ResourceDoc, "id" | "createdAt" | "order">): Promise<void> {
  const now = new Date().toISOString();
  if (!isFirebaseConfigured || !db) {
    const existing = read<ResourceDoc[]>(KEYS.resources, []);
    const maxOrder = existing.reduce((max, r) => Math.max(max, r.order), -1);
    write(KEYS.resources, [...existing, { ...resource, id: crypto.randomUUID(), order: maxOrder + 1, createdAt: now }]);
    return;
  }
  const snap = await getDocs(collection(db, "resources"));
  const maxOrder = snap.docs.reduce((max, d) => {
    const data = d.data() as Omit<ResourceDoc, "id">;
    return Math.max(max, data.order ?? 0);
  }, -1);
  await addDoc(collection(db, "resources"), { ...resource, order: maxOrder + 1, createdAt: now });
}

export async function updateResource(id: string, data: Partial<Omit<ResourceDoc, "id" | "createdAt">>): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<ResourceDoc[]>(KEYS.resources, []);
    write(KEYS.resources, existing.map((r) => (r.id === id ? { ...r, ...data } : r)));
    return;
  }
  await updateDoc(doc(db, "resources", id), data);
}

export async function deleteResource(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<ResourceDoc[]>(KEYS.resources, []);
    const filtered = existing.filter((r) => r.id !== id);
    filtered.forEach((r, i) => { r.order = i; });
    write(KEYS.resources, filtered);
    return;
  }
  await deleteDoc(doc(db, "resources", id));
}

export async function moveResource(id: string, direction: "up" | "down"): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<ResourceDoc[]>(KEYS.resources, []).sort((a, b) => a.order - b.order);
    const idx = existing.findIndex((r) => r.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= existing.length) return;
    const temp = existing[idx]!.order;
    existing[idx]!.order = existing[swapIdx]!.order;
    existing[swapIdx]!.order = temp;
    write(KEYS.resources, existing);
    return;
  }
  const snap = await getDocs(query(collection(db, "resources"), orderBy("order", "asc")));
  const docs = snap.docs.map((d) => ({ ref: d.ref, data: d.data() as Omit<ResourceDoc, "id"> }));
  const idx = docs.findIndex((d) => d.ref.id === id);
  if (idx < 0) return;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= docs.length) return;
  const a = docs[idx]!;
  const b = docs[swapIdx]!;
  await updateDoc(a.ref, { order: b.data.order });
  await updateDoc(b.ref, { order: a.data.order });
}

/* ------------------------------------------------------------------ *
 * Mock results
 * ------------------------------------------------------------------ */

export async function listMockResults(): Promise<MockResult[]> {
  if (!isFirebaseConfigured || !db) return read<MockResult[]>(KEYS.mocks, []);
  const snap = await getDocs(collection(db, "mockResults"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MockResult, "id">) }));
}

export async function addMockResult(result: Omit<MockResult, "id">): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const id = crypto.randomUUID();
    write(KEYS.mocks, [{ id, ...result }, ...read<MockResult[]>(KEYS.mocks, [])]);
    const users = read<UserProfile[]>(KEYS.users, []);
    write(
      KEYS.users,
      users.map((u) =>
        u.uid === result.userId ? { ...u, mockResults: [...(u.mockResults ?? []), id] } : u,
      ),
    );
    return;
  }
  const created = await addDoc(collection(db, "mockResults"), result);
  await updateDoc(doc(db, "users", result.userId), { mockResults: arrayUnion(created.id) });
}

export async function deleteMockResult(id: string, userId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const mocks = read<MockResult[]>(KEYS.mocks, []);
    const target = mocks.find((r) => r.id === id);
    write(
      KEYS.mocks,
      mocks.filter((r) => r.id !== id),
    );
    const users = read<UserProfile[]>(KEYS.users, []);
    write(
      KEYS.users,
      users.map((u) => {
        if (u.uid !== userId) return u;
        const patch: Partial<UserProfile> = {
          mockResults: (u.mockResults ?? []).filter((rId) => rId !== id),
        };
        if (target?.mockTestId) {
          patch.completedMockTests = (u.completedMockTests ?? []).filter(
            (t) => t !== target.mockTestId,
          );
        }
        return { ...u, ...patch };
      }),
    );
    return;
  }
  const snap = await getDoc(doc(db, "mockResults", id));
  const mockTestId = snap.exists() ? (snap.data() as MockResult).mockTestId : undefined;
  await deleteDoc(doc(db, "mockResults", id));
  const patch: Record<string, unknown> = { mockResults: arrayRemove(id) };
  if (mockTestId) {
    patch["completedMockTests"] = arrayRemove(mockTestId);
  }
  await updateDoc(doc(db, "users", userId), patch);
}

/* ------------------------------------------------------------------ *
 * Placement test questions
 * ------------------------------------------------------------------ */

export async function listPlacementQuestions(): Promise<PlacementQuestion[]> {
  if (!isFirebaseConfigured || !db) return localPlacementQuestions();

  const snap = await getDocs(
    query(collection(db, "placementQuestions"), orderBy("createdAt", "asc")),
  );
  if (snap.empty) {
    await Promise.all(
      seedPlacementQuestions.map(({ id, ...question }) =>
        setDoc(doc(db!, "placementQuestions", id), question),
      ),
    );
    return seedPlacementQuestions;
  }
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PlacementQuestion, "id">) }));
}

export async function addPlacementQuestion(
  question: Omit<PlacementQuestion, "id" | "createdAt">,
): Promise<void> {
  const payload = { ...question, createdAt: new Date().toISOString() };
  if (!isFirebaseConfigured || !db) {
    write(KEYS.placement, [...localPlacementQuestions(), { id: crypto.randomUUID(), ...payload }]);
    return;
  }
  await addDoc(collection(db, "placementQuestions"), payload);
}

export async function updatePlacementQuestion(
  id: string,
  data: Partial<Omit<PlacementQuestion, "id" | "createdAt">>,
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    write(
      KEYS.placement,
      localPlacementQuestions().map((q) => (q.id === id ? { ...q, ...data } : q)),
    );
    return;
  }
  await updateDoc(doc(db, "placementQuestions", id), data);
}

export async function deletePlacementQuestion(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    write(
      KEYS.placement,
      localPlacementQuestions().filter((q) => q.id !== id),
    );
    return;
  }
  await deleteDoc(doc(db, "placementQuestions", id));
}

/* ------------------------------------------------------------------ *
 * Practice Sessions
 * ------------------------------------------------------------------ */

const PRACTICE_KEY = "iea_practice_sessions";

export async function listPracticeSessions(): Promise<PracticeSession[]> {
  if (!isFirebaseConfigured || !db) return read<PracticeSession[]>(PRACTICE_KEY, []);
  const snap = await getDocs(collection(db, "practiceSessions"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PracticeSession, "id">) }));
}

export async function addPracticeSession(session: Omit<PracticeSession, "id">): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const id = crypto.randomUUID();
    write(PRACTICE_KEY, [{ id, ...session }, ...read<PracticeSession[]>(PRACTICE_KEY, [])]);
    return;
  }
  await addDoc(collection(db, "practiceSessions"), session);
}

/* ------------------------------------------------------------------ *
 * Writing Submissions
 * ------------------------------------------------------------------ */

const WRITING_KEY = "iea_writing_submissions";

export async function listWritingSubmissions(): Promise<WritingSubmission[]> {
  if (!isFirebaseConfigured || !db) return read<WritingSubmission[]>(WRITING_KEY, []);
  const snap = await getDocs(collection(db, "writingSubmissions"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WritingSubmission, "id">) }));
}

export async function addWritingSubmission(submission: Omit<WritingSubmission, "id">): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    const id = crypto.randomUUID();
    write(WRITING_KEY, [{ id, ...submission }, ...read<WritingSubmission[]>(WRITING_KEY, [])]);
    return id;
  }
  const created = await addDoc(collection(db, "writingSubmissions"), submission);
  return created.id;
}

/* ------------------------------------------------------------------ *
 * Study Plans
 * ------------------------------------------------------------------ */

const STUDY_PLAN_KEY = "iea_study_plans";

export async function listStudyPlans(): Promise<StudyPlanRecord[]> {
  if (!isFirebaseConfigured || !db) return read<StudyPlanRecord[]>(STUDY_PLAN_KEY, []);
  const snap = await getDocs(collection(db, "studyPlans"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<StudyPlanRecord, "id">) }));
}

export async function addStudyPlan(plan: Omit<StudyPlanRecord, "id">): Promise<string> {
  if (!isFirebaseConfigured || !db) {
    const id = crypto.randomUUID();
    write(STUDY_PLAN_KEY, [{ id, ...plan }, ...read<StudyPlanRecord[]>(STUDY_PLAN_KEY, [])]);
    return id;
  }
  const created = await addDoc(collection(db, "studyPlans"), plan);
  return created.id;
}

export async function deleteStudyPlan(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    write(
      STUDY_PLAN_KEY,
      read<StudyPlanRecord[]>(STUDY_PLAN_KEY, []).filter((p) => p.id !== id),
    );
    return;
  }
  await deleteDoc(doc(db, "studyPlans", id));
}
