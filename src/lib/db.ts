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
import { VOCABULARY, type VocabWord, type VocabTopic } from "@/data/vocabulary";
import { MODEL_ANSWERS, type ModelAnswer } from "@/data/modelAnswers";
import {
  COUNTRY_REQUIREMENTS,
  POPULAR_UNIVERSITIES,
  type CountryRequirement,
  type UniversityRequirement,
} from "@/data/requirements";
import type { MockTestSet } from "@/data/mockTests/types";
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
  CommunityThread,
  CommunityReply,
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
  vocabulary: "iea_vocabulary",
  modelAnswers: "iea_model_answers",
  countryRequirements: "iea_country_requirements",
  universityRequirements: "iea_university_requirements",
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

/* ------------------------------------------------------------------ *
 * Firestore Seed — write ALL static data to Firestore in one call.
 * Run once to populate the database, then all list*() functions
 * read from Firestore directly.
 * ------------------------------------------------------------------ */

export interface SeedProgress {
  collection: string;
  count: number;
  status: "done" | "error";
  error?: string;
}

export async function seedAllDataToFirestore(): Promise<SeedProgress[]> {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Cannot seed Firestore.");
  }

  const results: SeedProgress[] = [];

  // 1. Placement questions
  try {
    const existing = await getDocs(collection(db, "placementQuestions"));
    if (existing.empty) {
      for (const q of seedPlacementQuestions) {
        const { id, ...rest } = q;
        await setDoc(doc(db, "placementQuestions", id), rest);
      }
    }
    results.push({
      collection: "placementQuestions",
      count: seedPlacementQuestions.length,
      status: "done",
    });
  } catch (e) {
    results.push({ collection: "placementQuestions", count: 0, status: "error", error: String(e) });
  }

  // 2. Resources
  try {
    const existing = await getDocs(collection(db, "resources"));
    if (existing.empty) {
      const seeded = IELTS_RESOURCES.map((r, i) => ({
        ...r,
        sourceType: "link" as const,
        thumbnail: "",
        order: i,
        createdAt: new Date().toISOString(),
      }));
      for (const res of seeded) {
        const { id, ...rest } = res;
        await setDoc(doc(db, "resources", id), rest);
      }
    }
    results.push({ collection: "resources", count: IELTS_RESOURCES.length, status: "done" });
  } catch (e) {
    results.push({ collection: "resources", count: 0, status: "error", error: String(e) });
  }

  // 3. Vocabulary
  try {
    const existing = await getDocs(collection(db, "vocabulary"));
    if (existing.empty) {
      const seeded = VOCABULARY.map((w, i) => ({ ...w, id: `v${i + 1}` }));
      for (const w of seeded) {
        const { id, ...rest } = w;
        await setDoc(doc(db, "vocabulary", id), rest);
      }
    }
    results.push({ collection: "vocabulary", count: VOCABULARY.length, status: "done" });
  } catch (e) {
    results.push({ collection: "vocabulary", count: 0, status: "error", error: String(e) });
  }

  // 4. Model answers
  try {
    const existing = await getDocs(collection(db, "modelAnswers"));
    if (existing.empty) {
      for (const a of MODEL_ANSWERS) {
        await setDoc(doc(db, "modelAnswers", a.id), { ...a });
      }
    }
    results.push({ collection: "modelAnswers", count: MODEL_ANSWERS.length, status: "done" });
  } catch (e) {
    results.push({ collection: "modelAnswers", count: 0, status: "error", error: String(e) });
  }

  // 5. Country requirements
  try {
    const existing = await getDocs(collection(db, "countryRequirements"));
    if (existing.empty) {
      const seeded = COUNTRY_REQUIREMENTS.map((r, i) => ({ ...r, id: `cr${i + 1}` }));
      for (const r of seeded) {
        const { id, ...rest } = r;
        await setDoc(doc(db, "countryRequirements", id), rest);
      }
    }
    results.push({
      collection: "countryRequirements",
      count: COUNTRY_REQUIREMENTS.length,
      status: "done",
    });
  } catch (e) {
    results.push({
      collection: "countryRequirements",
      count: 0,
      status: "error",
      error: String(e),
    });
  }

  // 6. University requirements
  try {
    const existing = await getDocs(collection(db, "universityRequirements"));
    if (existing.empty) {
      const seeded = POPULAR_UNIVERSITIES.map((r, i) => ({ ...r, id: `ur${i + 1}` }));
      for (const r of seeded) {
        const { id, ...rest } = r;
        await setDoc(doc(db, "universityRequirements", id), rest);
      }
    }
    results.push({
      collection: "universityRequirements",
      count: POPULAR_UNIVERSITIES.length,
      status: "done",
    });
  } catch (e) {
    results.push({
      collection: "universityRequirements",
      count: 0,
      status: "error",
      error: String(e),
    });
  }

  // 7. Mock tests
  try {
    const existing = await getDocs(collection(db, "mockTests"));
    if (existing.empty) {
      const { mockTests: staticMockTests } = await import("@/data/mockTest");
      for (const m of staticMockTests) {
        await setDoc(doc(db, "mockTests", m.id), { ...m });
      }
      results.push({ collection: "mockTests", count: staticMockTests.length, status: "done" });
    } else {
      results.push({ collection: "mockTests", count: 0, status: "done" });
    }
  } catch (e) {
    results.push({ collection: "mockTests", count: 0, status: "error", error: String(e) });
  }

  // 8. Community threads (seed data)
  try {
    const existing = await getDocs(collection(db, "communityThreads"));
    if (existing.empty) {
      for (const thread of SEED_THREADS) {
        const { replies, ...rest } = thread;
        await setDoc(doc(db, "communityThreads", thread.id), rest);
        for (const reply of replies) {
          await addDoc(collection(db, "communityThreads", thread.id, "replies"), reply);
        }
      }
    }
    results.push({ collection: "communityThreads", count: SEED_THREADS.length, status: "done" });
  } catch (e) {
    results.push({ collection: "communityThreads", count: 0, status: "error", error: String(e) });
  }

  return results;
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
  if (snap.empty) {
    const seeded = IELTS_RESOURCES.map((r, i) => ({
      ...r,
      sourceType: "link" as const,
      thumbnail: "",
      order: i,
      createdAt: new Date().toISOString(),
    }));
    for (const res of seeded) {
      const { id, ...data } = res;
      await setDoc(doc(db, "resources", id), data);
    }
    return seeded;
  }
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ResourceDoc, "id">) }));
}

export async function addResource(
  resource: Omit<ResourceDoc, "id" | "createdAt" | "order">,
): Promise<void> {
  const now = new Date().toISOString();
  if (!isFirebaseConfigured || !db) {
    const existing = read<ResourceDoc[]>(KEYS.resources, []);
    const maxOrder = existing.reduce((max, r) => Math.max(max, r.order), -1);
    write(KEYS.resources, [
      ...existing,
      { ...resource, id: crypto.randomUUID(), order: maxOrder + 1, createdAt: now },
    ]);
    return;
  }
  const snap = await getDocs(collection(db, "resources"));
  const maxOrder = snap.docs.reduce((max, d) => {
    const data = d.data() as Omit<ResourceDoc, "id">;
    return Math.max(max, data.order ?? 0);
  }, -1);
  await addDoc(collection(db, "resources"), { ...resource, order: maxOrder + 1, createdAt: now });
}

export async function updateResource(
  id: string,
  data: Partial<Omit<ResourceDoc, "id" | "createdAt">>,
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<ResourceDoc[]>(KEYS.resources, []);
    write(
      KEYS.resources,
      existing.map((r) => (r.id === id ? { ...r, ...data } : r)),
    );
    return;
  }
  await updateDoc(doc(db, "resources", id), data);
}

export async function deleteResource(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<ResourceDoc[]>(KEYS.resources, []);
    const filtered = existing.filter((r) => r.id !== id);
    filtered.forEach((r, i) => {
      r.order = i;
    });
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

export async function addWritingSubmission(
  submission: Omit<WritingSubmission, "id">,
): Promise<string> {
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

/* ------------------------------------------------------------------ *
 * Vocabulary (admin-managed)
 * ------------------------------------------------------------------ */

export interface VocabWordDoc extends VocabWord {
  id: string;
}

const VOCAB_KEY = "iea_vocabulary";

function seedLocalVocabulary(): VocabWordDoc[] {
  const existing = read<VocabWordDoc[] | null>(VOCAB_KEY, null);
  if (existing && existing.length) return existing;
  const seeded = VOCABULARY.map((w, i) => ({ ...w, id: `v${i + 1}` }));
  write(VOCAB_KEY, seeded);
  return seeded;
}

export async function listVocabulary(): Promise<VocabWordDoc[]> {
  if (!isFirebaseConfigured || !db) return seedLocalVocabulary();
  const snap = await getDocs(query(collection(db, "vocabulary"), orderBy("word", "asc")));
  if (snap.empty) {
    const seeded = VOCABULARY.map((w, i) => ({ ...w, id: `v${i + 1}` }));
    await Promise.all(seeded.map(({ id, ...rest }) => setDoc(doc(db!, "vocabulary", id), rest)));
    return seeded;
  }
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<VocabWordDoc, "id">) }));
}

export async function addVocabWord(word: Omit<VocabWordDoc, "id">): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<VocabWordDoc[]>(VOCAB_KEY, []);
    write(VOCAB_KEY, [...existing, { ...word, id: crypto.randomUUID() }]);
    return;
  }
  await addDoc(collection(db, "vocabulary"), word);
}

export async function updateVocabWord(
  id: string,
  data: Partial<Omit<VocabWordDoc, "id">>,
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<VocabWordDoc[]>(VOCAB_KEY, []);
    write(
      VOCAB_KEY,
      existing.map((w) => (w.id === id ? { ...w, ...data } : w)),
    );
    return;
  }
  await updateDoc(doc(db, "vocabulary", id), data);
}

export async function deleteVocabWord(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    write(
      VOCAB_KEY,
      read<VocabWordDoc[]>(VOCAB_KEY, []).filter((w) => w.id !== id),
    );
    return;
  }
  await deleteDoc(doc(db, "vocabulary", id));
}

/* ------------------------------------------------------------------ *
 * Model Answers (admin-managed)
 * ------------------------------------------------------------------ */

export interface ModelAnswerDoc extends ModelAnswer {
  id: string;
}

const MODEL_ANSWER_KEY = "iea_model_answers";

function seedLocalModelAnswers(): ModelAnswerDoc[] {
  const existing = read<ModelAnswerDoc[] | null>(MODEL_ANSWER_KEY, null);
  if (existing && existing.length) return existing;
  write(MODEL_ANSWER_KEY, MODEL_ANSWERS);
  return MODEL_ANSWERS;
}

export async function listModelAnswers(): Promise<ModelAnswerDoc[]> {
  if (!isFirebaseConfigured || !db) return seedLocalModelAnswers();
  const snap = await getDocs(query(collection(db, "modelAnswers"), orderBy("title", "asc")));
  if (snap.empty) {
    await Promise.all(MODEL_ANSWERS.map((a) => setDoc(doc(db!, "modelAnswers", a.id), { ...a })));
    return MODEL_ANSWERS;
  }
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ModelAnswerDoc, "id">) }));
}

export async function addModelAnswer(answer: Omit<ModelAnswerDoc, "id">): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<ModelAnswerDoc[]>(MODEL_ANSWER_KEY, []);
    write(MODEL_ANSWER_KEY, [...existing, { ...answer, id: crypto.randomUUID() }]);
    return;
  }
  await addDoc(collection(db, "modelAnswers"), answer);
}

export async function updateModelAnswer(
  id: string,
  data: Partial<Omit<ModelAnswerDoc, "id">>,
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<ModelAnswerDoc[]>(MODEL_ANSWER_KEY, []);
    write(
      MODEL_ANSWER_KEY,
      existing.map((a) => (a.id === id ? { ...a, ...data } : a)),
    );
    return;
  }
  await updateDoc(doc(db, "modelAnswers", id), data);
}

export async function deleteModelAnswer(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    write(
      MODEL_ANSWER_KEY,
      read<ModelAnswerDoc[]>(MODEL_ANSWER_KEY, []).filter((a) => a.id !== id),
    );
    return;
  }
  await deleteDoc(doc(db, "modelAnswers", id));
}

/* ------------------------------------------------------------------ *
 * Requirements (admin-managed)
 * ------------------------------------------------------------------ */

export interface CountryRequirementDoc extends CountryRequirement {
  id: string;
}

export interface UniversityRequirementDoc extends UniversityRequirement {
  id: string;
}

const COUNTRY_REQ_KEY = "iea_country_requirements";
const UNI_REQ_KEY = "iea_university_requirements";

function seedLocalCountryRequirements(): CountryRequirementDoc[] {
  const existing = read<CountryRequirementDoc[] | null>(COUNTRY_REQ_KEY, null);
  if (existing && existing.length) return existing;
  const seeded = COUNTRY_REQUIREMENTS.map((r, i) => ({ ...r, id: `cr${i + 1}` }));
  write(COUNTRY_REQ_KEY, seeded);
  return seeded;
}

function seedLocalUniversityRequirements(): UniversityRequirementDoc[] {
  const existing = read<UniversityRequirementDoc[] | null>(UNI_REQ_KEY, null);
  if (existing && existing.length) return existing;
  const seeded = POPULAR_UNIVERSITIES.map((r, i) => ({ ...r, id: `ur${i + 1}` }));
  write(UNI_REQ_KEY, seeded);
  return seeded;
}

export async function listCountryRequirements(): Promise<CountryRequirementDoc[]> {
  if (!isFirebaseConfigured || !db) return seedLocalCountryRequirements();
  const snap = await getDocs(
    query(collection(db, "countryRequirements"), orderBy("country", "asc")),
  );
  if (snap.empty) {
    const seeded = COUNTRY_REQUIREMENTS.map((r, i) => ({ ...r, id: `cr${i + 1}` }));
    await Promise.all(
      seeded.map(({ id, ...rest }) => setDoc(doc(db!, "countryRequirements", id), rest)),
    );
    return seeded;
  }
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CountryRequirementDoc, "id">) }));
}

export async function addCountryRequirement(req: Omit<CountryRequirementDoc, "id">): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<CountryRequirementDoc[]>(COUNTRY_REQ_KEY, []);
    write(COUNTRY_REQ_KEY, [...existing, { ...req, id: crypto.randomUUID() }]);
    return;
  }
  await addDoc(collection(db, "countryRequirements"), req);
}

export async function updateCountryRequirement(
  id: string,
  data: Partial<Omit<CountryRequirementDoc, "id">>,
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<CountryRequirementDoc[]>(COUNTRY_REQ_KEY, []);
    write(
      COUNTRY_REQ_KEY,
      existing.map((r) => (r.id === id ? { ...r, ...data } : r)),
    );
    return;
  }
  await updateDoc(doc(db, "countryRequirements", id), data);
}

export async function deleteCountryRequirement(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    write(
      COUNTRY_REQ_KEY,
      read<CountryRequirementDoc[]>(COUNTRY_REQ_KEY, []).filter((r) => r.id !== id),
    );
    return;
  }
  await deleteDoc(doc(db, "countryRequirements", id));
}

export async function listUniversityRequirements(): Promise<UniversityRequirementDoc[]> {
  if (!isFirebaseConfigured || !db) return seedLocalUniversityRequirements();
  const snap = await getDocs(
    query(collection(db, "universityRequirements"), orderBy("university", "asc")),
  );
  if (snap.empty) {
    const seeded = POPULAR_UNIVERSITIES.map((r, i) => ({ ...r, id: `ur${i + 1}` }));
    await Promise.all(
      seeded.map(({ id, ...rest }) => setDoc(doc(db!, "universityRequirements", id), rest)),
    );
    return seeded;
  }
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<UniversityRequirementDoc, "id">),
  }));
}

export async function addUniversityRequirement(
  req: Omit<UniversityRequirementDoc, "id">,
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<UniversityRequirementDoc[]>(UNI_REQ_KEY, []);
    write(UNI_REQ_KEY, [...existing, { ...req, id: crypto.randomUUID() }]);
    return;
  }
  await addDoc(collection(db, "universityRequirements"), req);
}

export async function updateUniversityRequirement(
  id: string,
  data: Partial<Omit<UniversityRequirementDoc, "id">>,
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<UniversityRequirementDoc[]>(UNI_REQ_KEY, []);
    write(
      UNI_REQ_KEY,
      existing.map((r) => (r.id === id ? { ...r, ...data } : r)),
    );
    return;
  }
  await updateDoc(doc(db, "universityRequirements", id), data);
}

export async function deleteUniversityRequirement(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    write(
      UNI_REQ_KEY,
      read<UniversityRequirementDoc[]>(UNI_REQ_KEY, []).filter((r) => r.id !== id),
    );
    return;
  }
  await deleteDoc(doc(db, "universityRequirements", id));
}

/* ------------------------------------------------------------------ *
 * Mock Tests (admin-managed)
 * ------------------------------------------------------------------ */

const MOCK_TEST_KEY = "iea_mock_tests";

function seedLocalMockTests(): MockTestSet[] {
  const existing = read<MockTestSet[] | null>(MOCK_TEST_KEY, null);
  if (existing && existing.length) return existing;
  return [];
}

export async function listMockTests(): Promise<MockTestSet[]> {
  if (!isFirebaseConfigured || !db) {
    const local = seedLocalMockTests();
    if (local.length) return local;
    const { mockTests: staticMockTests } = await import("@/data/mockTest");
    write(MOCK_TEST_KEY, staticMockTests);
    return staticMockTests;
  }
  const snap = await getDocs(query(collection(db, "mockTests"), orderBy("order", "asc")));
  if (snap.empty) {
    const { mockTests: staticMockTests } = await import("@/data/mockTest");
    await Promise.all(staticMockTests.map((m) => setDoc(doc(db!, "mockTests", m.id), { ...m })));
    return staticMockTests;
  }
  return snap.docs.map((d) => d.data() as MockTestSet);
}

export async function addMockTest(mock: MockTestSet): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<MockTestSet[]>(MOCK_TEST_KEY, []);
    write(MOCK_TEST_KEY, [...existing, mock]);
    return;
  }
  await setDoc(doc(db, "mockTests", mock.id), { ...mock });
}

export async function updateMockTest(id: string, data: Partial<MockTestSet>): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const existing = read<MockTestSet[]>(MOCK_TEST_KEY, []);
    write(
      MOCK_TEST_KEY,
      existing.map((m) => (m.id === id ? { ...m, ...data } : m)),
    );
    return;
  }
  await updateDoc(doc(db, "mockTests", id), data);
}

export async function deleteMockTest(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    write(
      MOCK_TEST_KEY,
      read<MockTestSet[]>(MOCK_TEST_KEY, []).filter((m) => m.id !== id),
    );
    return;
  }
  await deleteDoc(doc(db, "mockTests", id));
}

/* ------------------------------------------------------------------ *
 * Community Threads & Replies
 * ------------------------------------------------------------------ */

const COMMUNITY_KEY = "iea_community_threads";

const SEED_THREADS: CommunityThread[] = [
  {
    id: "t1",
    title: "How I improved from Band 6 to 7.5 in Writing",
    author: "Admin",
    authorEmail: "diyorbekmuzaffarovich4@gmail.com",
    category: "experience",
    content:
      "I focused on Task Response and Coherence. Here are my top 3 tips:\n\n1. Always spend 5 minutes planning before writing\n2. Use discourse markers to connect paragraphs\n3. Write a clear thesis statement in your introduction\n\nThe biggest game changer was timing - I practiced writing 250 words in exactly 40 minutes until it became natural.",
    replies: [
      {
        id: "r1",
        author: "Ahmed K.",
        authorEmail: undefined,
        content:
          "Great tips! The planning phase is so underrated. I always rush into writing and it shows.",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        likes: 5,
      },
      {
        id: "r2",
        author: "Li Wei",
        authorEmail: undefined,
        content: "Can you share more about discourse markers? I struggle with cohesion.",
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        likes: 3,
      },
    ],
    likes: 24,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "t2",
    title: "Best resources for Listening Section 4?",
    author: "Raj P.",
    authorEmail: undefined,
    category: "question",
    content:
      "I keep losing marks in Section 4 because the academic vocabulary is so dense. Does anyone have tips or resources specifically for this section? I'm currently scoring 6.5 in Listening overall but Section 4 brings me down.",
    replies: [
      {
        id: "r3",
        author: "Emma T.",
        authorEmail: undefined,
        content:
          "Try the BBC podcasts - they have similar academic content. Also, practice note-taking while listening to TED talks.",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        likes: 8,
      },
    ],
    likes: 12,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "t3",
    title: "Speaking Part 2 - Use the full 1 minute preparation",
    author: "Yuki H.",
    authorEmail: undefined,
    category: "tips",
    content:
      "Many candidates waste the 1-minute preparation time. Here's my method:\n\n- 20 seconds: Read all bullet points carefully\n- 20 seconds: Jot down keywords for each bullet\n- 20 seconds: Plan your opening sentence\n\nThis gives you a clear structure and prevents you from going off-topic during the 2-minute speech.",
    replies: [],
    likes: 18,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

function seedLocalCommunity(): CommunityThread[] {
  const existing = read<CommunityThread[] | null>(COMMUNITY_KEY, null);
  if (existing && existing.length) return existing;
  write(COMMUNITY_KEY, SEED_THREADS);
  return SEED_THREADS;
}

export async function listCommunityThreads(): Promise<CommunityThread[]> {
  if (!isFirebaseConfigured || !db) return seedLocalCommunity();
  const snap = await getDocs(
    query(collection(db, "communityThreads"), orderBy("createdAt", "desc")),
  );
  if (snap.empty) {
    for (const thread of SEED_THREADS) {
      const { replies, ...rest } = thread;
      await setDoc(doc(db!, "communityThreads", thread.id), rest);
      for (const reply of replies) {
        await addDoc(collection(db!, "communityThreads", thread.id, "replies"), reply);
      }
    }
    return SEED_THREADS;
  }
  const threads: CommunityThread[] = [];
  for (const d of snap.docs) {
    const data = d.data() as Omit<CommunityThread, "id" | "replies">;
    const repliesSnap = await getDocs(
      query(collection(db, "communityThreads", d.id, "replies"), orderBy("createdAt", "asc")),
    );
    const replies = repliesSnap.docs.map((r) => ({
      id: r.id,
      ...(r.data() as Omit<CommunityReply, "id">),
    }));
    threads.push({ id: d.id, ...data, replies });
  }
  return threads;
}

export async function createCommunityThread(
  thread: Omit<CommunityThread, "id" | "replies" | "likes" | "createdAt">,
): Promise<CommunityThread> {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const full: CommunityThread = { ...thread, id, replies: [], likes: 0, createdAt: now };
  if (!isFirebaseConfigured || !db) {
    const existing = read<CommunityThread[]>(COMMUNITY_KEY, []);
    write(COMMUNITY_KEY, [full, ...existing]);
    return full;
  }
  const ref = await addDoc(collection(db, "communityThreads"), {
    title: thread.title,
    author: thread.author,
    authorEmail: thread.authorEmail,
    category: thread.category,
    content: thread.content,
    likes: 0,
    createdAt: now,
  });
  return { ...full, id: ref.id };
}

export async function addCommunityReply(
  threadId: string,
  reply: Omit<CommunityReply, "id" | "likes" | "createdAt">,
): Promise<CommunityReply> {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const full: CommunityReply = { ...reply, id, likes: 0, createdAt: now };
  if (!isFirebaseConfigured || !db) {
    const threads = read<CommunityThread[]>(COMMUNITY_KEY, []);
    write(
      COMMUNITY_KEY,
      threads.map((t) => (t.id === threadId ? { ...t, replies: [...t.replies, full] } : t)),
    );
    return full;
  }
  const ref = await addDoc(collection(db, "communityThreads", threadId, "replies"), {
    author: reply.author,
    authorEmail: reply.authorEmail,
    content: reply.content,
    likes: 0,
    createdAt: now,
  });
  return { ...full, id: ref.id };
}

export async function toggleCommunityThreadLike(threadId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const threads = read<CommunityThread[]>(COMMUNITY_KEY, []);
    write(
      COMMUNITY_KEY,
      threads.map((t) => (t.id === threadId ? { ...t, likes: t.likes + 1 } : t)),
    );
    return;
  }
  const snap = await getDoc(doc(db, "communityThreads", threadId));
  if (snap.exists()) {
    const data = snap.data() as { likes?: number };
    await updateDoc(doc(db, "communityThreads", threadId), { likes: (data.likes ?? 0) + 1 });
  }
}

export async function toggleCommunityReplyLike(threadId: string, replyId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const threads = read<CommunityThread[]>(COMMUNITY_KEY, []);
    write(
      COMMUNITY_KEY,
      threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              replies: t.replies.map((r) => (r.id === replyId ? { ...r, likes: r.likes + 1 } : r)),
            }
          : t,
      ),
    );
    return;
  }
  const snap = await getDoc(doc(db, "communityThreads", threadId, "replies", replyId));
  if (snap.exists()) {
    const data = snap.data() as { likes?: number };
    await updateDoc(doc(db, "communityThreads", threadId, "replies", replyId), {
      likes: (data.likes ?? 0) + 1,
    });
  }
}

export async function deleteCommunityThread(threadId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    write(
      COMMUNITY_KEY,
      read<CommunityThread[]>(COMMUNITY_KEY, []).filter((t) => t.id !== threadId),
    );
    return;
  }
  const repliesSnap = await getDocs(collection(db, "communityThreads", threadId, "replies"));
  for (const r of repliesSnap.docs) {
    await deleteDoc(r.ref);
  }
  await deleteDoc(doc(db, "communityThreads", threadId));
}

export async function deleteCommunityReply(threadId: string, replyId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const threads = read<CommunityThread[]>(COMMUNITY_KEY, []);
    write(
      COMMUNITY_KEY,
      threads.map((t) =>
        t.id === threadId ? { ...t, replies: t.replies.filter((r) => r.id !== replyId) } : t,
      ),
    );
    return;
  }
  await deleteDoc(doc(db, "communityThreads", threadId, "replies", replyId));
}
