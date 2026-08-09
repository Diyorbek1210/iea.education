export type Level = "Beginner" | "Elementary" | "Intermediate" | "Upper-Intermediate" | "Advanced";

export type ActivityType = "video" | "game" | "mockTest" | "placementTest";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  level: Level | string;
  createdAt: string;
  videosWatched: string[];
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

export interface VideoDoc {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  createdAt: string;
  /** How `url` should be played. Missing on older docs — treat as "youtube". */
  sourceType?: "youtube" | "file";
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

export interface BonusLesson {
  title: string;
  description: string;
  url: string;
  /** How `url` should be played. Missing on older docs — treat as "youtube". */
  sourceType?: "youtube" | "file";
}

export interface PlacementQuestion {
  id: string;
  q: string;
  options: string[];
  answer: number;
  createdAt: string;
}
