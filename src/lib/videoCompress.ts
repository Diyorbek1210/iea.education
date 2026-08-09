import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

/**
 * Client-side video compression so admins can upload longer/bigger lesson
 * videos while staying under Cloudinary's free-plan 100MB-per-file cap.
 * Runs entirely in the browser via ffmpeg.wasm — core files are self-hosted
 * under /public/ffmpeg so this doesn't depend on an external CDN.
 */

let ffmpegPromise: Promise<FFmpeg> | null = null;
let progressHandler: ((ratio: number) => void) | null = null;

async function getFFmpeg(): Promise<FFmpeg> {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const instance = new FFmpeg();
      instance.on("log", () => {});
      instance.on("progress", ({ progress }) => {
        progressHandler?.(Math.min(1, Math.max(0, progress)));
      });
      const baseURL = "/ffmpeg";
      await instance.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      return instance;
    })();
  }
  return ffmpegPromise;
}

function toMp4Name(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  return `${base || "video"}.mp4`;
}

/**
 * Re-encodes a video to a small, low-quality H.264/AAC mp4 (max width
 * 854px, aggressive compression) so it fits well within upload limits.
 * `onProgress` receives a 0–1 ratio while ffmpeg is transcoding.
 */
export async function compressVideo(
  file: File,
  onProgress?: (ratio: number) => void,
): Promise<File> {
  const ffmpeg = await getFFmpeg();
  progressHandler = onProgress ?? null;

  const inputExt = file.name.split(".").pop() || "mp4";
  const inputName = `input.${inputExt}`;
  const outputName = "output.mp4";

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    await ffmpeg.exec([
      "-i",
      inputName,
      "-vf",
      "scale='min(854,iw)':-2",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "32",
      "-c:a",
      "aac",
      "-b:a",
      "96k",
      "-movflags",
      "+faststart",
      outputName,
    ]);
    const data = await ffmpeg.readFile(outputName);
    const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "video/mp4" });
    return new File([blob], toMp4Name(file.name), { type: "video/mp4" });
  } finally {
    progressHandler = null;
    await ffmpeg.deleteFile(inputName).catch(() => {});
    await ffmpeg.deleteFile(outputName).catch(() => {});
  }
}
