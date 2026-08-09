import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { A as recordActivity, E as listVideos, O as markVideoWatched } from "./db-n4ZYRMBI.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useAuth } from "./router-CpIOtHbc.mjs";
import { H as CircleCheck, V as CirclePlay } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-CYXajmEg.mjs";
import { t as DashboardShell } from "./DashboardShell-BjTGUMyS.mjs";
import { t as VideoPlayerDialog } from "./VideoPlayerDialog-Dbj-Uy19.mjs";
import { t as Progress } from "./progress-DNQG9uUV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/videos-IB_fVrWo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VideosPage() {
	const { user, refresh } = useAuth();
	const queryClient = useQueryClient();
	const { data: videos = [] } = useQuery({
		queryKey: ["videos"],
		queryFn: listVideos
	});
	const [playing, setPlaying] = (0, import_react.useState)(null);
	const watched = user?.videosWatched ?? [];
	const progress = videos.length ? watched.length / videos.length * 100 : 0;
	async function watch(video) {
		if (video.sourceType === "file") setPlaying(video);
		else window.open(video.url, "_blank", "noopener,noreferrer");
		const { id } = video;
		if (!user || watched.includes(id)) return;
		await markVideoWatched(user.uid, id);
		const optimistic = {
			...user,
			videosWatched: [...watched, id]
		};
		const { xpGained, newBadges } = await recordActivity(optimistic, "video");
		await refresh();
		queryClient.invalidateQueries({ queryKey: ["videos"] });
		const total = watched.length + 1;
		toast.success(total === 5 ? `5 lessons watched — your free IELTS bonus lesson is unlocked! +${xpGained} XP` : `Marked as watched · +${xpGained} XP`);
		newBadges.forEach((b) => toast(`🏅 New badge: ${b.name}`));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DashboardShell, {
		title: "Video lessons",
		subtitle: "Watch, learn and track your progress",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl bg-card p-6 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-foreground",
						children: "Your progress"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							watched.length,
							" of ",
							videos.length,
							" lessons watched"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground",
						children: [Math.round(progress), "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: progress,
					className: "mt-4 h-2"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3",
				children: videos.map((video) => {
					const done = watched.includes(video.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "overflow-hidden rounded-3xl bg-card shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: video.thumbnail,
								alt: video.title,
								loading: "lazy",
								className: "aspect-video w-full object-cover"
							}), done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute right-3 top-3 flex items-center gap-1 rounded-full bg-success px-3 py-1 text-[11px] font-bold text-success-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Watched"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-bold text-foreground",
									children: video.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground",
									children: video.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: done ? "soft" : "hero",
									size: "pill",
									className: "mt-4 w-full",
									onClick: () => watch(video),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-4 w-4" }), done ? "Watch again" : "Watch lesson"]
								})
							]
						})]
					}, video.id);
				})
			}),
			videos.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-center text-sm text-muted-foreground",
				children: "No lessons published yet. Check back soon."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoPlayerDialog, {
				video: playing,
				onOpenChange: (open) => !open && setPlaying(null)
			})
		]
	});
}
//#endregion
export { VideosPage as component };
