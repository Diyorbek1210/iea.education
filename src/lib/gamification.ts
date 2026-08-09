import { BADGES, type BadgeDef } from "@/data/badges";
import type { ActivityType, UserProfile } from "./types";

export const BONUS_UNLOCK_VIDEOS = 5;

export const XP_REWARDS = {
  VIDEO_WATCHED: 10,
  GAME_BASE: 5,
  GAME_SCORE_MULTIPLIER: 2,
  GAME_MAX_BONUS: 20,
  MOCK_TEST_COMPLETED: 50,
  PLACEMENT_TEST_COMPLETED: 15,
} as const;

export const DAILY_GOAL_PRESETS = [10, 20, 50] as const;
export const DEFAULT_DAILY_GOAL = 20;

export interface XpLevelDef {
  level: number;
  minXp: number;
  title: string;
}

export const XP_LEVELS: XpLevelDef[] = [
  { level: 1, minXp: 0, title: "Newcomer" },
  { level: 2, minXp: 100, title: "Learner" },
  { level: 3, minXp: 250, title: "Motivated" },
  { level: 4, minXp: 500, title: "Dedicated" },
  { level: 5, minXp: 900, title: "Fluent Fighter" },
  { level: 6, minXp: 1400, title: "Word Warrior" },
  { level: 7, minXp: 2000, title: "Language Master" },
  { level: 8, minXp: 3000, title: "IEA Legend" },
];

export function computeXpLevel(xp = 0): XpLevelDef {
  let current = XP_LEVELS[0]!;
  for (const def of XP_LEVELS) {
    if (xp >= def.minXp) current = def;
    else break;
  }
  return current;
}

export function nextXpLevel(xp = 0): XpLevelDef | null {
  const current = computeXpLevel(xp);
  return XP_LEVELS.find((def) => def.minXp > current.minXp) ?? null;
}

/* ---- date helpers, local-midnight based so the day boundary matches what
   the user sees on their own device (not UTC) ---- */

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y!, m! - 1, d!);
}

function daysBetween(a: string, b: string): number {
  return Math.round((parseDateKey(b).getTime() - parseDateKey(a).getTime()) / 86_400_000);
}

export function weekStartKey(today = todayKey()): string {
  const d = parseDateKey(today);
  const day = d.getDay(); // 0 Sun .. 6 Sat
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day)); // shift back to Monday
  return todayKey(d);
}

/* ---- streak algorithm ----
   gap === 0 -> same calendar day: no-op (todayXp keeps accumulating)
   gap === 1 -> consecutive day: streak += 1, todayXp resets to 0
   gap  >  1 -> missed day(s): streak resets to 1, todayXp resets to 0
   no lastActivityDate -> first-ever activity: streak = 1
   gap  <  0 -> clock skew: treat as same day (no-op) */
export function applyStreak(user: UserProfile, today = todayKey()) {
  const last = user.lastActivityDate;
  let streak = user.streak ?? 0;
  let todayXp = user.todayXp ?? 0;
  if (!last) {
    streak = 1;
    todayXp = 0;
  } else {
    const gap = daysBetween(last, today);
    if (gap === 1) {
      streak += 1;
      todayXp = 0;
    } else if (gap > 1) {
      streak = 1;
      todayXp = 0;
    }
    // gap === 0 or gap < 0: no-op
  }
  return {
    streak,
    longestStreak: Math.max(user.longestStreak ?? 0, streak),
    todayXp,
    lastActivityDate: today,
  };
}

/* ---- weekly leaderboard: reset on write, for the acting user ---- */
export function applyWeeklyReset(user: UserProfile, today = todayKey()) {
  const currentWeekStart = weekStartKey(today);
  const stillCurrentWeek = user.weekStartDate === currentWeekStart;
  return { weekStartDate: currentWeekStart, weeklyXp: stillCurrentWeek ? (user.weeklyXp ?? 0) : 0 };
}

/* ---- weekly leaderboard: lazy reset on READ, for everyone else. Never
   writes — a stale row is just treated as 0 for ranking until that user
   performs an activity of their own (persisted via applyWeeklyReset). ---- */
export function effectiveWeeklyXp(u: UserProfile, today = todayKey()): number {
  return u.weekStartDate === weekStartKey(today) ? (u.weeklyXp ?? 0) : 0;
}

export function xpForActivity(activity: ActivityType, opts?: { gameScore?: number }): number {
  switch (activity) {
    case "video":
      return XP_REWARDS.VIDEO_WATCHED;
    case "mockTest":
      return XP_REWARDS.MOCK_TEST_COMPLETED;
    case "placementTest":
      return XP_REWARDS.PLACEMENT_TEST_COMPLETED;
    case "game": {
      const bonus = Math.min(
        XP_REWARDS.GAME_MAX_BONUS,
        (opts?.gameScore ?? 0) * XP_REWARDS.GAME_SCORE_MULTIPLIER,
      );
      return XP_REWARDS.GAME_BASE + bonus;
    }
  }
}

function meetsCriteria(p: UserProfile, b: BadgeDef): boolean {
  const c = b.criteria;
  switch (c.type) {
    case "streak":
      return (p.streak ?? 0) >= c.days;
    case "videosWatched":
      return (p.videosWatched?.length ?? 0) >= c.count;
    case "mockTestsTaken":
      return (p.mockResults?.length ?? 0) >= c.count;
    case "gamesPlayed":
      return (p.gamesPlayed ?? 0) >= c.count;
    case "xp":
      return (p.xp ?? 0) >= c.amount;
    case "placementCompleted":
      return !!p.placementCompleted;
  }
}

export function evaluateBadges(profile: UserProfile): string[] {
  const unlocked = new Set(profile.badges ?? []);
  return BADGES.filter((b) => !unlocked.has(b.id) && meetsCriteria(profile, b)).map((b) => b.id);
}

/* ---- back-compat: fill defaults for profiles created before this feature
   shipped, in memory only (no write, no migration script needed). ---- */
export function withGamificationDefaults(p: UserProfile): UserProfile {
  return {
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
    ...p,
  };
}
