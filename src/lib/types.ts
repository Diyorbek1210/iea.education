export type Level =
  | "Beginner"
  | "Elementary"
  | "Intermediate"
  | "Upper-Intermediate"
  | "Advanced";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  level: Level | string;
  createdAt: string;
  videosWatched: string[];
  mockResults: string[];
}

export interface VideoDoc {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  createdAt: string;
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
}

export interface BonusLesson {
  title: string;
  description: string;
  url: string;
}
