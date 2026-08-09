import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as listMockResults, j as setDailyGoal, k as nextXpLevel, l as computeXpLevel, n as BADGES, r as DAILY_GOAL_PRESETS } from "./db-n4ZYRMBI.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useAuth } from "./router-CpIOtHbc.mjs";
import { B as ClipboardCheck, F as Gamepad2, H as CircleCheck, I as Flame, P as Gift, V as CirclePlay, c as TrendingUp, k as Lock, l as TrendingDown, o as Trophy, p as Star } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn, t as Button } from "./button-CYXajmEg.mjs";
import { a as Area, i as XAxis, o as CartesianGrid, r as YAxis, t as AreaChart } from "../_libs/recharts+[...].mjs";
import { a as ChartTooltipContent, i as ChartTooltip, n as ChartLegend, r as ChartLegendContent, t as ChartContainer } from "./chart-CGH2K6Ou.mjs";
import { t as DashboardShell } from "./DashboardShell-BjTGUMyS.mjs";
import { r as mockTests } from "./mockTest-DcSU1hPy.mjs";
import { t as Progress } from "./progress-DNQG9uUV.mjs";
import { n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/radix-ui__react-avatar.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DgUzLlau.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SIZE = 96;
var STROKE = 9;
var RADIUS = 87 / 2;
var CIRCUMFERENCE = 2 * Math.PI * RADIUS;
function DailyGoalRing({ todayXp, dailyGoal }) {
	const offset = CIRCUMFERENCE * (1 - (dailyGoal > 0 ? Math.min(1, todayXp / dailyGoal) : 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-24 w-24 shrink-0 items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: SIZE,
			height: SIZE,
			className: "-rotate-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: SIZE / 2,
				cy: SIZE / 2,
				r: RADIUS,
				fill: "none",
				strokeWidth: STROKE,
				className: "stroke-secondary"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: SIZE / 2,
				cy: SIZE / 2,
				r: RADIUS,
				fill: "none",
				strokeWidth: STROKE,
				strokeLinecap: "round",
				strokeDasharray: CIRCUMFERENCE,
				strokeDashoffset: offset,
				className: "stroke-primary transition-all duration-500"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute flex flex-col items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-extrabold text-foreground",
				children: todayXp
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[10px] text-muted-foreground",
				children: [
					"/ ",
					dailyGoal,
					" XP"
				]
			})]
		})]
	});
}
var chartConfig = {
	overall: {
		label: "Overall",
		color: "var(--color-chart-1)"
	},
	listening: {
		label: "Listening",
		color: "var(--color-chart-2)"
	},
	reading: {
		label: "Reading",
		color: "var(--color-chart-3)"
	},
	writing: {
		label: "Writing",
		color: "var(--color-chart-4)"
	},
	speaking: {
		label: "Speaking",
		color: "var(--color-chart-5)"
	}
};
/** Band progression across completed mock tests, shown on the dashboard. */
function MockProgressChart({ results }) {
	const data = [...results].sort((a, b) => a.date.localeCompare(b.date)).map((r) => {
		const mock = mockTests.find((m) => m.id === r.mockTestId);
		return {
			name: mock ? `Mock ${mock.order}` : r.mockTestId ?? "Mock",
			overall: r.overall,
			listening: r.listening,
			reading: r.reading,
			writing: r.writing,
			speaking: r.speaking
		};
	});
	if (data.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-3xl bg-card p-6 text-center shadow-card sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "h-6 w-6 text-muted-foreground" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm font-bold text-foreground",
				children: "No mock tests completed yet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-1 max-w-sm text-xs text-muted-foreground",
				children: "Take your first IELTS mock test and your band progression chart will appear here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "hero",
				size: "pill",
				className: "mt-4",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/mock-test",
					children: "Take a mock test"
				})
			})
		]
	});
	const latest = data[data.length - 1].overall;
	const previous = data.length > 1 ? data[data.length - 2].overall : null;
	const delta = previous !== null ? Math.round((latest - previous) * 10) / 10 : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-3xl bg-card p-6 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-bold text-foreground",
				children: "Mock test progress"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					data.length,
					" of ",
					mockTests.length,
					" mocks completed"
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Latest overall"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xl font-extrabold text-foreground",
						children: latest.toFixed(1)
					}),
					delta !== null && delta !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: cn("flex items-center justify-end gap-1 text-xs font-bold", delta > 0 ? "text-success" : "text-destructive"),
						children: [
							delta > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5" }),
							delta > 0 ? "+" : "",
							delta.toFixed(1),
							" vs previous"
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
			config: chartConfig,
			className: "mt-4 aspect-auto h-56 w-full sm:h-64",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data,
				margin: {
					left: -20,
					right: 8
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "mockOverallFill",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "var(--color-chart-1)",
							stopOpacity: .35
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "var(--color-chart-1)",
							stopOpacity: .02
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { vertical: false }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "name",
						tickLine: false,
						axisLine: false,
						tickMargin: 8,
						fontSize: 11
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						domain: [0, 9],
						tickCount: 7,
						tickLine: false,
						axisLine: false,
						tickMargin: 8,
						fontSize: 11
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, { indicator: "line" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "listening",
						stroke: "var(--color-listening)",
						strokeWidth: 1.5,
						fill: "none",
						dot: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "reading",
						stroke: "var(--color-reading)",
						strokeWidth: 1.5,
						fill: "none",
						dot: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "writing",
						stroke: "var(--color-writing)",
						strokeWidth: 1.5,
						fill: "none",
						dot: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "speaking",
						stroke: "var(--color-speaking)",
						strokeWidth: 1.5,
						fill: "none",
						dot: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "overall",
						stroke: "var(--color-overall)",
						strokeWidth: 3,
						fill: "url(#mockOverallFill)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLegend, {
						content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLegendContent, {}),
						className: "pt-2"
					})
				]
			})
		})]
	});
}
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var ICONS = {
	CheckCircle2: CircleCheck,
	Flame,
	Gift,
	PlayCircle: CirclePlay,
	ClipboardCheck,
	Gamepad2,
	Star,
	Trophy
};
function initials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}
function StatTile({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-secondary p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-2xl font-extrabold text-secondary-foreground",
			children: value
		})]
	});
}
function DashboardPage() {
	const { user, refresh } = useAuth();
	const { data: mockResults = [] } = useQuery({
		queryKey: ["mock-results"],
		queryFn: listMockResults
	});
	if (!user) return null;
	const myMockResults = mockResults.filter((r) => r.userId === user.uid);
	const xp = user.xp ?? 0;
	const streak = user.streak ?? 0;
	const longestStreak = user.longestStreak ?? 0;
	const todayXp = user.todayXp ?? 0;
	const dailyGoal = user.dailyGoal ?? 20;
	const unlockedBadges = new Set(user.badges ?? []);
	const currentLevel = computeXpLevel(xp);
	const next = nextXpLevel(xp);
	const levelProgress = next ? (xp - currentLevel.minXp) / (next.minXp - currentLevel.minXp) * 100 : 100;
	async function pickGoal(goal) {
		if (!user) return;
		await setDailyGoal(user.uid, goal);
		await refresh();
		toast.success(`Daily goal set to ${goal} XP`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {
		title: "Dashboard",
		subtitle: "Streak, XP, daily goal and badges",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex flex-wrap items-center gap-5 rounded-3xl bg-card p-6 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						className: "h-16 w-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
							className: "bg-gradient-primary text-lg font-extrabold text-primary-foreground",
							children: initials(user.name)
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "truncate text-lg font-extrabold text-foreground",
								children: user.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: user.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									children: user.level
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-gradient-primary text-primary-foreground",
									children: currentLevel.title
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid gap-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl bg-card p-6 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-sm font-bold text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-primary" }), " Streak"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-3xl font-extrabold text-foreground",
								children: [streak, " days"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"Best streak: ",
									longestStreak,
									" days"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl bg-card p-6 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-foreground",
								children: "Experience"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-3xl font-extrabold text-foreground",
								children: [xp, " XP"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: levelProgress,
								className: "mt-3 h-2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: next ? `${next.minXp - xp} XP to ${next.title}` : "Max level reached"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MockProgressChart, { results: myMockResults }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-card p-6 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-foreground",
						children: "Daily goal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-center gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyGoalRing, {
							todayXp,
							dailyGoal
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: DAILY_GOAL_PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: dailyGoal === preset ? "hero" : "soft",
								size: "pill",
								onClick: () => pickGoal(preset),
								children: [preset, " XP"]
							}, preset))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold text-foreground",
					children: "Badges"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: BADGES.map((badge) => {
						const unlocked = unlockedBadges.has(badge.id);
						const Icon = ICONS[badge.icon] ?? Star;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex items-center gap-3 rounded-2xl p-4 shadow-card transition-all", unlocked ? "bg-gradient-primary" : "bg-secondary opacity-70"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", unlocked ? "bg-primary-foreground/20" : "bg-card"),
								children: unlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-primary-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-muted-foreground" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("text-sm font-bold", unlocked ? "text-primary-foreground" : "text-foreground"),
									children: badge.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("text-xs", unlocked ? "text-primary-foreground/80" : "text-muted-foreground"),
									children: badge.description
								})]
							})]
						}, badge.id);
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid grid-cols-2 gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
							label: "Videos watched",
							value: user.videosWatched?.length ?? 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
							label: "Mock tests",
							value: user.mockResults?.length ?? 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
							label: "Games played",
							value: user.gamesPlayed ?? 0
						})
					]
				})
			]
		})
	});
}
//#endregion
export { DashboardPage as component };
