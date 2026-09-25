import {
  BookMarked,
  BookOpenText,
  Headphones,
  Languages,
  Mic,
  PenLine,
  SpellCheck,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

import type { LearningPathStepDoc } from "@/shared/types/types";

export const SKILL_COLOR = {
  listening: "#E6454F",
  reading: "#4A90D9",
  writing: "#E8873A",
  speaking: "#8B5CF6",
  grammar: "#0EA5A4",
  vocabulary: "#D964A6",
  pronunciation: "#2F9E7B",
  ielts: "#256A99",
} as const;

export const TECH: Record<string, { icon: ComponentType<{ className?: string }> & LucideIcon; color: string; label: string }> = {
  listening: { icon: Headphones, color: SKILL_COLOR.listening, label: "Listening" },
  reading: { icon: BookMarked, color: SKILL_COLOR.reading, label: "Reading" },
  writing: { icon: PenLine, color: SKILL_COLOR.writing, label: "Writing" },
  speaking: { icon: Mic, color: SKILL_COLOR.speaking, label: "Speaking" },
  grammar: { icon: SpellCheck, color: SKILL_COLOR.grammar, label: "Grammar" },
  vocabulary: { icon: BookOpenText, color: SKILL_COLOR.vocabulary, label: "Vocabulary" },
  pronunciation: { icon: Languages, color: SKILL_COLOR.pronunciation, label: "Pronunciation" },
  ielts: { icon: Target, color: SKILL_COLOR.ielts, label: "IELTS" },
};

export const TECH_KEYS = [
  "listening",
  "reading",
  "writing",
  "speaking",
  "grammar",
  "vocabulary",
  "pronunciation",
  "ielts",
] as const;

export const SEED_LEARNING_STEPS: LearningPathStepDoc[] = [
  {
    id: "step-intro",
    title: "Start: how the course works",
    description: "Meet the platform, take the level test and get your personal study plan.",
    tech: ["ielts"],
    lessons: 6,
    minutes: 120,
    order: 0,
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
  {
    id: "step-grammar",
    title: "Grammar & vocabulary",
    description: "Core tenses, articles and high-frequency vocabulary for bands 5-6.",
    tech: ["grammar", "vocabulary"],
    lessons: 12,
    minutes: 240,
    order: 1,
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
  {
    id: "step-listening",
    title: "Listening",
    description: "Learn the section formats, train with different accents and dictation drills.",
    tech: ["listening"],
    lessons: 10,
    minutes: 200,
    order: 2,
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
  {
    id: "step-reading",
    title: "Reading",
    description: "Skimming & scanning strategies, true/false/not-given and heading matching.",
    tech: ["reading"],
    lessons: 10,
    minutes: 220,
    order: 3,
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
  {
    id: "step-writing",
    title: "Writing",
    description: "Task 1 and Task 2: structure, coherence and the official marking criteria.",
    tech: ["writing", "grammar"],
    lessons: 14,
    minutes: 300,
    order: 4,
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
  {
    id: "step-speaking",
    title: "Speaking",
    description: "Parts 1-3: monologues, conversations with AI and common mistake analysis.",
    tech: ["speaking", "pronunciation"],
    lessons: 12,
    minutes: 260,
    order: 5,
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
  {
    id: "step-mock",
    title: "Full mock test",
    description: "Practice all four sections under real exam conditions and timing.",
    tech: ["listening", "reading", "writing", "speaking"],
    lessons: 4,
    minutes: 180,
    order: 6,
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
  {
    id: "step-finish",
    title: "Finish: goal achieved",
    description: "Get your certificate, unlock achievements and build your next plan.",
    tech: [],
    lessons: 1,
    minutes: 30,
    finish: true,
    order: 7,
    createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
  },
];
