import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

const SYSTEM_PROMPT = `You are Emily, a friendly and encouraging IELTS speaking partner.
Keep responses SHORT (1 to 2 sentences max). This is a speaking conversation, not an essay.
Ask follow-up questions naturally. Be warm, supportive, and occasionally funny.
If the user makes a grammar mistake, gently correct them within your response.
Vary your questions across Part 1 (personal topics like hometown, hobbies, work),
Part 2 (describe a topic for 2 minutes), and Part 3 (opinion and abstract questions).
Start each new conversation with a warm greeting and a simple Part 1 question.
Never use markdown, bullet points, or numbered lists. Just natural spoken English.`;

export const chatWithAi = createServerFn({ method: "POST" })
  .validator(
    z.object({
      messages: z.array(
        z.object({
          role: z.enum(["user", "model"]),
          text: z.string().max(2000),
        }),
      ),
    }),
  )
  .handler(async ({ data }) => {
    if (!process.env["GEMINI_API_KEY"]) {
      try {
        const dotenv = await import("dotenv");
        dotenv.config();
      } catch {
        // No filesystem access in edge runtime
      }
    }

    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const contents = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      {
        role: "model",
        parts: [{ text: "Got it! I'm ready to help with IELTS speaking practice." }],
      },
      ...data.messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 150,
          },
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

      return { text };
    } finally {
      clearTimeout(timeout);
    }
  });
