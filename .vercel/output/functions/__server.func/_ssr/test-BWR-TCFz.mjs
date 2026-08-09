import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as levelDescription, w as listPlacementQuestions, x as levelFromScore } from "./db-n4ZYRMBI.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { H as CircleCheck, q as ArrowRight, s as TriangleAlert, v as RotateCcw } from "../_libs/lucide-react.mjs";
import { i as cn, n as Logo, r as buttonVariants, t as Button } from "./button-CYXajmEg.mjs";
import { a as Overlay2, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Progress } from "./progress-DNQG9uUV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/test-BWR-TCFz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
function PlacementTest() {
	const navigate = useNavigate();
	const { data: questions = [], isLoading } = useQuery({
		queryKey: ["placement-questions"],
		queryFn: listPlacementQuestions
	});
	const [index, setIndex] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)([]);
	const [finished, setFinished] = (0, import_react.useState)(false);
	const [confirmOpen, setConfirmOpen] = (0, import_react.useState)(false);
	const total = questions.length;
	const question = questions[index];
	const answeredCount = answers.filter((answer) => answer !== void 0).length;
	const unansweredCount = total - answeredCount;
	const score = answers.reduce((acc, answer, i) => acc + (answer === questions[i]?.answer ? 1 : 0), 0);
	function choose(option) {
		const next = [...answers];
		next[index] = option;
		setAnswers(next);
	}
	function goNext() {
		if (index + 1 < total) setIndex(index + 1);
	}
	function submitTest() {
		if (answeredCount < total) {
			setConfirmOpen(true);
			return;
		}
		setFinished(true);
	}
	function confirmSubmit() {
		setConfirmOpen(false);
		setFinished(true);
	}
	function restart() {
		setAnswers([]);
		setIndex(0);
		setFinished(false);
	}
	if (isLoading || !question) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-screen items-center justify-center bg-gradient-soft px-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: isLoading ? "Loading the placement test…" : "No questions are available yet."
		})
	});
	if (finished) {
		const level = levelFromScore(score);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex min-h-screen items-center justify-center bg-gradient-soft px-5 py-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-xs rounded-3xl bg-card p-5 text-center shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6 text-primary-foreground" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 text-lg font-extrabold text-foreground",
						children: "Test completed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							"You answered ",
							score,
							" of ",
							total,
							" questions correctly."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-2xl bg-secondary p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary",
								children: "Your level"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-2xl font-extrabold text-gradient-primary",
								children: level
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-secondary-foreground",
								children: levelDescription[level]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "hero",
							size: "pill",
							onClick: () => navigate({
								to: "/register",
								search: {
									level,
									score
								}
							}),
							children: ["Continue to registration ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "pill",
							onClick: restart,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), " Retake the test"]
						})]
					})
				]
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-gradient-soft px-5 py-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "inline-block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 lg:grid-cols-[1fr_250px] lg:items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-card p-5 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs font-semibold text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Question ",
								index + 1,
								" of ",
								total
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Math.round((index + 1) / total * 100), "%"] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: (index + 1) / total * 100,
							className: "mt-2 h-1.5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-5 text-base font-bold leading-snug text-foreground sm:text-lg",
							children: question.q
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-2.5",
							children: question.options.map((option, i) => {
								const selected = answers[index] === i;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => choose(i),
									className: cn("w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all", selected ? "border-primary bg-secondary text-primary shadow-card" : "border-border bg-background text-foreground hover:border-primary/40"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mr-3 font-bold",
										children: [String.fromCharCode(65 + i), "."]
									}), option]
								}, option);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "pill",
								disabled: index === 0,
								onClick: () => setIndex(index - 1),
								children: "Back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "pill",
								disabled: index + 1 >= total,
								onClick: goNext,
								children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "rounded-3xl bg-card p-4 shadow-soft lg:sticky lg:top-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground",
							children: "Questions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid grid-cols-5 gap-1",
							children: questions.map((_, i) => {
								const isAnswered = answers[i] !== void 0;
								const isCurrent = i === index;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIndex(i),
									"aria-label": `Go to question ${i + 1}`,
									className: cn("flex h-7 w-7 items-center justify-center rounded text-xs font-bold transition-all", isCurrent ? "bg-primary text-primary-foreground shadow-card" : isAnswered ? "bg-secondary text-secondary-foreground" : "border border-border text-muted-foreground hover:border-primary/40"),
									children: i + 1
								}, i);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-1 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										children: "Current"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded bg-secondary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										children: "Answered"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded border border-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										children: "Not answered"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-xs font-bold text-foreground",
							children: [
								answeredCount,
								"/",
								total,
								" answered"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "hero",
							size: "pill",
							className: "mt-3 w-full",
							onClick: submitTest,
							children: "Submit test"
						})
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: confirmOpen,
			onOpenChange: setConfirmOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-warning" }), " Test not finished"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"You still have ",
				unansweredCount,
				" unanswered question",
				unansweredCount === 1 ? "" : "s",
				". Unanswered questions are counted as incorrect. Submit anyway?"
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Keep answering" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: confirmSubmit,
				children: "Submit anyway"
			})] })] })
		})]
	});
}
//#endregion
export { PlacementTest as component };
