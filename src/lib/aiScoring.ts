import { createServerFn } from "@tanstack/react-start";

import {
  SPEAKING_CRITERIA_LABELS,
  WRITING_CRITERIA_LABELS,
  parseSkillFeedback,
  speakingPrompt,
  writingPrompt,
  type ScoreInput,
} from "@/lib/aiScoringCore";

function isScoreInput(data: unknown): data is ScoreInput {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d["task1Prompt"] === "string" &&
    typeof d["task1Text"] === "string" &&
    typeof d["task2Prompt"] === "string" &&
    typeof d["task2Text"] === "string" &&
    Array.isArray(d["speakingQuestions"]) &&
    Array.isArray(d["speakingTranscripts"])
  );
}

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Gemini request failed (${response.status}): ${errBody.slice(0, 300)}`);
    }
    const json = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string") throw new Error("Gemini response had no text part");
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

export const scoreMockPerformance = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!isScoreInput(data)) throw new Error("Invalid input for AI scoring");
    return {
      task1Prompt: data.task1Prompt.slice(0, 2000),
      task1Text: data.task1Text.slice(0, 6000),
      task2Prompt: data.task2Prompt.slice(0, 2000),
      task2Text: data.task2Text.slice(0, 6000),
      speakingQuestions: data.speakingQuestions.slice(0, 10).map((s) => String(s).slice(0, 500)),
      speakingTranscripts: data.speakingTranscripts
        .slice(0, 10)
        .map((s) => String(s).slice(0, 4500)),
    } satisfies ScoreInput;
  })
  .handler(async ({ data }) => {
    // Vite dev loads only VITE_-prefixed .env vars into process.env, and preview/deploy
    // environments (wrangler, nitro) may not load .env at all. When the key is missing,
    // try loading it from .env here (a no op where the key is already set or fs is absent).
    if (!process.env["GEMINI_API_KEY"]) {
      try {
        const dotenv = await import("dotenv");
        dotenv.config();
      } catch {
        // No filesystem access (edge runtime) — the key must come from real env vars.
      }
    }

    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) {
      console.error("[aiScoring] GEMINI_API_KEY is not visible to the server process");
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const hasSpeaking = data.speakingTranscripts.some((t) => t.trim().length > 0);
    const [writing, speaking] = await Promise.all([
      callGemini(apiKey, writingPrompt(data))
        .then((text) => {
          const parsed = parseSkillFeedback(text, WRITING_CRITERIA_LABELS);
          if (!parsed) console.error("[aiScoring] writing response could not be parsed");
          return parsed;
        })
        .catch((err: unknown) => {
          console.error("[aiScoring] writing call failed:", err);
          return null;
        }),
      hasSpeaking
        ? callGemini(apiKey, speakingPrompt(data))
            .then((text) => {
              const parsed = parseSkillFeedback(text, SPEAKING_CRITERIA_LABELS);
              if (!parsed) console.error("[aiScoring] speaking response could not be parsed");
              return parsed;
            })
            .catch((err: unknown) => {
              console.error("[aiScoring] speaking call failed:", err);
              return null;
            })
        : Promise.resolve(null),
    ]);

    if (!writing && !speaking) throw new Error("AI scoring failed for every skill");
    return {
      writing: writing ?? undefined,
      speaking: speaking ?? undefined,
    };
  });
