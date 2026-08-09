import { t as FFmpeg } from "../_libs/ffmpeg__ffmpeg.mjs";
import { n as toBlobURL, t as fetchFile } from "../_libs/ffmpeg__util.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/videoCompress-0WnA7Ay1.js
/**
* Client-side video compression so admins can upload longer/bigger lesson
* videos while staying under Cloudinary's free-plan 100MB-per-file cap.
* Runs entirely in the browser via ffmpeg.wasm — core files are self-hosted
* under /public/ffmpeg so this doesn't depend on an external CDN.
*/
var ffmpegPromise = null;
var progressHandler = null;
async function getFFmpeg() {
	if (!ffmpegPromise) ffmpegPromise = (async () => {
		const instance = new FFmpeg();
		instance.on("log", () => {});
		instance.on("progress", ({ progress }) => {
			progressHandler?.(Math.min(1, Math.max(0, progress)));
		});
		const baseURL = "/ffmpeg";
		await instance.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm")
		});
		return instance;
	})();
	return ffmpegPromise;
}
function toMp4Name(name) {
	return `${name.replace(/\.[^.]+$/, "") || "video"}.mp4`;
}
/**
* Re-encodes a video to a small, low-quality H.264/AAC mp4 (max width
* 854px, aggressive compression) so it fits well within upload limits.
* `onProgress` receives a 0–1 ratio while ffmpeg is transcoding.
*/
async function compressVideo(file, onProgress) {
	const ffmpeg = await getFFmpeg();
	progressHandler = onProgress ?? null;
	const inputName = `input.${file.name.split(".").pop() || "mp4"}`;
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
			outputName
		]);
		const data = await ffmpeg.readFile(outputName);
		const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
		const blob = new Blob([bytes.buffer], { type: "video/mp4" });
		return new File([blob], toMp4Name(file.name), { type: "video/mp4" });
	} finally {
		progressHandler = null;
		await ffmpeg.deleteFile(inputName).catch(() => {});
		await ffmpeg.deleteFile(outputName).catch(() => {});
	}
}
//#endregion
export { compressVideo };
