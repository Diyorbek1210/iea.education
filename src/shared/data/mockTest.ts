export type {
  FillQuestion,
  ListeningSection,
  McQuestion,
  MockTestSet,
  ReadingPassage,
  SpeakingQuestion,
  WritingTasks,
} from "./mockTests/types";

import { mock1 } from "./mockTests/mock-1";
import { mock2 } from "./mockTests/mock-2";
import { mock3 } from "./mockTests/mock-3";
import { mock4 } from "./mockTests/mock-4";
import { mock5 } from "./mockTests/mock-5";
import { mock6 } from "./mockTests/mock-6";
import { mock7 } from "./mockTests/mock-7";
import { mock8 } from "./mockTests/mock-8";
import { mock9 } from "./mockTests/mock-9";
import { mock10 } from "./mockTests/mock-10";
import type { MockTestSet } from "./mockTests/types";

export const mockTests: MockTestSet[] = [
  mock1,
  mock2,
  mock3,
  mock4,
  mock5,
  mock6,
  mock7,
  mock8,
  mock9,
  mock10,
];

/** Very simple heuristic band estimate for typed or transcribed responses. */
export function estimateWritten(text: string, target: number): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  const ratio = Math.min(words / target, 1);
  const unique = new Set(text.toLowerCase().match(/[a-z']+/g) ?? []).size;
  const variety = Math.min(unique / Math.max(words * 0.45, 1), 1);
  return Math.round((3 + ratio * 4 + variety * 2) * 2) / 2;
}

/* ------------------------------------------------------------------ *
 * Real IELTS-style raw-score-to-band conversion tables (out of 40).
 * These mirror the commonly published approximate official tables.
 * ------------------------------------------------------------------ */

const LISTENING_BAND_TABLE: Array<[minCorrect: number, band: number]> = [
  [39, 9],
  [37, 8.5],
  [35, 8],
  [32, 7.5],
  [30, 7],
  [26, 6.5],
  [23, 6],
  [18, 5.5],
  [16, 5],
  [13, 4.5],
  [10, 4],
  [8, 3.5],
  [6, 3],
  [4, 2.5],
  [0, 2],
];

const READING_BAND_TABLE: Array<[minCorrect: number, band: number]> = [
  [39, 9],
  [37, 8.5],
  [35, 8],
  [33, 7.5],
  [30, 7],
  [27, 6.5],
  [23, 6],
  [19, 5.5],
  [15, 5],
  [13, 4.5],
  [10, 4],
  [8, 3.5],
  [6, 3],
  [4, 2.5],
  [0, 2],
];

function bandFromTable(correct: number, table: Array<[number, number]>): number {
  for (const [min, band] of table) {
    if (correct >= min) return band;
  }
  return 0;
}

export function listeningBand(correct: number): number {
  return bandFromTable(correct, LISTENING_BAND_TABLE);
}

export function readingBand(correct: number): number {
  return bandFromTable(correct, READING_BAND_TABLE);
}
