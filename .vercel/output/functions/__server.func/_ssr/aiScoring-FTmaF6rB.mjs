import { o as __toESM } from "../_runtime.mjs";
import { r as createServerFn } from "./server-ihsQcs9K.mjs";
import { t as createServerRpc } from "./createServerRpc-DDBl6s_L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/aiScoring-FTmaF6rB.js
var WRITING_CRITERIA_LABELS = [
	"Task Response",
	"Coherence and Cohesion",
	"Lexical Resource",
	"Grammatical Range and Accuracy"
];
var SPEAKING_CRITERIA_LABELS = [
	"Fluency and Coherence",
	"Lexical Resource",
	"Grammatical Range and Accuracy"
];
function clampBand(n) {
	if (typeof n !== "number" || Number.isNaN(n)) return null;
	return Math.min(9, Math.max(0, Math.round(n * 2) / 2));
}
/** Parse the model's JSON answer defensively; null means the caller falls back to the heuristic. */
function parseSkillFeedback(text, labels) {
	const cleaned = text.replace(/```(?:json)?/g, "").trim();
	const start = cleaned.indexOf("{");
	const end = cleaned.lastIndexOf("}");
	if (start < 0 || end <= start) return null;
	let raw;
	try {
		raw = JSON.parse(cleaned.slice(start, end + 1));
	} catch {
		return null;
	}
	if (typeof raw !== "object" || raw === null) return null;
	const obj = raw;
	const band = clampBand(obj["band"]);
	if (band === null) return null;
	const rawCriteria = Array.isArray(obj["criteria"]) ? obj["criteria"] : [];
	const criteria = [];
	for (const label of labels) {
		const found = rawCriteria.find((c) => typeof c === "object" && c !== null && typeof c["label"] === "string" && c["label"].toLowerCase() === label.toLowerCase());
		if (!found) return null;
		const criterionBand = clampBand(found["band"]);
		if (criterionBand === null) return null;
		const comment = typeof found["comment"] === "string" ? found["comment"].slice(0, 300) : "";
		criteria.push({
			label,
			band: criterionBand,
			comment
		});
	}
	return {
		source: "ai",
		band,
		criteria,
		summary: typeof obj["summary"] === "string" ? obj["summary"].slice(0, 600) : "",
		tips: (Array.isArray(obj["tips"]) ? obj["tips"] : []).filter((t) => typeof t === "string" && t.trim().length > 0).slice(0, 3).map((t) => t.slice(0, 200))
	};
}
function writingPrompt(data) {
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
function speakingPrompt(data) {
	return `You are a certified IELTS speaking examiner. Evaluate this IELTS Speaking test. You only have the candidate's transcribed words (automatic speech recognition), so judge Fluency and Coherence from the structure and flow of the language, plus Lexical Resource and Grammatical Range and Accuracy. Pronunciation CANNOT be judged from a transcript, so it must not affect the score.

Interview transcript:
${data.speakingQuestions.map((q, i) => `Examiner: ${q}\nCandidate: ${data.speakingTranscripts[i] ?? "(no answer)"}`).join("\n\n")}

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
function isScoreInput(data) {
	if (typeof data !== "object" || data === null) return false;
	const d = data;
	return typeof d["task1Prompt"] === "string" && typeof d["task1Text"] === "string" && typeof d["task2Prompt"] === "string" && typeof d["task2Text"] === "string" && Array.isArray(d["speakingQuestions"]) && Array.isArray(d["speakingTranscripts"]);
}
var GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";
async function callGemini(apiKey, prompt) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 3e4);
	try {
		const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }],
				generationConfig: {
					temperature: .2,
					responseMimeType: "application/json"
				}
			}),
			signal: controller.signal
		});
		if (!response.ok) {
			const errBody = await response.text();
			throw new Error(`Gemini request failed (${response.status}): ${errBody.slice(0, 300)}`);
		}
		const text = (await response.json()).candidates?.[0]?.content?.parts?.[0]?.text;
		if (typeof text !== "string") throw new Error("Gemini response had no text part");
		return text;
	} finally {
		clearTimeout(timeout);
	}
}
var scoreMockPerformance_createServerFn_handler = createServerRpc({
	id: "b1777137039635edbe1f08a504100a14509249abc045553bd8c36e8b5c9f5119",
	name: "scoreMockPerformance",
	filename: "src/lib/aiScoring.ts"
}, (opts) => scoreMockPerformance.__executeServer(opts));
var scoreMockPerformance = createServerFn({ method: "POST" }).validator((data) => {
	if (!isScoreInput(data)) throw new Error("Invalid input for AI scoring");
	return {
		task1Prompt: data.task1Prompt.slice(0, 2e3),
		task1Text: data.task1Text.slice(0, 6e3),
		task2Prompt: data.task2Prompt.slice(0, 2e3),
		task2Text: data.task2Text.slice(0, 6e3),
		speakingQuestions: data.speakingQuestions.slice(0, 10).map((s) => String(s).slice(0, 500)),
		speakingTranscripts: data.speakingTranscripts.slice(0, 10).map((s) => String(s).slice(0, 4500))
	};
}).handler(scoreMockPerformance_createServerFn_handler, async ({ data }) => {
	if (!process.env["GEMINI_API_KEY"]) try {
		(await import("../_libs/dotenv.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).config();
	} catch {}
	const apiKey = process.env["GEMINI_API_KEY"];
	if (!apiKey) {
		console.error("[aiScoring] GEMINI_API_KEY is not visible to the server process");
		throw new Error("GEMINI_API_KEY is not configured on the server.");
	}
	const hasSpeaking = data.speakingTranscripts.some((t) => t.trim().length > 0);
	const [writing, speaking] = await Promise.all([callGemini(apiKey, writingPrompt(data)).then((text) => {
		const parsed = parseSkillFeedback(text, WRITING_CRITERIA_LABELS);
		if (!parsed) console.error("[aiScoring] writing response could not be parsed");
		return parsed;
	}).catch((err) => {
		console.error("[aiScoring] writing call failed:", err);
		return null;
	}), hasSpeaking ? callGemini(apiKey, speakingPrompt(data)).then((text) => {
		const parsed = parseSkillFeedback(text, SPEAKING_CRITERIA_LABELS);
		if (!parsed) console.error("[aiScoring] speaking response could not be parsed");
		return parsed;
	}).catch((err) => {
		console.error("[aiScoring] speaking call failed:", err);
		return null;
	}) : Promise.resolve(null)]);
	if (!writing && !speaking) throw new Error("AI scoring failed for every skill");
	return {
		writing: writing ?? void 0,
		speaking: speaking ?? void 0
	};
});
//#endregion
export { scoreMockPerformance_createServerFn_handler };
