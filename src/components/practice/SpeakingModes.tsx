import { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Volume2,
  Clock,
  AlertTriangle,
  MessageSquare,
  CreditCard,
  MessagesSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type SpeakingPart = 1 | 2 | 3;

interface SpeakingModeConfig {
  part: SpeakingPart;
  label: string;
  description: string;
  icon: typeof MessageSquare;
  prepTime: number;
  responseTime: number;
  questions: string[];
}

export const SPEAKING_MODES: SpeakingModeConfig[] = [
  {
    part: 1,
    label: "Part 1 — Interview",
    description: "Answer personal questions about familiar topics",
    icon: MessageSquare,
    prepTime: 0,
    responseTime: 30,
    questions: [
      "Do you work or study?",
      "What do you like most about your studies/job?",
      "Where are you from originally?",
      "What do you like about your hometown?",
      "Do you enjoy reading? Why or why not?",
      "What kind of music do you listen to?",
      "Do you prefer mornings or evenings? Why?",
      "What do you usually do on weekends?",
      "Do you like cooking? Why or why not?",
      "What are your plans for the future?",
    ],
  },
  {
    part: 2,
    label: "Part 2 — Cue Card",
    description: "Speak for 2 minutes on a topic after 1 minute preparation",
    icon: CreditCard,
    prepTime: 60,
    responseTime: 120,
    questions: [
      "Describe a book that you have read recently.\nYou should say:\n- what the book was about\n- why you decided to read it\n- what you liked about it\nand explain whether you would recommend it to others.",
      "Describe a place you would like to visit.\nYou should say:\n- where it is\n- what you know about it\n- what you would do there\nand explain why you want to visit this place.",
      "Describe a skill you would like to learn.\nYou should say:\n- what the skill is\n- how you would learn it\n- how long it would take\nand explain why you want to learn this skill.",
      "Describe a person who has influenced you.\nYou should say:\n- who this person is\n- how you met them\n- what they have done\nand explain how they have influenced your life.",
    ],
  },
  {
    part: 3,
    label: "Part 3 — Discussion",
    description: "Discuss abstract ideas and give detailed opinions",
    icon: MessagesSquare,
    prepTime: 0,
    responseTime: 60,
    questions: [
      "Do you think technology has made our lives easier or more complicated?",
      "What impact does social media have on young people?",
      "Should the government invest more in public transport?",
      "Do you think education should be free for everyone?",
      "What are the advantages and disadvantages of living in a city?",
      "How has the way people work changed in recent years?",
      "Do you think people today care more about the environment?",
      "What role should parents play in their children's education?",
    ],
  },
];

interface FluencyStats {
  wordCount: number;
  duration: number;
  wordsPerMinute: number;
  fillerWords: number;
  fillerRate: number;
}

const FILLER_PATTERNS =
  /\b(um|uh|like|you know|sort of|kind of|basically|actually|well|so|I mean)\b/gi;

export function analyzeFluency(transcript: string, durationSeconds: number): FluencyStats {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const duration = Math.max(1, durationSeconds);
  const wordsPerMinute = Math.round((wordCount / duration) * 60);
  const fillerMatches = transcript.match(FILLER_PATTERNS) ?? [];
  const fillerWords = fillerMatches.length;
  const fillerRate = wordCount > 0 ? Math.round((fillerWords / wordCount) * 100) : 0;

  return { wordCount, duration, wordsPerMinute, fillerWords, fillerRate };
}

export function SpeakingModeSelector({
  selectedPart,
  onSelect,
}: {
  selectedPart: SpeakingPart;
  onSelect: (part: SpeakingPart) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {SPEAKING_MODES.map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.part}
            onClick={() => onSelect(mode.part)}
            className={cn(
              "rounded-2xl border-2 p-4 text-left transition-all",
              selectedPart === mode.part
                ? "border-primary bg-primary/5 shadow-card"
                : "border-border hover:border-primary/50",
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                selectedPart === mode.part ? "text-primary" : "text-muted-foreground",
              )}
            />
            <p className="mt-2 font-bold text-foreground">{mode.label}</p>
            <p className="text-xs text-muted-foreground">{mode.description}</p>
          </button>
        );
      })}
    </div>
  );
}

export function FluencyAnalysisPanel({ stats }: { stats: FluencyStats }) {
  const wpmRating =
    stats.wordsPerMinute >= 120 && stats.wordsPerMinute <= 180
      ? "Good"
      : stats.wordsPerMinute < 120
        ? "Too slow"
        : "Very fast";
  const fillerRating =
    stats.fillerRate <= 3 ? "Excellent" : stats.fillerRate <= 8 ? "Good" : "Needs improvement";

  return (
    <div className="rounded-2xl bg-card p-4 shadow-card">
      <h4 className="text-sm font-bold text-foreground mb-3">Fluency Analysis</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Words per minute</p>
          <p className="text-lg font-extrabold text-foreground">{stats.wordsPerMinute}</p>
          <Badge variant={wpmRating === "Good" ? "default" : "secondary"} className="text-[10px]">
            {wpmRating}
          </Badge>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total words</p>
          <p className="text-lg font-extrabold text-foreground">{stats.wordCount}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Filler words</p>
          <p className="text-lg font-extrabold text-foreground">{stats.fillerWords}</p>
          <Badge variant={stats.fillerRate <= 3 ? "default" : "secondary"} className="text-[10px]">
            {fillerRating}
          </Badge>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Filler rate</p>
          <p className="text-lg font-extrabold text-foreground">{stats.fillerRate}%</p>
        </div>
      </div>
    </div>
  );
}
