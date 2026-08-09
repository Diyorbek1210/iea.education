import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { A as recordActivity } from "./db-n4ZYRMBI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useAuth } from "./router-CpIOtHbc.mjs";
import { I as Flame, W as Check, d as Timer, n as X, v as RotateCcw } from "../_libs/lucide-react.mjs";
import { i as cn, t as Button } from "./button-CYXajmEg.mjs";
import { t as Input } from "./input-BZL4ZIgS.mjs";
import { t as DashboardShell } from "./DashboardShell-BjTGUMyS.mjs";
import { t as Progress } from "./progress-DNQG9uUV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/games-Ci6GxDar.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var gameWords = [
	{
		word: "ambitious",
		hint: "Having a strong desire to succeed"
	},
	{
		word: "reluctant",
		hint: "Unwilling and hesitant"
	},
	{
		word: "sustainable",
		hint: "Able to continue over time without harm"
	},
	{
		word: "vocabulary",
		hint: "All the words a person knows"
	},
	{
		word: "deadline",
		hint: "The latest time to finish something"
	},
	{
		word: "confident",
		hint: "Sure of yourself"
	},
	{
		word: "opportunity",
		hint: "A chance to do something"
	},
	{
		word: "improve",
		hint: "To make better"
	},
	{
		word: "fluency",
		hint: "Speaking smoothly and easily"
	},
	{
		word: "challenge",
		hint: "Something difficult that tests you"
	},
	{
		word: "knowledge",
		hint: "Information and understanding"
	},
	{
		word: "persuade",
		hint: "To convince someone"
	}
];
var vocabularyQuiz = [
	{
		q: "Synonym of 'enormous'",
		options: [
			"Tiny",
			"Huge",
			"Quick",
			"Quiet"
		],
		answer: 1
	},
	{
		q: "Opposite of 'scarce'",
		options: [
			"Rare",
			"Abundant",
			"Limited",
			"Empty"
		],
		answer: 1
	},
	{
		q: "'To postpone' means to…",
		options: [
			"Cancel",
			"Delay",
			"Finish",
			"Begin"
		],
		answer: 1
	},
	{
		q: "A 'meticulous' person is…",
		options: [
			"Careless",
			"Very careful",
			"Loud",
			"Lazy"
		],
		answer: 1
	},
	{
		q: "Synonym of 'crucial'",
		options: [
			"Essential",
			"Optional",
			"Boring",
			"Cheap"
		],
		answer: 0
	},
	{
		q: "'Weary' means…",
		options: [
			"Excited",
			"Tired",
			"Angry",
			"Curious"
		],
		answer: 1
	},
	{
		q: "Opposite of 'temporary'",
		options: [
			"Brief",
			"Permanent",
			"Short",
			"Fast"
		],
		answer: 1
	},
	{
		q: "'To acquire' means to…",
		options: [
			"Lose",
			"Obtain",
			"Break",
			"Sell"
		],
		answer: 1
	},
	{
		q: "A 'vivid' description is…",
		options: [
			"Vague",
			"Clear and detailed",
			"Short",
			"False"
		],
		answer: 1
	},
	{
		q: "Synonym of 'reveal'",
		options: [
			"Hide",
			"Disclose",
			"Deny",
			"Repeat"
		],
		answer: 1
	},
	{
		q: "'Diligent' means…",
		options: [
			"Hardworking",
			"Rude",
			"Sleepy",
			"Wealthy"
		],
		answer: 0
	},
	{
		q: "Opposite of 'ancient'",
		options: [
			"Old",
			"Modern",
			"Historic",
			"Classic"
		],
		answer: 1
	}
];
var scrambleWords = [
	"listening",
	"grammar",
	"practice",
	"speaking",
	"reading",
	"writing",
	"student",
	"teacher",
	"english",
	"success"
];
function shuffle(items) {
	return [...items].sort(() => Math.random() - .5);
}
function TimedQuizGame({ onComplete }) {
	const [items, setItems] = (0, import_react.useState)(() => shuffle(vocabularyQuiz).slice(0, 8));
	const [index, setIndex] = (0, import_react.useState)(0);
	const [score, setScore] = (0, import_react.useState)(0);
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(45);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const reportedRef = (0, import_react.useRef)(false);
	function reportComplete(finalScore) {
		if (reportedRef.current) return;
		reportedRef.current = true;
		onComplete?.(finalScore, items.length);
	}
	(0, import_react.useEffect)(() => {
		if (!running) return;
		if (timeLeft <= 0) {
			setRunning(false);
			reportComplete(score);
			return;
		}
		const id = setTimeout(() => setTimeLeft((t) => t - 1), 1e3);
		return () => clearTimeout(id);
	}, [running, timeLeft]);
	const finished = !running && (timeLeft <= 0 || index >= items.length);
	const current = items[index];
	function start() {
		setItems(shuffle(vocabularyQuiz).slice(0, 8));
		setIndex(0);
		setScore(0);
		setTimeLeft(45);
		setPicked(null);
		setRunning(true);
		reportedRef.current = false;
	}
	function answer(option) {
		if (!current || picked !== null) return;
		setPicked(option);
		const nextScore = option === current.answer ? score + 1 : score;
		if (option === current.answer) setScore(nextScore);
		setTimeout(() => {
			setPicked(null);
			if (index + 1 >= items.length) {
				setRunning(false);
				setIndex(items.length);
				reportComplete(nextScore);
			} else setIndex((i) => i + 1);
		}, 500);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl bg-card p-6 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2 text-base font-bold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-primary" }), " Timed Vocabulary Rush"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-3 w-3" }),
						" ",
						timeLeft,
						"s"
					]
				})]
			}),
			!running && !finished && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "8 questions, 45 seconds. How many can you get right before the clock runs out?"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "hero",
				size: "pill",
				className: "mt-5",
				onClick: start,
				children: "Start challenge"
			})] }),
			running && current && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: index / items.length * 100,
					className: "mt-4 h-1.5"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-lg font-bold text-foreground",
					children: current.q
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-2 sm:grid-cols-2",
					children: current.options.map((option, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => answer(i),
						className: cn("rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition-all", picked === null ? "border-border bg-background hover:border-primary/50" : i === current.answer ? "border-success bg-success/10 text-success" : picked === i ? "border-destructive bg-destructive/10 text-destructive" : "border-border bg-background opacity-60"),
						children: option
					}, option))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-xs font-semibold text-muted-foreground",
					children: ["Score: ", score]
				})
			] }),
			finished && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-2xl bg-secondary p-5 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-primary",
						children: "Final score"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-3xl font-extrabold text-secondary-foreground",
						children: [
							score,
							"/",
							items.length
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "hero",
						size: "pill",
						className: "mt-4",
						onClick: start,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), " Play again"]
					})
				]
			})
		]
	});
}
var ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
function HangmanGame({ onComplete }) {
	const [target, setTarget] = (0, import_react.useState)(() => gameWords[Math.floor(Math.random() * gameWords.length)]);
	const [guessed, setGuessed] = (0, import_react.useState)([]);
	const reportedRef = (0, import_react.useRef)(false);
	const lives = 6 - guessed.filter((letter) => !target.word.includes(letter)).length;
	const won = target.word.split("").every((letter) => guessed.includes(letter));
	const lost = lives <= 0;
	(0, import_react.useEffect)(() => {
		if (!won && !lost) return;
		if (reportedRef.current) return;
		reportedRef.current = true;
		onComplete?.(won ? 1 : 0, 1);
	}, [won, lost]);
	function reset() {
		setTarget(gameWords[Math.floor(Math.random() * gameWords.length)]);
		setGuessed([]);
		reportedRef.current = false;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl bg-card p-6 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold text-foreground",
					children: "Word Rescue (Hangman)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground",
					children: ["Lives: ", Math.max(lives, 0)]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: ["Hint: ", target.hint]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-center font-mono text-2xl font-extrabold tracking-[0.35em] text-foreground",
				children: target.word.split("").map((letter) => guessed.includes(letter) || lost ? letter : "_").join(" ")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap justify-center gap-1.5",
				children: ALPHABET.map((letter) => {
					const used = guessed.includes(letter);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: used || won || lost,
						onClick: () => setGuessed((g) => [...g, letter]),
						className: cn("h-8 w-8 rounded-lg text-xs font-bold uppercase transition-colors", used ? target.word.includes(letter) ? "bg-success text-success-foreground" : "bg-destructive/15 text-destructive" : "bg-secondary text-secondary-foreground hover:bg-accent disabled:opacity-40"),
						children: letter
					}, letter);
				})
			}),
			(won || lost) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-center justify-between rounded-2xl bg-secondary px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "flex items-center gap-2 text-sm font-bold text-secondary-foreground",
					children: won ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-success" }), " You saved the word!"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 text-destructive" }),
						" It was “",
						target.word,
						"”"
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "hero",
					size: "pill",
					onClick: reset,
					children: "New word"
				})]
			})
		]
	});
}
function ScrambleGame({ onComplete }) {
	const [word, setWord] = (0, import_react.useState)(() => scrambleWords[Math.floor(Math.random() * scrambleWords.length)]);
	const [value, setValue] = (0, import_react.useState)("");
	const [streak, setStreak] = (0, import_react.useState)(0);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const scrambled = (0, import_react.useMemo)(() => shuffle(word.split("")).join(""), [word]);
	function check() {
		if (value.trim().toLowerCase() === word) {
			setStatus("correct");
			setStreak((s) => s + 1);
			onComplete?.(1, 1);
			setTimeout(() => {
				setWord(scrambleWords[Math.floor(Math.random() * scrambleWords.length)]);
				setValue("");
				setStatus("idle");
			}, 700);
		} else {
			setStatus("wrong");
			setStreak(0);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl bg-card p-6 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold text-foreground",
					children: "Unscramble the Word"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground",
					children: ["Streak: ", streak]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-center font-mono text-3xl font-extrabold uppercase tracking-[0.3em] text-gradient-primary",
				children: scrambled
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value,
					onChange: (e) => {
						setValue(e.target.value);
						setStatus("idle");
					},
					onKeyDown: (e) => e.key === "Enter" && check(),
					placeholder: "Type the correct word",
					maxLength: 30,
					className: cn(status === "wrong" && "border-destructive", status === "correct" && "border-success")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "hero",
					size: "pill",
					onClick: check,
					children: "Check"
				})]
			}),
			status === "wrong" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs font-semibold text-destructive",
				children: "Not quite — try again."
			}),
			status === "correct" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs font-semibold text-success",
				children: "Correct! Next word coming…"
			})
		]
	});
}
function GamesPage() {
	const { user, refresh } = useAuth();
	async function handleComplete(score, _max) {
		if (!user) return;
		const { xpGained, newBadges } = await recordActivity(user, "game", { gameScore: score });
		await refresh();
		toast.success(`+${xpGained} XP`);
		newBadges.forEach((b) => toast(`🏅 New badge: ${b.name}`));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {
		title: "Games",
		subtitle: "Learn vocabulary the fun way",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimedQuizGame, { onComplete: handleComplete }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrambleGame, { onComplete: handleComplete }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "xl:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HangmanGame, { onComplete: handleComplete })
				})
			]
		})
	});
}
//#endregion
export { GamesPage as component };
