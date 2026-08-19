import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
        generationConfig: { temperature: 0.7, responseMimeType: "application/json" },
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

function getApiKey(): string {
  if (!process.env["GEMINI_API_KEY"]) {
    try {
      const dotenv = require("dotenv");
      dotenv.config();
    } catch {}
  }
  const key = process.env["GEMINI_API_KEY"];
  if (!key) throw new Error("GEMINI_API_KEY is not configured on the server.");
  return key;
}

/* ──────────────────────────────────────────────
   Generate Listening Questions
   ────────────────────────────────────────────── */
export interface GeneratedListeningQuestion {
  id: string;
  text: string;
  options?: string[];
  answer: string;
  explanation: string;
}

const LISTENING_PROMPT = (type: string, difficulty: string) => `You are an IELTS exam content creator. Generate 3 IELTS Listening ${type} questions at ${difficulty} difficulty.

Return ONLY a JSON object in this exact shape:
{
  "questions": [
    {
      "id": "1",
      "text": "The question text with ___ for fill-in-the-blank, or the question prompt",
      "options": ["A) option1", "B) option2", "C) option3"],
      "answer": "the correct answer (number index as string for MC, text for fill-in)",
      "explanation": "one sentence explaining why this is correct"
    }
  ]
}

For Note Completion: use fill-in-the-blank (no options).
For Multiple Choice: provide 3 options (A, B, C).
Make the questions realistic and IELTS-appropriate. The answers should be clear and unambiguous.`;

export const generateListeningQuestions = createServerFn({ method: "POST" })
  .validator(
    z.object({
      type: z.string(),
      difficulty: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const apiKey = getApiKey();
    const prompt = LISTENING_PROMPT(data.type, data.difficulty);
    const text = await callGemini(apiKey, prompt);

    const cleaned = text.replace(/```(?:json)?/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start < 0 || end <= start) throw new Error("Invalid AI response format");

    const parsed = JSON.parse(cleaned.slice(start, end + 1)) as {
      questions?: Array<{
        id: string;
        text: string;
        options?: string[];
        answer: string;
        explanation: string;
      }>;
    };

    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error("No questions generated");
    }

    return { questions: parsed.questions.slice(0, 5) };
  });

/* ──────────────────────────────────────────────
   Generate Speaking Questions
   ────────────────────────────────────────────── */
export interface GeneratedSpeakingQuestion {
  id: string;
  text: string;
  tips: string;
}

const SPEAKING_PROMPT = (part: string) => `You are an IELTS speaking examiner. Generate 3 IELTS Speaking ${part} questions.

Return ONLY a JSON object in this exact shape:
{
  "questions": [
    {
      "id": "1",
      "text": "The question or cue card prompt",
      "tips": "brief tips on how to answer well (2-3 sentences)"
    }
  ]
}

For Part 1: personal questions about familiar topics.
For Part 2: cue card with bullet points and "You should say:" format.
For Part 3: abstract/opinion questions that follow from Part 2.
Make questions realistic and IELTS-appropriate.`;

export const generateSpeakingQuestions = createServerFn({ method: "POST" })
  .validator(
    z.object({
      part: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const apiKey = getApiKey();
    const prompt = SPEAKING_PROMPT(data.part);
    const text = await callGemini(apiKey, prompt);

    const cleaned = text.replace(/```(?:json)?/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start < 0 || end <= start) throw new Error("Invalid AI response format");

    const parsed = JSON.parse(cleaned.slice(start, end + 1)) as {
      questions?: Array<{ id: string; text: string; tips: string }>;
    };

    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error("No questions generated");
    }

    return { questions: parsed.questions.slice(0, 5) };
  });

/* ──────────────────────────────────────────────
   Score Writing Essay
   ────────────────────────────────────────────── */
const WRITING_SCORE_PROMPT = (prompt: string, essay: string) => `You are a certified IELTS examiner. Evaluate this IELTS Writing Task 2 essay.

Essay Prompt: ${prompt}
Candidate's Essay:
${essay}

Respond with ONLY a JSON object, no markdown, in exactly this shape:
{
  "band": <number 0 to 9 in steps of 0.5>,
  "criteria": [
    {"label": "Task Response", "band": <0 to 9 in steps of 0.5>, "comment": "<one sentence>"},
    {"label": "Coherence and Cohesion", "band": <0 to 9 in steps of 0.5>, "comment": "<one sentence>"},
    {"label": "Lexical Resource", "band": <0 to 9 in steps of 0.5>, "comment": "<one sentence>"},
    {"label": "Grammatical Range and Accuracy", "band": <0 to 9 in steps of 0.5>, "comment": "<one sentence>"}
  ],
  "summary": "<one or two sentence honest overview>",
  "tips": ["<one specific improvement>", "<another>", "<optionally a third>"]
}
Be strict and honest like a real examiner. Do not inflate scores.`;

export interface WritingScoreResult {
  band: number;
  criteria: Array<{ label: string; band: number; comment: string }>;
  summary: string;
  tips: string[];
}

export const scoreWritingEssay = createServerFn({ method: "POST" })
  .validator(
    z.object({
      prompt: z.string().max(2000),
      essay: z.string().max(6000),
    }),
  )
  .handler(async ({ data }) => {
    const apiKey = getApiKey();
    const prompt = WRITING_SCORE_PROMPT(data.prompt, data.essay);
    const text = await callGemini(apiKey, prompt);

    const cleaned = text.replace(/```(?:json)?/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start < 0 || end <= start) throw new Error("Invalid AI response format");

    const parsed = JSON.parse(cleaned.slice(start, end + 1)) as {
      band?: number;
      criteria?: Array<{ label: string; band: number; comment: string }>;
      summary?: string;
      tips?: string[];
    };

    return {
      band: Math.min(9, Math.max(0, Math.round((parsed.band ?? 5) * 2) / 2)),
      criteria: (parsed.criteria ?? []).slice(0, 4),
      summary: (parsed.summary ?? "").slice(0, 600),
      tips: (parsed.tips ?? []).slice(0, 3).map((t) => t.slice(0, 200)),
    } satisfies WritingScoreResult;
  });

/* ──────────────────────────────────────────────
   Score Speaking Answer
   ────────────────────────────────────────────── */
const SPEAKING_SCORE_PROMPT = (question: string, transcript: string) => `You are a certified IELTS speaking examiner. Evaluate this speaking answer.

Examiner: ${question}
Candidate: ${transcript}

Respond with ONLY a JSON object, no markdown, in exactly this shape:
{
  "band": <number 0 to 9 in steps of 0.5>,
  "criteria": [
    {"label": "Fluency and Coherence", "band": <0 to 9 in steps of 0.5>, "comment": "<one sentence>"},
    {"label": "Lexical Resource", "band": <0 to 9 in steps of 0.5>, "comment": "<one sentence>"},
    {"label": "Grammatical Range and Accuracy", "band": <0 to 9 in steps of 0.5>, "comment": "<one sentence>"}
  ],
  "summary": "<one or two sentence honest overview>",
  "tips": ["<one specific improvement>", "<another>", "<optionally a third>"]
}
Pronunciation CANNOT be judged from text, so ignore it. Be strict and honest. Do not inflate scores.`;

export interface SpeakingScoreResult {
  band: number;
  criteria: Array<{ label: string; band: number; comment: string }>;
  summary: string;
  tips: string[];
}

export const scoreSpeakingAnswer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      question: z.string().max(1000),
      transcript: z.string().max(4500),
    }),
  )
  .handler(async ({ data }) => {
    const apiKey = getApiKey();
    const prompt = SPEAKING_SCORE_PROMPT(data.question, data.transcript);
    const text = await callGemini(apiKey, prompt);

    const cleaned = text.replace(/```(?:json)?/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start < 0 || end <= start) throw new Error("Invalid AI response format");

    const parsed = JSON.parse(cleaned.slice(start, end + 1)) as {
      band?: number;
      criteria?: Array<{ label: string; band: number; comment: string }>;
      summary?: string;
      tips?: string[];
    };

    return {
      band: Math.min(9, Math.max(0, Math.round((parsed.band ?? 5) * 2) / 2)),
      criteria: (parsed.criteria ?? []).slice(0, 3),
      summary: (parsed.summary ?? "").slice(0, 600),
      tips: (parsed.tips ?? []).slice(0, 3).map((t) => t.slice(0, 200)),
    } satisfies SpeakingScoreResult;
  });
