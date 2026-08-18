export type Level = "Beginner" | "Elementary" | "Intermediate" | "Upper-Intermediate" | "Advanced";

export type ActivityType = "game" | "mockTest" | "placementTest";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  level: Level | string;
  createdAt: string;
  mockResults: string[];

  // --- Gamification (optional so pre-existing profiles stay valid) ---
  xp?: number;
  streak?: number;
  longestStreak?: number;
  lastActivityDate?: string; // "YYYY-MM-DD"
  todayXp?: number;
  dailyGoal?: number;
  weeklyXp?: number;
  weekStartDate?: string; // "YYYY-MM-DD", Monday of the current week
  badges?: string[];
  gamesPlayed?: number;
  placementCompleted?: boolean;
  completedMockTests?: string[];
}

export interface AiCriterion {
  label: string;
  band: number;
  comment: string;
}

export interface AiSkillFeedback {
  /** Which path produced this skill's band. */
  source: "ai" | "heuristic";
  /** Final band for the skill (from AI when source is "ai"). */
  band: number;
  /** Official IELTS criteria; empty when scored by the heuristic fallback. */
  criteria: AiCriterion[];
  /** One or two sentence overview; empty when scored by the heuristic fallback. */
  summary: string;
  /** Improvement advice; empty when scored by the heuristic fallback. */
  tips: string[];
}

export interface AiFeedback {
  writing: AiSkillFeedback;
  speaking?: AiSkillFeedback;
}

export interface MockResult {
  id: string;
  userId: string;
  userName: string;
  date: string;
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
  overall: number;
  mockTestId?: string;
  writingTexts?: { task1: string; task2: string };
  speakingTranscripts?: string[];
  feedback?: AiFeedback;
}

export interface ResourceDoc {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "official" | "video" | "book" | "website" | "app";
  skill: "all" | "listening" | "reading" | "writing" | "speaking";
  isFree: boolean;
  sourceType: "link" | "file";
  thumbnail: string;
  order: number;
  createdAt: string;
}

export interface PlacementQuestion {
  id: string;
  q: string;
  options: string[];
  answer: number;
  createdAt: string;
}

/* ------------------------------------------------------------------ *
 * Phase 1 — Vocabulary, Practice, Analytics types
 * ------------------------------------------------------------------ */

export interface PracticeSession {
  id: string;
  userId: string;
  skill: "listening" | "reading" | "writing" | "speaking";
  section: string;
  score: number;
  totalQuestions: number;
  durationMinutes: number;
  date: string;
  details?: string;
}

export interface WritingSubmission {
  id: string;
  userId: string;
  topicId: string;
  text: string;
  wordCount: number;
  bandScore?: number;
  feedback?: AiSkillFeedback;
  submittedAt: string;
}

export interface SpeakingSession {
  id: string;
  userId: string;
  part: 1 | 2 | 3;
  topic: string;
  transcript: string;
  durationSeconds: number;
  bandScore?: number;
  feedback?: AiSkillFeedback;
  fillerWords?: number;
  date: string;
}

export interface StudyPlanRecord {
  id: string;
  userId: string;
  targetBand: number;
  examDate: string;
  currentBand: number;
  weakSkills: string[];
  studyHoursPerDay: number;
  createdAt: string;
  weekSchedule: unknown;
}

export type SkillType = "listening" | "reading" | "writing" | "speaking";

export interface SkillStats {
  skill: SkillType;
  attempts: number;
  averageScore: number;
  bestScore: number;
  recentTrend: "improving" | "declining" | "stable";
}
