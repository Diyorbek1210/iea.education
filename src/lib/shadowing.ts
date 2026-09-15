import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  YoutubeTranscript,
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptNotAvailableLanguageError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError,
} from "youtube-transcript";
import type { TranscriptResponse } from "youtube-transcript";

import type { ShadowingSegment } from "@/shared/types/types";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

async function ensureApiKey() {
  if (!process.env["GEMINI_API_KEY"]) {
    try {
      const dotenv = await import("dotenv");
      dotenv.config();
    } catch {
      // No filesystem access in edge runtime — key must come from real env vars.
    }
  }
  return process.env["GEMINI_API_KEY"];
}

/* ------------------------------------------------------------------ *
 * YouTube helpers
 * ------------------------------------------------------------------ */

export function extractYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    /(?:youtube\.com\/live\/)([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

function decodeHtml(input: string): string {
  return input
    .replace(/\\u0026/g, "&")
    .replace(/\\"/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_m, n: string) => {
      const code = Number(n);
      return Number.isFinite(code) ? String.fromCharCode(code) : "";
    });
}

function fetchVideoMeta(videoId: string): Promise<{ title: string; thumbnail: string }> {
  return fetch(
    `https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${videoId}&format=json`,
    { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(10_000) },
  )
    .then((res) => (res.ok ? (res.json() as Promise<{ title?: string }>) : null))
    .then((data) => ({
      title: data?.title ? decodeHtml(data.title).trim() : "YouTube video",
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    }))
    .catch(() => ({
      title: "YouTube video",
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    }));
}

function toShadowingSegments(lines: TranscriptResponse[]): ShadowingSegment[] {
  if (lines.length === 0) return [];

  // srv3 (the format YouTube serves today) reports offset/duration in
  // milliseconds, while the legacy format used whole seconds. Detect which one
  // we got so the timestamps stay accurate for phrase-to-video syncing.
  const maxOffset = Math.max(...lines.map((line) => line.offset));
  const inSeconds = maxOffset > 0 && maxOffset < 3600 && lines.every((line) => line.duration < 120);

  const divide = inSeconds ? 1 : 1000;
  return lines
    .map((line) => {
      const start = line.offset / divide;
      const end = start + line.duration / divide;
      return { start, end, text: line.text.replace(/\s+/g, " ").trim() };
    })
    .filter(
      (segment): segment is ShadowingSegment =>
        segment.text.length > 0 && /[\p{L}]/u.test(segment.text),
    );
}

function friendlyTranscriptError(err: unknown): string {
  if (err instanceof YoutubeTranscriptTooManyRequestError)
    return "YouTube is rate-limiting this server right now. Try again in a few minutes, or add the transcript manually instead.";
  if (err instanceof YoutubeTranscriptNotAvailableLanguageError)
    return "No English subtitles were found for this video. Add the transcript manually instead.";
  if (err instanceof YoutubeTranscriptNotAvailableError)
    return "No subtitles are available for this video. Add the transcript manually instead.";
  if (err instanceof YoutubeTranscriptDisabledError)
    return "Subtitles are turned off for this video. Add the transcript manually instead.";
  if (err instanceof YoutubeTranscriptVideoUnavailableError)
    return "This video is not available right now.";
  if (err instanceof YoutubeTranscriptError || err instanceof Error) return err.message;
  return "Could not fetch the transcript for this video.";
}

/* ------------------------------------------------------------------ *
 * Server functions
 * ------------------------------------------------------------------ */

export interface ExtractedTranscript {
  title: string;
  thumbnail: string;
  videoId: string;
  segments: ShadowingSegment[];
}

export const extractYouTubeTranscript = createServerFn({ method: "POST" })
  .validator(
    z.object({
      url: z.string().max(1000),
    }),
  )
  .handler(async ({ data }): Promise<ExtractedTranscript> => {
    const videoId = extractYouTubeVideoId(data.url);
    if (!videoId) {
      throw new Error("Could not find a valid YouTube video ID in that URL.");
    }

    let lines: TranscriptResponse[] = [];
    try {
      lines = await YoutubeTranscript.fetchTranscript(videoId, { lang: "en" });
    } catch (codeError) {
      if (codeError instanceof YoutubeTranscriptNotAvailableLanguageError) {
        // No English track — fall back to whatever the first available track is
        // (usually the clips' auto-generated captions).
        try {
          lines = await YoutubeTranscript.fetchTranscript(videoId);
        } catch (fallbackError) {
          throw new Error(friendlyTranscriptError(fallbackError));
        }
      } else {
        throw new Error(friendlyTranscriptError(codeError));
      }
    }

    if (lines.length === 0) {
      throw new Error("No timed caption lines could be parsed for this video.");
    }

    const meta = await fetchVideoMeta(videoId);

    return {
      title: meta.title,
      thumbnail: meta.thumbnail,
      videoId,
      segments: mergeShortSegments(toShadowingSegments(lines)),
    };
  });

function mergeShortSegments(segments: ShadowingSegment[], maxFragments = 6): ShadowingSegment[] {
  if (segments.length <= maxFragments) return segments;
  const merged: ShadowingSegment[] = [];
  let buffer: ShadowingSegment[] = [];
  let currentTextLength = 0;

  const flush = () => {
    if (!buffer.length) return;
    const first = buffer[0]!;
    const last = buffer[buffer.length - 1]!;
    merged.push({
      start: first.start,
      end: last.end,
      text: buffer.map((s) => s.text).join(" "),
    });
    buffer = [];
    currentTextLength = 0;
  };

  for (const segment of segments) {
    const wordCount = segment.text.split(/\s+/).length;
    if (
      buffer.length > 0 &&
      (buffer.length >= maxFragments ||
        currentTextLength + wordCount > 12 ||
        segment.start - buffer[buffer.length - 1]!.end > 1.0)
    ) {
      flush();
    }
    buffer.push(segment);
    currentTextLength += wordCount;
  }
  flush();

  return merged.length >= 2 ? merged : segments;
}

/* ------------------------------------------------------------------ *
 * AI shadowing analysis
 * ------------------------------------------------------------------ */

export interface ShadowingAnalysis {
  overallScore: number;
  accuracy: number;
  fluency: number;
  band: number;
  errors: { expected: string; spoken: string; correction: string; note: string }[];
  strengths: string[];
  tips: string[];
}

function clampScore(n: unknown): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}

function parseShadowingAnalysis(text: string): ShadowingAnalysis {
  const cleaned = text.replace(/```(?:json)?/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("AI did not return a valid JSON response.");

  const raw = JSON.parse(cleaned.slice(start, end + 1)) as {
    overallScore?: unknown;
    accuracy?: unknown;
    fluency?: unknown;
    band?: unknown;
    errors?: unknown;
    strengths?: unknown;
    tips?: unknown;
  };

  const errors = Array.isArray(raw.errors)
    ? raw.errors
        .filter(
          (
            e,
          ): e is { expected?: unknown; spoken?: unknown; correction?: unknown; note?: unknown } =>
            typeof e === "object" && e !== null,
        )
        .slice(0, 8)
        .map((e) => ({
          expected: typeof e.expected === "string" ? e.expected.slice(0, 200) : "",
          spoken: typeof e.spoken === "string" ? e.spoken.slice(0, 200) : "",
          correction: typeof e.correction === "string" ? e.correction.slice(0, 200) : "",
          note: typeof e.note === "string" ? e.note.slice(0, 300) : "",
        }))
    : [];

  const strengths = (Array.isArray(raw.strengths) ? raw.strengths : [])
    .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    .slice(0, 3)
    .map((s) => s.slice(0, 200));

  const tips = (Array.isArray(raw.tips) ? raw.tips : [])
    .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
    .slice(0, 3)
    .map((t) => t.slice(0, 250));

  const bandRaw = raw.band;
  const band =
    typeof bandRaw === "number" && Number.isFinite(bandRaw)
      ? Math.min(9, Math.max(0, Math.round(bandRaw * 2) / 2))
      : 0;

  return {
    overallScore: clampScore(raw.overallScore),
    accuracy: clampScore(raw.accuracy),
    fluency: clampScore(raw.fluency),
    band,
    errors,
    strengths,
    tips,
  };
}

export const analyzeShadowing = createServerFn({ method: "POST" })
  .validator(
    z.object({
      reference: z.string().max(9000),
      spoken: z.string().max(9000),
    }),
  )
  .handler(async ({ data }): Promise<ShadowingAnalysis> => {
    const apiKey = await ensureApiKey();
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const reference = data.reference.trim();
    const spoken = data.spoken.trim();

    let prompt: string;
    if (!spoken) {
      prompt = `Return ONLY a JSON object (no markdown) for a shadowing session where the learner did not speak any words:
{
  "overallScore": 0,
  "accuracy": 0,
  "fluency": 0,
  "band": 1,
  "errors": [{"expected": "", "spoken": "", "correction": "", "note": "No words were captured. Press play, listen carefully, then speak following the original."}],
  "strengths": [],
  "tips": ["Start with one short phrase at a time and repeat it several times."]
}`;
    } else {
      prompt = `You are an expert English pronunciation, rhythm and intonation coach for IELTS students.

Below is the ORIGINAL recording transcript (the model) and the LEARNER'S transcript captured while shadowing it. The learner's words come from automatic speech recognition, so judge accuracy + pronunciation issues on which words were missed, replaced or broken up.

ORIGINAL:
${reference}

LEARNER:
${spoken}

Provide shadowing feedback. Respond with ONLY a JSON object, no markdown, in exactly this shape:
{
  "overallScore": <0 to 100),
  "accuracy": <0 to 100>,
  "fluency": <0 to 100>,
  "band": <0 to 9 in steps of 0.5, estimated IELTS Speaking band>,
  "errors": [
    {"expected": "<word or short phrase from the original>", "spoken": "<what the learner said instead (or empty)", "correction": "<true pronunciation/spelling>", "note": "<one short sentence explaining the mistake and how to fix it>"}
  ],
  "strengths": ["<one or two things the learner did well >"],
  "tips": ["<one specific, actionable shadowing tip>", "<another>", "<optionally a third>"]
}
Be honest and strict: ignore tiny stopword misses ("a", "the") unless they repeat a lot; focus on words that actually change meaning or pronunciation. List at most 8 errors. Do not inflate scores.`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, responseMimeType: "application/json" },
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
      if (typeof text !== "string" || !text.trim()) {
        throw new Error("AI returned no analysis text.");
      }
      return parseShadowingAnalysis(text);
    } finally {
      clearTimeout(timeout);
    }
  });
