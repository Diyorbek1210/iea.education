import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  arrayUnion,
  orderBy,
  query,
} from "firebase/firestore";

import { auth, db, isFirebaseConfigured } from "@/firebaseConfig";
import { deleteAuthUser } from "./authAdmin";
import { placementQuestions as staticPlacementQuestions } from "@/data/placement";
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
  BonusLesson,
  MockResult,
  PlacementQuestion,
  UserProfile,
  VideoDoc,
} from "./types";

/* ------------------------------------------------------------------ *
 * Local demo store — used automatically until firebaseConfig.ts holds
 * real credentials. Keeps every screen functional in the browser.
 * ------------------------------------------------------------------ */

const KEYS = {
  users: "iea_users",
  videos: "iea_videos",
  mocks: "iea_mock_results",
  bonus: "iea_bonus_lesson",
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

const seedVideos: VideoDoc[] = [
  {
    id: "v1",
    title: "IELTS Speaking Part 1 — Fluency Basics",
    description: "How to answer personal questions naturally and confidently.",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=60",
    createdAt: new Date().toISOString(),
  },
  {
    id: "v2",
    title: "Listening: Note Completion Strategy",
    description: "Predict answers before the recording starts and never lose your place.",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=60",
    createdAt: new Date().toISOString(),
  },
  {
    id: "v3",
    title: "Reading: True / False / Not Given",
    description: "The decision rules that make this question type simple.",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=60",
    createdAt: new Date().toISOString(),
  },
  {
    id: "v4",
    title: "Writing Task 2 — Essay Structure",
    description: "A repeatable four-paragraph plan for band 7+ essays.",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=60",
    createdAt: new Date().toISOString(),
  },
  {
    id: "v5",
    title: "Grammar Reset: Tenses in 20 Minutes",
    description: "Fix the tense mistakes that cost you marks in every skill.",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=60",
    createdAt: new Date().toISOString(),
  },
  {
    id: "v6",
    title: "Vocabulary for Describing Graphs",
    description: "Precise language for Writing Task 1 trends and comparisons.",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=60",
    createdAt: new Date().toISOString(),
  },
];

const defaultBonus: BonusLesson = {
  title: "Bonus: Full IELTS Speaking Masterclass",
  description:
    "Unlocked for learners who completed 5 video lessons. A complete walkthrough of all three Speaking parts with band-9 model answers.",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};

interface BonusItem extends BonusLesson {
  id: string;
  createdAt: string;
}

function localVideos(): VideoDoc[] {
  const existing = read<VideoDoc[] | null>(KEYS.videos, null);
  if (existing && existing.length) return existing;
  write(KEYS.videos, seedVideos);
  return seedVideos;
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
 * Video file uploads (admin-uploaded lessons, as opposed to YouTube links)
 * Hosted on Cloudinary's free tier via an unsigned upload preset — see
 * .env.example for setup. Firebase Storage isn't used here because it now
 * requires the paid Blaze plan just to enable it.
 * ------------------------------------------------------------------ */

const CLOUDINARY_CLOUD_NAME = import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"] as string | undefined;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env["VITE_CLOUDINARY_UPLOAD_PRESET"] as
  | string
  | undefined;

/** Cloudinary's free-plan cap for a single video file. */
export const MAX_LESSON_VIDEO_BYTES = 100 * 1024 * 1024;

/**
 * Uploads a video file for a lesson/bonus and returns its playable URL.
 * Files over Cloudinary's free-plan cap are compressed in the browser first
 * (see videoCompress.ts). `onCompressProgress` receives a 0–1 ratio while
 * the browser is transcoding.
 */
export async function uploadLessonVideo(
  file: File,
  folder: "videos" | "bonus",
  onCompressProgress?: (ratio: number) => void,
): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Video upload isn't configured yet. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET — see .env.example.",
    );
  }
  if (file.size > MAX_LESSON_VIDEO_BYTES) {
    const originalMb = Math.round(file.size / (1024 * 1024));
    const { compressVideo } = await import("./videoCompress");
    file = await compressVideo(file, onCompressProgress);
    if (file.size > MAX_LESSON_VIDEO_BYTES) {
      const mb = Math.round(file.size / (1024 * 1024));
      throw new Error(
        `Video is ${originalMb}MB and still ${mb}MB after compression — the free Cloudinary plan allows up to 100MB per file.`,
      );
    }
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  body.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
    { method: "POST", body },
  );
  if (!res.ok) {
    if (res.status === 413) {
      throw new Error(
        "The video is too large for Cloudinary's free plan (over 100MB even after compression). Trim it or compress it further before uploading.",
      );
    }
    const message = await res.text().catch(() => res.statusText);
    throw new Error(`Video upload failed: ${message}`);
  }
  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
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
 * Auth deletion runs through a server function (the client SDK can only
 * delete the current user's own account). Returns whether the Auth account
 * was removed too — false means the server key isn't configured, the Auth
 * account still exists, and the student could still log in.
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
      await deleteAuthUser({ data: { uid, idToken } });
      authDeleted = true;
    } catch (error) {
      console.warn("Firebase Auth account removal failed:", error);
    }
  }
  await deleteDoc(doc(db, "users", uid));
  return authDeleted;
}

export async function markVideoWatched(uid: string, videoId: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    const users = read<UserProfile[]>(KEYS.users, []);
    write(
      KEYS.users,
      users.map((u) =>
        u.uid === uid
          ? { ...u, videosWatched: Array.from(new Set([...(u.videosWatched ?? []), videoId])) }
          : u,
      ),
    );
    return;
  }
  await updateDoc(doc(db, "users", uid), { videosWatched: arrayUnion(videoId) });
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
 * Videos
 * ------------------------------------------------------------------ */

export async function listVideos(): Promise<VideoDoc[]> {
  if (!isFirebaseConfigured || !db) return localVideos();
  const snap = await getDocs(query(collection(db, "videos"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<VideoDoc, "id">) }));
}

export async function addVideo(video: Omit<VideoDoc, "id" | "createdAt">): Promise<void> {
  const payload = { ...video, createdAt: new Date().toISOString() };
  if (!isFirebaseConfigured || !db) {
    write(KEYS.videos, [{ id: crypto.randomUUID(), ...payload }, ...localVideos()]);
    return;
  }
  await addDoc(collection(db, "videos"), payload);
}

export async function updateVideo(id: string, data: Partial<VideoDoc>): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    write(
      KEYS.videos,
      localVideos().map((v) => (v.id === id ? { ...v, ...data } : v)),
    );
    return;
  }
  await updateDoc(doc(db, "videos", id), data);
}

export async function deleteVideo(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    write(
      KEYS.videos,
      localVideos().filter((v) => v.id !== id),
    );
    return;
  }
  await deleteDoc(doc(db, "videos", id));
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

/* ------------------------------------------------------------------ *
 * Bonus lesson
 * ------------------------------------------------------------------ */

export async function getBonusLesson(): Promise<BonusLesson> {
  if (!isFirebaseConfigured || !db) return read<BonusLesson>(KEYS.bonus, defaultBonus);
  const snap = await getDoc(doc(db, "content", "bonusLesson"));
  return snap.exists() ? (snap.data() as BonusLesson) : defaultBonus;
}

export async function saveBonusLesson(lesson: BonusLesson): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    write(KEYS.bonus, lesson);
    return;
  }
  await setDoc(doc(db, "content", "bonusLesson"), lesson);
}

/* ------------------------------------------------------------------ *
 * Bonus lessons (multiple items)
 * ------------------------------------------------------------------ */

const KEYS_BONUS_LESSONS = "iea_bonus_lessons";

function localBonusLessons(): BonusItem[] {
  const existing = read<BonusItem[] | null>(KEYS_BONUS_LESSONS, null);
  if (existing && existing.length) return existing;
  return [];
}

export async function listBonusLessons(): Promise<BonusItem[]> {
  if (!isFirebaseConfigured || !db) return localBonusLessons();
  const snap = await getDocs(query(collection(db, "bonusLessons"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BonusItem, "id">) }));
}

export async function addBonusLesson(lesson: Omit<BonusItem, "id" | "createdAt">): Promise<void> {
  const payload = { ...lesson, createdAt: new Date().toISOString() };
  if (!isFirebaseConfigured || !db) {
    write(KEYS_BONUS_LESSONS, [{ id: crypto.randomUUID(), ...payload }, ...localBonusLessons()]);
    return;
  }
  await addDoc(collection(db, "bonusLessons"), payload);
}

export async function updateBonusLesson(
  id: string,
  data: Partial<Omit<BonusItem, "id" | "createdAt">>,
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    write(
      KEYS_BONUS_LESSONS,
      localBonusLessons().map((b) => (b.id === id ? { ...b, ...data } : b)),
    );
    return;
  }
  await updateDoc(doc(db, "bonusLessons", id), data);
}

export async function deleteBonusLesson(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    write(
      KEYS_BONUS_LESSONS,
      localBonusLessons().filter((b) => b.id !== id),
    );
    return;
  }
  await deleteDoc(doc(db, "bonusLessons", id));
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
