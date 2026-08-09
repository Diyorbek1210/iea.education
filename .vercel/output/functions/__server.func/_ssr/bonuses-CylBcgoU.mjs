import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { S as listBonusLessons } from "./db-n4ZYRMBI.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as useAuth } from "./router-CpIOtHbc.mjs";
import { P as Gift, V as CirclePlay, k as Lock } from "../_libs/lucide-react.mjs";
import { i as cn, t as Button } from "./button-CYXajmEg.mjs";
import { t as DashboardShell } from "./DashboardShell-BjTGUMyS.mjs";
import { t as VideoPlayerDialog } from "./VideoPlayerDialog-Dbj-Uy19.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bonuses-CylBcgoU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BonusesPage() {
	const { user } = useAuth();
	const { data: bonusLessons = [] } = useQuery({
		queryKey: ["bonus-lessons"],
		queryFn: listBonusLessons
	});
	const [playing, setPlaying] = (0, import_react.useState)(null);
	const watched = user?.videosWatched ?? [];
	const bonusUnlocked = watched.length >= 5;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashboardShell, {
		title: "Bonus lessons",
		subtitle: `Exclusive content unlocked after watching 5 lessons`,
		children: [
			!bonusUnlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-3xl bg-secondary p-6 shadow-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-foreground",
						children: "Bonuses locked"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							"Watch ",
							5 - watched.length,
							" more lesson(s) to unlock all bonus content."
						]
					})] })]
				})
			}),
			bonusLessons.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-card p-12 text-center shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "mx-auto h-12 w-12 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm font-bold text-foreground",
						children: "No bonuses yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Check back soon for exclusive bonus lessons."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: bonusLessons.map((bonus) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: cn("overflow-hidden rounded-3xl shadow-card transition-all", bonusUnlocked ? "bg-card" : "bg-secondary opacity-75"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-gradient-primary p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wide text-primary-foreground/80",
								children: bonusUnlocked ? "Unlocked" : "Locked"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 text-lg font-extrabold text-primary-foreground",
								children: bonus.title
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-8 w-8 text-primary-foreground/40 shrink-0" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-muted-foreground",
							children: bonus.description
						}), bonusUnlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "hero",
							size: "pill",
							className: "mt-5 w-full",
							onClick: () => bonus.sourceType === "file" ? setPlaying(bonus) : window.open(bonus.url, "_blank", "noopener,noreferrer"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-4 w-4" }), " Watch now"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "soft",
							size: "pill",
							disabled: true,
							className: "mt-5 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), " Locked"]
						})]
					})]
				}, bonus.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoPlayerDialog, {
				video: playing,
				onOpenChange: (open) => !open && setPlaying(null)
			})
		]
	});
}
//#endregion
export { BonusesPage as component };
