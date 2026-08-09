import type { AiCriterion, AiSkillFeedback } from "@/lib/types";

export const WRITING_CRITERIA_LABELS = [
  "Task Response",
  "Coherence and Cohesion",
  "Lexical Resource",
  "Grammatical Range and Accuracy",
] as const;

export const SPEAKING_CRITERIA_LABELS = [
  "Fluency and Coherence",
  "Lexical Resource",
  "Grammatical Range and Accuracy",
] as const;

export interface ScoreInput {
  task1Prompt: string;
  task1Text: string;
  task2Prompt: string;
  task2Text: string;
  speakingQuestions: string[];
  speakingTranscripts: string[];
}

function clampBand(n: unknown): number | null {
  if (typeof n !== "number" || Number.isNaN(n)) return null;
  return Math.min(9, Math.max(0, Math.round(n * 2) / 2));
}

/** Parse the model's JSON answer defensively; null means the caller falls back to the heuristic. */
export function parseSkillFeedback(
  text: string,
  labels: readonly string[],
): AiSkillFeedback | null {
  const cleaned = text.replace(/```(?:json)?/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) return null;

  let raw: unknown;
  try {
    raw = JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;

  const band = clampBand(obj["band"]);
  if (band === null) return null;

  const rawCriteria = Array.isArray(obj["criteria"]) ? obj["criteria"] : [];
  const criteria: AiCriterion[] = [];
  for (const label of labels) {
    const found = rawCriteria.find(
      (c): c is Record<string, unknown> =>
        typeof c === "object" &&
        c !== null &&
        typeof (c as Record<string, unknown>)["label"] === "string" &&
        ((c as Record<string, unknown>)["label"] as string).toLowerCase() === label.toLowerCase(),
    );
    if (!found) return null;
    const criterionBand = clampBand(found["band"]);
    if (criterionBand === null) return null;
    const comment = typeof found["comment"] === "string" ? found["comment"].slice(0, 300) : "";
    criteria.push({ label, band: criterionBand, comment });
  }

  const summary = typeof obj["summary"] === "string" ? obj["summary"].slice(0, 600) : "";
  const tips = (Array.isArray(obj["tips"]) ? obj["tips"] : [])
    .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
    .slice(0, 3)
    .map((t) => t.slice(0, 200));

  return { source: "ai", band, criteria, summary, tips };
}

export function writingPrompt(data: ScoreInput): string {
  return `You are a certified IELTS examiner. Evaluate this IELTS Academic Writing test using the official public band descriptors.

TASK 1 (report, minimum 150 words, worth one third of the writing score):
Prompt: ${data.task1Prompt}
Candidate's answer:
${data.task1Text}

TASK 2 (essay, minimum 250 words, worth two thirds of the writing score):
Prompt: ${data.task2Prompt}
Candidate's answer:
${data.task2Text}

Respond with ONLY a JSON object, no markdown, in exactly this shape:
{
  "band": <number 0 to 9 in steps of 0.5; the single combined writing band, with Task 2 weighted roughly double Task 1>,
  "criteria": [
    {"label": "Task Response", "band": <0 to 9 in steps of 0.5>, "comment": "<one sentence judging both tasks against this criterion>"},
    {"label": "Coherence and Cohesion", "band": <0 to 9 in steps of 0.5>, "comment": "<one sentence>"},
    {"label": "Lexical Resource", "band": <0 to 9 in steps of 0.5>, "comment": "<one sentence>"},
    {"label": "Grammatical Range and Accuracy", "band": <0 to 9 in steps of 0.5>, "comment": "<one sentence>"}
  ],
  "summary": "<one or two sentence honest overview of the writing level>",
  "tips": ["<one specific, actionable improvement>", "<another>", "<optionally a third>"]
}
Be strict and honest like a real examiner: penalize underlength, memorised phrases, and off-topic content. Do not inflate scores.`;
}

export function speakingPrompt(data: ScoreInput): string {
  const pairs = data.speakingQuestions
    .map((q, i) => `Examiner: ${q}\nCandidate: ${data.speakingTranscripts[i] ?? "(no answer)"}`)
    .join("\n\n");
  return `You are a certified IELTS speaking examiner. Evaluate this IELTS Speaking test. You only have the candidate's transcribed words (automatic speech recognition), so judge Fluency and Coherence from the structure and flow of the language, plus Lexical Resource and Grammatical Range and Accuracy. Pronunciation CANNOT be judged from a transcript, so it must not affect the score.

Interview transcript:
${pairs}

Respond with ONLY a JSON object, no markdown, in exactly this shape:
{
  "band": <number 0 to 9 in steps of 0.5>,
  "criteria": [
    {"label": "Fluency and Coherence", "band": <0 to 9 in steps of 0.5>, "comment": "<one sentence>"},
    {"label": "Lexical Resource", "band": <0 to 9 in steps of 0.5>, "comment": "<one sentence>"},
    {"label": "Grammatical Range and Accuracy", "band": <0 to 9 in steps of 0.5>, "comment": "<one sentence>"}
  ],
  "summary": "<one or two sentence honest overview of the speaking level>",
  "tips": ["<one specific, actionable improvement>", "<another>", "<optionally a third>"]
}
Be strict and honest like a real examiner: very short or memorised answers score low. Do not inflate scores.`;
}
