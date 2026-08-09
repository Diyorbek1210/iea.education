import { r as createServerFn } from "./server-ihsQcs9K.mjs";
import { t as createServerRpc } from "./createServerRpc-DDBl6s_L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tts-BGycEtZg.js
function isSynthesizeInput(data) {
	return typeof data === "object" && data !== null && typeof data.text === "string";
}
var synthesizeSpeech_createServerFn_handler = createServerRpc({
	id: "daef94b3928363e7cc8c18cfd62b2ecf03ea36ddb53468b4a634d0117c53daa3",
	name: "synthesizeSpeech",
	filename: "src/lib/tts.ts"
}, (opts) => synthesizeSpeech.__executeServer(opts));
var synthesizeSpeech = createServerFn({ method: "POST" }).validator((data) => {
	if (!isSynthesizeInput(data)) throw new Error("Invalid input: expected { text: string }");
	return { text: data.text.slice(0, 4500) };
}).handler(synthesizeSpeech_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env["GOOGLE_TTS_API_KEY"];
	if (!apiKey) throw new Error("GOOGLE_TTS_API_KEY is not configured on the server.");
	const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			input: { text: data.text },
			voice: {
				languageCode: "en-US",
				name: "en-US-Neural2-F"
			},
			audioConfig: {
				audioEncoding: "MP3",
				speakingRate: .95
			}
		})
	});
	if (!response.ok) {
		const errBody = await response.text();
		throw new Error(`Google TTS request failed (${response.status}): ${errBody}`);
	}
	return { audioContent: (await response.json()).audioContent };
});
//#endregion
export { synthesizeSpeech_createServerFn_handler };
