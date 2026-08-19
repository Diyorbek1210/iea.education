import { createServerFn } from "@tanstack/react-start";

interface SynthesizeInput {
  text: string;
}

function isSynthesizeInput(data: unknown): data is SynthesizeInput {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as { text?: unknown }).text === "string"
  );
}

export const synthesizeSpeech = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!isSynthesizeInput(data)) throw new Error("Invalid input: expected { text: string }");
    return { text: data.text.slice(0, 4500) };
  })
  .handler(async ({ data }) => {
    if (import.meta.env.DEV && !process.env["GOOGLE_TTS_API_KEY"]) {
      const dotenv = await import("dotenv");
      dotenv.config();
    }

    const apiKey = process.env["GOOGLE_TTS_API_KEY"];
    if (!apiKey) throw new Error("GOOGLE_TTS_API_KEY is not configured on the server.");

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text: data.text },
          voice: { languageCode: "en-US", name: "en-US-Neural2-F" },
          audioConfig: { audioEncoding: "MP3", speakingRate: 0.95 },
        }),
      },
    );

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Google TTS request failed (${response.status}): ${errBody}`);
    }

    const json = (await response.json()) as { audioContent: string };
    return { audioContent: json.audioContent };
  });
