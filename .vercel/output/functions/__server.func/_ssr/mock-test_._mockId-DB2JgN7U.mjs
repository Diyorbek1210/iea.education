import { o as __toESM } from "../_runtime.mjs";
import { a as Trigger2, b as require_react, i as Root2, n as Header, r as Item, t as Content2, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./server-ihsQcs9K.mjs";
import { A as recordActivity, D as markMockTestCompleted, a as addMockResult, u as createSsrRpc } from "./db-n4ZYRMBI.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useAuth, n as Route } from "./router-CpIOtHbc.mjs";
import { A as LoaderCircle, C as Mic, G as BookOpen, M as Headphones, S as PenLine, U as ChevronDown, m as Square, r as Volume2 } from "../_libs/lucide-react.mjs";
import { i as cn, t as Button } from "./button-CYXajmEg.mjs";
import { t as Input } from "./input-BZL4ZIgS.mjs";
import { t as Textarea } from "./textarea-Bagx0Mq7.mjs";
import { t as DashboardShell } from "./DashboardShell-BjTGUMyS.mjs";
import { i as readingBand, n as listeningBand, r as mockTests, t as estimateWritten } from "./mockTest-DcSU1hPy.mjs";
import { t as Progress } from "./progress-DNQG9uUV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mock-test_._mockId-DB2JgN7U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function isSynthesizeInput(data) {
	return typeof data === "object" && data !== null && typeof data.text === "string";
}
var synthesizeSpeech = createServerFn({ method: "POST" }).validator((data) => {
	if (!isSynthesizeInput(data)) throw new Error("Invalid input: expected { text: string }");
	return { text: data.text.slice(0, 4500) };
}).handler(createSsrRpc("daef94b3928363e7cc8c18cfd62b2ecf03ea36ddb53468b4a634d0117c53daa3"));
function pickEnglishVoice() {
	const voices = window.speechSynthesis.getVoices();
	return voices.find((v) => /^en/i.test(v.lang) && /google|natural|online/i.test(v.name)) ?? voices.find((v) => /^en-US/i.test(v.lang)) ?? voices.find((v) => /^en/i.test(v.lang));
}
function useSpeechSynthesis() {
	const [isSpeaking, setIsSpeaking] = (0, import_react.useState)(false);
	const browserSupported = typeof window !== "undefined" && "speechSynthesis" in window;
	const audioRef = (0, import_react.useRef)(null);
	const utteranceRef = (0, import_react.useRef)(null);
	const resumeTimerRef = (0, import_react.useRef)(null);
	const requestIdRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (!browserSupported) return;
		window.speechSynthesis.getVoices();
		const onVoicesChanged = () => window.speechSynthesis.getVoices();
		window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
		return () => window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
	}, [browserSupported]);
	const clearResumeTimer = (0, import_react.useCallback)(() => {
		if (resumeTimerRef.current) {
			clearInterval(resumeTimerRef.current);
			resumeTimerRef.current = null;
		}
	}, []);
	const speakWithBrowser = (0, import_react.useCallback)((text) => {
		if (!browserSupported) return;
		window.speechSynthesis.cancel();
		clearResumeTimer();
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = "en-US";
		utterance.rate = .95;
		utterance.pitch = 1;
		utterance.volume = 1;
		const voice = pickEnglishVoice();
		if (voice) utterance.voice = voice;
		utterance.onstart = () => {
			setIsSpeaking(true);
			resumeTimerRef.current = setInterval(() => {
				if (window.speechSynthesis.speaking) window.speechSynthesis.resume();
			}, 4e3);
		};
		const end = () => {
			setIsSpeaking(false);
			clearResumeTimer();
		};
		utterance.onend = end;
		utterance.onerror = end;
		utteranceRef.current = utterance;
		setTimeout(() => window.speechSynthesis.speak(utterance), 50);
	}, [browserSupported, clearResumeTimer]);
	const speak = (0, import_react.useCallback)(async (text) => {
		const requestId = ++requestIdRef.current;
		audioRef.current?.pause();
		if (browserSupported) window.speechSynthesis.cancel();
		clearResumeTimer();
		try {
			const { audioContent } = await synthesizeSpeech({ data: { text } });
			if (requestId !== requestIdRef.current) return;
			const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
			audioRef.current = audio;
			audio.onplay = () => setIsSpeaking(true);
			audio.onended = () => setIsSpeaking(false);
			audio.onerror = () => setIsSpeaking(false);
			await audio.play();
		} catch {
			if (requestId !== requestIdRef.current) return;
			speakWithBrowser(text);
		}
	}, [
		browserSupported,
		clearResumeTimer,
		speakWithBrowser
	]);
	const stop = (0, import_react.useCallback)(() => {
		requestIdRef.current++;
		audioRef.current?.pause();
		if (browserSupported) window.speechSynthesis.cancel();
		clearResumeTimer();
		setIsSpeaking(false);
	}, [browserSupported, clearResumeTimer]);
	(0, import_react.useEffect)(() => stop, [stop]);
	return {
		speak,
		stop,
		isSpeaking,
		supported: true
	};
}
function getSpeechRecognitionCtor() {
	if (typeof window === "undefined") return null;
	const w = window;
	return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
function SpeakingRecorder({ question, onDone }) {
	const { speak, isSpeaking, supported: ttsSupported } = useSpeechSynthesis();
	const recognitionSupported = getSpeechRecognitionCtor() !== null;
	const [phase, setPhase] = (0, import_react.useState)(question.prepSeconds > 0 ? "prep" : "answering");
	const [prepLeft, setPrepLeft] = (0, import_react.useState)(question.prepSeconds);
	const [answerLeft, setAnswerLeft] = (0, import_react.useState)(question.answerSeconds);
	const [recording, setRecording] = (0, import_react.useState)(false);
	const [transcript, setTranscript] = (0, import_react.useState)("");
	const [typedAnswer, setTypedAnswer] = (0, import_react.useState)("");
	const recognitionRef = (0, import_react.useRef)(null);
	const finishedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (ttsSupported) speak(question.prompt);
		finishedRef.current = false;
		setPhase(question.prepSeconds > 0 ? "prep" : "answering");
		setPrepLeft(question.prepSeconds);
		setAnswerLeft(question.answerSeconds);
		setTranscript("");
		setTypedAnswer("");
	}, [question]);
	(0, import_react.useEffect)(() => {
		if (phase !== "prep") return;
		if (prepLeft <= 0) {
			setPhase("answering");
			if (recognitionSupported) startRecording();
			return;
		}
		const id = setTimeout(() => setPrepLeft((t) => t - 1), 1e3);
		return () => clearTimeout(id);
	}, [phase, prepLeft]);
	function finish(finalText) {
		if (finishedRef.current) return;
		finishedRef.current = true;
		stopRecognition();
		setPhase("done");
		onDone(finalText.trim());
	}
	(0, import_react.useEffect)(() => {
		if (phase !== "answering" || !recording) return;
		if (answerLeft <= 0) {
			finish(recognitionSupported ? transcript : typedAnswer);
			return;
		}
		const id = setTimeout(() => setAnswerLeft((t) => t - 1), 1e3);
		return () => clearTimeout(id);
	}, [
		phase,
		recording,
		answerLeft
	]);
	function stopRecognition() {
		recognitionRef.current?.stop();
		recognitionRef.current = null;
		setRecording(false);
	}
	function startRecording() {
		if (recognitionSupported) {
			const Ctor = getSpeechRecognitionCtor();
			if (!Ctor) return;
			const recognition = new Ctor();
			recognition.lang = "en-US";
			recognition.continuous = true;
			recognition.interimResults = true;
			let finalText = "";
			recognition.onresult = (event) => {
				let interim = "";
				for (let i = event.resultIndex; i < event.results.length; i++) {
					const result = event.results[i];
					if (result.isFinal) finalText += result[0].transcript + " ";
					else interim += result[0].transcript;
				}
				setTranscript((finalText + interim).trim());
			};
			recognition.onerror = () => stopRecognition();
			recognition.onend = () => setRecording(false);
			recognitionRef.current = recognition;
			recognition.start();
		}
		setRecording(true);
	}
	function stopAndNext() {
		finish(recognitionSupported ? transcript : typedAnswer);
	}
	if (phase === "prep") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl bg-card p-6 text-center shadow-card sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-semibold uppercase tracking-wide text-primary",
				children: [
					"Part ",
					question.part,
					" · Prepare"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-3 max-w-lg text-sm text-foreground",
				children: question.prompt
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-4xl font-extrabold text-foreground",
				children: [prepLeft, "s"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: "Use this time to think. Recording starts automatically when the timer ends."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl bg-card p-6 shadow-card sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-semibold uppercase tracking-wide text-primary",
					children: ["Part ", question.part]
				}), ttsSupported && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "soft",
					size: "sm",
					onClick: () => speak(question.prompt),
					disabled: isSpeaking,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3.5 w-3.5" }),
						" ",
						isSpeaking ? "Speaking…" : "Replay question"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-base font-bold text-foreground",
				children: question.prompt
			}),
			recognitionSupported ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 text-center",
				children: !recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "hero",
					size: "pill-lg",
					onClick: startRecording,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4 w-4" }), " Start speaking"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-3xl font-extrabold text-foreground",
						children: [answerLeft, "s"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 flex items-center justify-center gap-2 text-xs font-semibold text-destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 animate-pulse rounded-full bg-destructive" }), " Recording…"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 min-h-16 rounded-2xl bg-secondary p-4 text-left text-sm text-secondary-foreground",
						children: transcript || "Listening…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "soft",
						size: "pill",
						className: "mt-4",
						onClick: stopAndNext,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4" }), " Stop & continue"]
					})
				] })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Voice recording isn't supported in this browser — type your answer instead."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: typedAnswer,
						onChange: (e) => setTypedAnswer(e.target.value),
						rows: 5,
						placeholder: "Type what you would say…",
						className: "mt-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "hero",
						size: "pill",
						className: "mt-4",
						onClick: stopAndNext,
						children: "Continue"
					})
				]
			})
		]
	});
}
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = Content2.displayName;
function isScoreInput(data) {
	if (typeof data !== "object" || data === null) return false;
	const d = data;
	return typeof d["task1Prompt"] === "string" && typeof d["task1Text"] === "string" && typeof d["task2Prompt"] === "string" && typeof d["task2Text"] === "string" && Array.isArray(d["speakingQuestions"]) && Array.isArray(d["speakingTranscripts"]);
}
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
}).handler(createSsrRpc("b1777137039635edbe1f08a504100a14509249abc045553bd8c36e8b5c9f5119"));
function McSection({ questions, answers, onAnswer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: questions.map((question, qi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl bg-secondary/60 p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm font-bold text-foreground",
				children: [
					qi + 1,
					". ",
					question.q
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-2 sm:grid-cols-2",
				children: question.options.map((option, oi) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onAnswer(qi, oi),
					className: cn("rounded-xl border-2 px-4 py-2.5 text-left text-sm transition-all", answers[qi] === oi ? "border-primary bg-card font-semibold text-primary" : "border-transparent bg-card text-foreground hover:border-primary/40"),
					children: option
				}, option))
			})]
		}, question.q))
	});
}
function FillSection({ questions, answers, onAnswer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: questions.map((question, qi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl bg-secondary/60 p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm font-bold text-foreground",
				children: [
					qi + 1,
					". ",
					question.q
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: answers[qi] ?? "",
				onChange: (e) => onAnswer(qi, e.target.value),
				placeholder: "Type your answer…",
				className: "mt-3 max-w-xs bg-card"
			})]
		}, question.q))
	});
}
/** Loose comparison for typed answers: ignores case, punctuation, currency signs and extra spaces. */
function normalizeAnswer(text) {
	return text.toLowerCase().replace(/[£$€]/g, "").replace(/[.,!?;:'"()]/g, "").replace(/[-–]/g, " ").replace(/\s+/g, " ").trim();
}
function countWords(text) {
	return text.trim().split(/\s+/).filter(Boolean).length;
}
/** Official IELTS band descriptor, so the number reads as a level, not just a score. */
function bandMeaning(band) {
	if (band >= 9) return "Expert user";
	if (band >= 8) return "Very good user";
	if (band >= 7) return "Good user";
	if (band >= 6) return "Competent user";
	if (band >= 5) return "Modest user";
	if (band >= 4) return "Limited user";
	if (band >= 3) return "Extremely limited user";
	if (band >= 2) return "Intermittent user";
	return "Non-user";
}
/** Cambridge IELTS to CEFR alignment (approximate). */
function bandCefr(band) {
	if (band >= 8.5) return "C2";
	if (band >= 7) return "C1";
	if (band >= 5.5) return "B2";
	if (band >= 4) return "B1";
	return "A2 or below";
}
/** The detailed examiner breakdown for one skill (inside the collapsible block). */
function SkillFeedbackDetail({ feedback, pronunciationNote }) {
	if (feedback.source === "heuristic") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-muted-foreground",
		children: "Detailed AI feedback is unavailable, so this band is a rough estimate from length and vocabulary only."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: feedback.criteria.map((criterion) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold text-foreground",
						children: criterion.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-extrabold text-foreground",
						children: criterion.band.toFixed(1)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: criterion.band / 9 * 100,
					className: "mt-1.5 h-1.5"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-xs text-muted-foreground",
					children: criterion.comment
				})
			] }, criterion.label))
		}),
		feedback.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-foreground",
			children: feedback.summary
		}),
		feedback.tips.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground",
			children: feedback.tips.map((tip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tip }, tip))
		}),
		pronunciationNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 rounded-xl bg-secondary p-3 text-xs text-muted-foreground",
			children: "Note: pronunciation is not included in this score, because only the transcript of your speech was evaluated, not the audio itself."
		})
	] });
}
function MockTestRunPage() {
	const { mockId } = Route.useParams();
	const { user, refresh } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { speak, stop: stopSpeech, isSpeaking, supported: ttsSupported } = useSpeechSynthesis();
	const mockSet = mockTests.find((m) => m.id === mockId);
	const mockIndex = mockSet ? mockTests.findIndex((m) => m.id === mockId) : -1;
	const previousMock = mockIndex > 0 ? mockTests[mockIndex - 1] : null;
	const nextMock = mockIndex >= 0 ? mockTests[mockIndex + 1] : void 0;
	const [stage, setStage] = (0, import_react.useState)("intro");
	const [readingPassageIndex, setReadingPassageIndex] = (0, import_react.useState)(0);
	const [readingRevealed, setReadingRevealed] = (0, import_react.useState)(false);
	const [readingAnswers, setReadingAnswers] = (0, import_react.useState)(() => mockSet?.reading.passages.map(() => []) ?? []);
	const [listeningSectionIndex, setListeningSectionIndex] = (0, import_react.useState)(0);
	const [listeningAnswers, setListeningAnswers] = (0, import_react.useState)(() => mockSet?.listening.sections.map(() => []) ?? []);
	const [writingTask, setWritingTask] = (0, import_react.useState)(1);
	const [writing1, setWriting1] = (0, import_react.useState)("");
	const [writing2, setWriting2] = (0, import_react.useState)("");
	const [speakingIndex, setSpeakingIndex] = (0, import_react.useState)(0);
	const [speakingTranscripts, setSpeakingTranscripts] = (0, import_react.useState)([]);
	const [scores, setScores] = (0, import_react.useState)({
		listening: 0,
		reading: 0,
		writing: 0,
		speaking: 0,
		overall: 0
	});
	const [evaluating, setEvaluating] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [rawCounts, setRawCounts] = (0, import_react.useState)({
		listeningCorrect: 0,
		readingCorrect: 0
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const justFinishedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => () => stopSpeech(), [stopSpeech]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		if (!mockSet) {
			navigate({ to: "/mock-test" });
			return;
		}
		if (justFinishedRef.current) return;
		if (user.completedMockTests?.includes(mockSet.id)) {
			toast.error("You've already completed this mock test.");
			navigate({ to: "/mock-test" });
			return;
		}
		if (previousMock && !user.completedMockTests?.includes(previousMock.id)) {
			toast.error("Complete the previous mock tests first.");
			navigate({ to: "/mock-test" });
		}
	}, [
		user,
		mockSet,
		previousMock
	]);
	if (!mockSet) return null;
	const readingPassage = mockSet.reading.passages[readingPassageIndex];
	const listeningSection = mockSet.listening.sections[listeningSectionIndex];
	async function finish() {
		if (!mockSet) return;
		justFinishedRef.current = true;
		const listeningCorrect = mockSet.listening.sections.reduce((sum, section, si) => sum + section.questions.filter((q, qi) => {
			const given = listeningAnswers[si]?.[qi]?.trim();
			return given ? q.accepted.some((a) => normalizeAnswer(a) === normalizeAnswer(given)) : false;
		}).length, 0);
		const readingCorrect = mockSet.reading.passages.reduce((sum, passage, pi) => sum + passage.questions.filter((q, qi) => readingAnswers[pi]?.[qi] === q.answer).length, 0);
		const l = listeningBand(listeningCorrect);
		const r = readingBand(readingCorrect);
		setStage("result");
		setEvaluating(true);
		const joinedTranscripts = speakingTranscripts.join(" ");
		const includeSpeaking = countWords(joinedTranscripts) >= 10;
		let aiWriting = null;
		let aiSpeaking = null;
		try {
			const res = await scoreMockPerformance({ data: {
				task1Prompt: mockSet.writing.task1,
				task1Text: writing1,
				task2Prompt: mockSet.writing.task2,
				task2Text: writing2,
				speakingQuestions: mockSet.speaking.map((q) => q.prompt),
				speakingTranscripts: includeSpeaking ? speakingTranscripts : []
			} });
			aiWriting = res.writing ?? null;
			aiSpeaking = includeSpeaking ? res.speaking ?? null : null;
		} catch {}
		const wHeuristic = Math.round((estimateWritten(writing1, 150) / 3 + estimateWritten(writing2, 250) * 2 / 3) * 2) / 2;
		const sHeuristic = estimateWritten(joinedTranscripts, 150);
		const w = aiWriting?.band ?? wHeuristic;
		const s = aiSpeaking?.band ?? sHeuristic;
		const next = {
			listening: l,
			reading: r,
			writing: w,
			speaking: s,
			overall: Math.round((l + r + w + s) / 4 * 2) / 2
		};
		const fb = {
			writing: aiWriting ?? {
				source: "heuristic",
				band: wHeuristic,
				criteria: [],
				summary: "",
				tips: []
			},
			speaking: aiSpeaking ?? {
				source: "heuristic",
				band: sHeuristic,
				criteria: [],
				summary: "",
				tips: []
			}
		};
		setFeedback(fb);
		setRawCounts({
			listeningCorrect,
			readingCorrect
		});
		setScores(next);
		setEvaluating(false);
		if (!user) return;
		setSaving(true);
		try {
			await addMockResult({
				userId: user.uid,
				userName: user.name,
				date: (/* @__PURE__ */ new Date()).toISOString(),
				mockTestId: mockSet.id,
				...next,
				writingTexts: {
					task1: writing1,
					task2: writing2
				},
				speakingTranscripts,
				feedback: fb
			});
			await markMockTestCompleted(user.uid, mockSet.id);
			const optimistic = {
				...user,
				mockResults: [...user.mockResults ?? [], "pending"]
			};
			const { xpGained, newBadges } = await recordActivity(optimistic, "mockTest");
			await refresh();
			queryClient.invalidateQueries({ queryKey: ["mock-results"] });
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success(`Result saved · +${xpGained} XP`);
			newBadges.forEach((b) => toast(`🏅 New badge: ${b.name}`));
		} catch {
			toast.error("Could not save your result");
		} finally {
			setSaving(false);
		}
	}
	function handleSpeakingDone(transcript) {
		const updated = [...speakingTranscripts, transcript];
		setSpeakingTranscripts(updated);
		if (speakingIndex + 1 >= mockSet.speaking.length) finish();
		else setSpeakingIndex((i) => i + 1);
	}
	function setReadingAnswer(passageIndex, questionIndex, option) {
		const next = readingAnswers.map((a) => [...a]);
		next[passageIndex] = next[passageIndex] ?? [];
		next[passageIndex][questionIndex] = option;
		setReadingAnswers(next);
	}
	function setListeningAnswer(sectionIndex, questionIndex, value) {
		const next = listeningAnswers.map((a) => [...a]);
		next[sectionIndex] = next[sectionIndex] ?? [];
		next[sectionIndex][questionIndex] = value;
		setListeningAnswers(next);
	}
	function continueReading() {
		if (readingPassageIndex + 1 < mockSet.reading.passages.length) {
			setReadingPassageIndex((i) => i + 1);
			setReadingRevealed(false);
		} else setStage("listening");
	}
	function continueListening() {
		stopSpeech();
		if (listeningSectionIndex + 1 < mockSet.listening.sections.length) setListeningSectionIndex((i) => i + 1);
		else setStage("writing");
	}
	const stepIndex = [
		"reading",
		"listening",
		"writing",
		"speaking"
	].indexOf(stage);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {
		title: mockSet.title,
		subtitle: "Reading · Listening · Writing · Speaking",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl",
			children: [
				stepIndex >= 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: (stepIndex + 1) / 4 * 100,
					className: "mb-6 h-2"
				}),
				stage === "intro" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-card p-8 text-center shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-extrabold text-foreground",
							children: mockSet.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-3 max-w-md text-sm text-muted-foreground",
							children: "Four sections, just like the real IELTS exam. Reading: 3 passages, 40 questions — read each passage, then answer. Listening: 4 sections, 40 questions — you'll hear the audio and type your answers into the gaps. Writing: two compulsory tasks — a Task 1 report (150+ words) and a Task 2 essay (250+ words). Speaking: three parts, spoken aloud and recorded through your microphone."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							size: "pill-lg",
							className: "mt-6",
							onClick: () => setStage("reading"),
							children: "Start mock test"
						})
					]
				}),
				stage === "reading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-card p-6 shadow-card sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-extrabold text-foreground",
								children: "Reading"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground",
								children: [
									"Passage ",
									readingPassageIndex + 1,
									" of ",
									mockSet.reading.passages.length
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm font-bold text-foreground",
							children: readingPassage.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 rounded-2xl bg-secondary/60 p-5 text-sm leading-relaxed text-foreground",
							children: readingPassage.passage
						}),
						!readingRevealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							size: "pill",
							className: "mt-6 w-full",
							onClick: () => setReadingRevealed(true),
							children: "I've finished reading — continue to questions"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(McSection, {
								questions: readingPassage.questions,
								answers: readingAnswers[readingPassageIndex] ?? [],
								onAnswer: (i, o) => setReadingAnswer(readingPassageIndex, i, o)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							size: "pill",
							className: "mt-6 w-full",
							onClick: continueReading,
							children: readingPassageIndex + 1 < mockSet.reading.passages.length ? "Continue to next passage" : "Continue to Listening"
						})] })
					]
				}),
				stage === "listening" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-card p-6 shadow-card sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-extrabold text-foreground",
								children: "Listening"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground",
								children: [
									"Section ",
									listeningSectionIndex + 1,
									" of ",
									mockSet.listening.sections.length
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: listeningSection.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Play the audio and listen carefully — the text is not shown, just like the real test. Type ONE word or number into each gap, as on the real answer sheet."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "hero",
								size: "pill-lg",
								disabled: !ttsSupported,
								onClick: () => isSpeaking ? stopSpeech() : speak(listeningSection.transcript),
								children: [isSpeaking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" }), isSpeaking ? "Stop" : "Play audio"]
							})
						}),
						!ttsSupported && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-center text-xs text-destructive",
							children: "Audio playback isn't supported in this browser."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FillSection, {
								questions: listeningSection.questions,
								answers: listeningAnswers[listeningSectionIndex] ?? [],
								onAnswer: (i, v) => setListeningAnswer(listeningSectionIndex, i, v)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							size: "pill",
							className: "mt-6 w-full",
							onClick: continueListening,
							children: listeningSectionIndex + 1 < mockSet.listening.sections.length ? "Continue to next section" : "Continue to Writing"
						})
					]
				}),
				stage === "writing" && writingTask === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-card p-6 shadow-card sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-extrabold text-foreground",
								children: "Writing Task 1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground",
								children: "Task 1 of 2 · min 150 words"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 whitespace-pre-line rounded-2xl bg-secondary p-4 text-sm leading-relaxed text-secondary-foreground",
							children: mockSet.writing.task1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: writing1,
							onChange: (e) => setWriting1(e.target.value),
							rows: 12,
							maxLength: 4500,
							placeholder: "Summarise the information by selecting and reporting the main features…",
							className: "mt-4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [countWords(writing1), " / 150 words minimum"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							size: "pill",
							className: "mt-4 w-full",
							onClick: () => setWritingTask(2),
							children: "Continue to Task 2"
						}),
						countWords(writing1) < 150 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-center text-xs text-muted-foreground",
							children: "You are below the 150-word minimum — the examiner will reduce your band for it, just like the real exam, but you may continue whenever you are ready."
						})
					]
				}),
				stage === "writing" && writingTask === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-card p-6 shadow-card sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-extrabold text-foreground",
								children: "Writing Task 2"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground",
								children: "Task 2 of 2 · min 250 words"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground",
							children: mockSet.writing.task2
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: writing2,
							onChange: (e) => setWriting2(e.target.value),
							rows: 12,
							maxLength: 6e3,
							placeholder: "Write your essay here…",
							className: "mt-4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [countWords(writing2), " / 250 words minimum"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "soft",
								size: "pill",
								className: "flex-1",
								onClick: () => setWritingTask(1),
								children: "Back to Task 1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "hero",
								size: "pill",
								className: "flex-1",
								onClick: () => {
									stopSpeech();
									setStage("speaking");
								},
								children: "Continue to Speaking"
							})]
						}),
						countWords(writing2) < 250 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-center text-xs text-muted-foreground",
							children: "You are below the 250-word minimum — the examiner will reduce your band for it, just like the real exam (Task 2 is worth two-thirds of your writing score)."
						})
					]
				}),
				stage === "speaking" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-4 text-center text-xs font-semibold text-muted-foreground",
					children: [
						"Speaking question ",
						speakingIndex + 1,
						" of ",
						mockSet.speaking.length
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpeakingRecorder, {
					question: mockSet.speaking[speakingIndex],
					onDone: handleSpeakingDone
				}, speakingIndex)] }),
				stage === "result" && evaluating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-card p-8 text-center shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-10 w-10 animate-spin text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 text-xl font-extrabold text-foreground",
							children: "Evaluating your writing and speaking…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
							children: "Our examiner AI is scoring your answers against the official IELTS criteria. This usually takes a few seconds."
						})
					]
				}),
				stage === "result" && !evaluating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-3xl bg-card p-8 text-center shadow-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary",
									children: "Overall band"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-6xl font-extrabold text-gradient-primary",
									children: scores.overall.toFixed(1)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary",
									children: [
										bandMeaning(scores.overall),
										" · ",
										bandCefr(scores.overall)
									]
								}),
								feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs text-muted-foreground",
									children: feedback.writing.source === "ai" || feedback.speaking?.source === "ai" ? "Writing and Speaking were evaluated by AI against the official IELTS criteria." : "Bands estimated locally — detailed AI feedback is unavailable right now."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-3xl bg-card p-6 shadow-card sm:p-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-extrabold text-foreground",
								children: "Section scores"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 space-y-4",
								children: [
									{
										key: "listening",
										label: "Listening",
										icon: Headphones,
										subline: `${rawCounts.listeningCorrect}/40 correct`
									},
									{
										key: "reading",
										label: "Reading",
										icon: BookOpen,
										subline: `${rawCounts.readingCorrect}/40 correct`
									},
									{
										key: "writing",
										label: "Writing",
										icon: PenLine,
										subline: feedback?.writing.source === "ai" ? "Evaluated by AI" : "Estimated locally"
									},
									{
										key: "speaking",
										label: "Speaking",
										icon: Mic,
										subline: feedback?.speaking?.source === "ai" ? "Evaluated by AI (transcript)" : "Estimated locally"
									}
								].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(row.icon, { className: "h-5 w-5 text-foreground" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-baseline justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-bold text-foreground",
													children: row.label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-extrabold text-foreground",
													children: scores[row.key].toFixed(1)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
												value: scores[row.key] / 9 * 100,
												className: "mt-1.5 h-1.5"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-muted-foreground",
												children: row.subline
											})
										]
									})]
								}, row.key))
							})]
						}),
						feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-3xl bg-card p-6 shadow-card sm:p-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-extrabold text-foreground",
									children: "Detailed examiner feedback"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Open a section to see how each official criterion was scored."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Accordion, {
									type: "single",
									collapsible: true,
									className: "mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
										value: "writing",
										className: "rounded-2xl border-none bg-secondary/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
											className: "px-4 py-3 hover:no-underline",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex flex-1 items-center justify-between pr-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-2 text-sm font-extrabold text-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4 text-primary" }), " Writing"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-full bg-card px-3 py-1 text-xs font-bold text-foreground",
													children: [feedback.writing.band.toFixed(1), feedback.writing.source === "ai" ? " · AI" : " · est."]
												})]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
											className: "px-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillFeedbackDetail, { feedback: feedback.writing })
										})]
									}), feedback.speaking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
										value: "speaking",
										className: "mt-3 rounded-2xl border-none bg-secondary/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
											className: "px-4 py-3 hover:no-underline",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex flex-1 items-center justify-between pr-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-2 text-sm font-extrabold text-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4 w-4 text-primary" }), " Speaking"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-full bg-card px-3 py-1 text-xs font-bold text-foreground",
													children: [feedback.speaking.band.toFixed(1), feedback.speaking.source === "ai" ? " · AI" : " · est."]
												})]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
											className: "px-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillFeedbackDetail, {
												feedback: feedback.speaking,
												pronunciationNote: true
											})
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							className: "rounded-3xl bg-card p-6 text-center shadow-card sm:p-8",
							children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Saving your result…"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: nextMock ? `${nextMock.title} is now unlocked!` : "You've completed all 10 mock tests! 🎉"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap justify-center gap-3",
								children: [nextMock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "hero",
									size: "pill",
									onClick: () => navigate({
										to: "/mock-test/$mockId",
										params: { mockId: nextMock.id }
									}),
									children: ["Start ", nextMock.title]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "soft",
									size: "pill",
									onClick: () => navigate({ to: "/mock-test" }),
									children: "Back to mock tests"
								})]
							})] })
						})
					]
				})
			]
		})
	});
}
//#endregion
export { MockTestRunPage as component };
