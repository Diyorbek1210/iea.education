import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { C as listMockResults, T as listUsers, g as effectiveWeeklyXp } from "./db-n4ZYRMBI.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as useAuth } from "./router-CpIOtHbc.mjs";
import { R as Crown, T as Medal, t as Zap } from "../_libs/lucide-react.mjs";
import { i as cn } from "./button-CYXajmEg.mjs";
import { t as DashboardShell } from "./DashboardShell-BjTGUMyS.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leaderboard-BdUb2MDR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function RankList({ rows, currentUserId, emptyMessage, formatValue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl overflow-hidden rounded-3xl bg-card shadow-card",
		children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "p-10 text-center text-sm text-muted-foreground",
			children: emptyMessage
		}), rows.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex items-center gap-4 border-b border-border px-5 py-4 last:border-0", entry.userId === currentUserId && "bg-secondary"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold", index === 0 ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"),
					children: index === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4" }) : index + 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-sm font-bold text-foreground",
						children: [entry.name, entry.userId === currentUserId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-xs font-semibold text-primary",
							children: "You"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: entry.sub
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 text-lg font-extrabold text-foreground",
					children: [index < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medal, { className: "h-4 w-4 text-primary" }), formatValue(entry.value)]
				})
			]
		}, entry.userId))]
	});
}
function LeaderboardPage() {
	const { user } = useAuth();
	const { data: results = [] } = useQuery({
		queryKey: ["mock-results"],
		queryFn: listMockResults
	});
	const { data: users = [] } = useQuery({
		queryKey: ["users"],
		queryFn: listUsers
	});
	const weeklyRanked = users.map((u) => ({
		userId: u.uid,
		name: u.name,
		value: effectiveWeeklyXp(u),
		sub: "this week"
	})).filter((row) => row.value > 0).sort((a, b) => b.value - a.value);
	const best = /* @__PURE__ */ new Map();
	for (const result of results) {
		const current = best.get(result.userId);
		best.set(result.userId, {
			name: result.userName,
			band: Math.max(current?.band ?? 0, result.overall),
			attempts: (current?.attempts ?? 0) + 1
		});
	}
	const bandRanked = [...best.entries()].map(([userId, value]) => ({
		userId,
		name: value.name,
		value: value.band,
		sub: `${value.attempts} ${value.attempts === 1 ? "attempt" : "attempts"}`
	})).sort((a, b) => b.value - a.value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {
		title: "Leaderboard",
		subtitle: "Ranked by weekly XP or best mock band",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "weekly",
			className: "mx-auto max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value: "weekly",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "mr-1.5 h-3.5 w-3.5" }), " Weekly XP"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "band",
					children: "Best Band"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "weekly",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankList, {
						rows: weeklyRanked,
						currentUserId: user?.uid,
						emptyMessage: "No XP earned this week yet — watch a lesson or play a game to get on the board.",
						formatValue: (v) => `${v} XP`
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "band",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankList, {
						rows: bandRanked,
						currentUserId: user?.uid,
						emptyMessage: "No mock results yet — be the first to take the mock test.",
						formatValue: (v) => v.toFixed(1)
					})
				})
			]
		})
	});
}
//#endregion
export { LeaderboardPage as component };
