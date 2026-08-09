import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as listMockResults, E as listVideos, M as updateBonusLesson, N as updatePlacementQuestion, P as uploadLessonVideo, S as listBonusLessons, T as listUsers, _ as getBonusLesson, f as deleteBonusLesson, h as deleteVideo, i as addBonusLesson, m as deleteUserProfile, o as addPlacementQuestion, p as deletePlacementQuestion, s as addVideo, w as listPlacementQuestions } from "./db-n4ZYRMBI.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useAuth } from "./router-CpIOtHbc.mjs";
import { N as GraduationCap, O as LogOut, P as Gift, a as Users, i as Video, j as LayoutDashboard, n as X, u as Trash2, w as Menu, x as Pencil, z as ClipboardList } from "../_libs/lucide-react.mjs";
import { i as cn, n as Logo, t as Button } from "./button-CYXajmEg.mjs";
import { i as XAxis, n as BarChart, o as CartesianGrid, r as YAxis, s as Bar } from "../_libs/recharts+[...].mjs";
import { a as ChartTooltipContent, i as ChartTooltip, t as ChartContainer } from "./chart-CGH2K6Ou.mjs";
import { t as Input } from "./input-BZL4ZIgS.mjs";
import { t as Label } from "./label-CGSSyUya.mjs";
import { t as Textarea } from "./textarea-Bagx0Mq7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-8ZwcfI9k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tabs = [
	{
		id: "overview",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		id: "students",
		label: "Students",
		icon: Users
	},
	{
		id: "videos",
		label: "Videos",
		icon: Video
	},
	{
		id: "placement",
		label: "Placement test",
		icon: ClipboardList
	},
	{
		id: "results",
		label: "Mock results",
		icon: GraduationCap
	},
	{
		id: "bonus",
		label: "Bonus lesson",
		icon: Gift
	}
];
var levelOrder = [
	"Beginner",
	"Elementary",
	"Intermediate",
	"Upper-Intermediate",
	"Advanced"
];
var skillChartConfig = { value: {
	label: "Average band",
	color: "var(--color-primary)"
} };
var levelChartConfig = { value: {
	label: "Students",
	color: "var(--color-primary)"
} };
function AdminPage() {
	const { isAdmin, loading, signOut } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [tab, setTab] = (0, import_react.useState)("overview");
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(false);
	const { data: users = [] } = useQuery({
		queryKey: ["users"],
		queryFn: listUsers
	});
	const { data: videos = [] } = useQuery({
		queryKey: ["videos"],
		queryFn: listVideos
	});
	const { data: results = [] } = useQuery({
		queryKey: ["mock-results"],
		queryFn: listMockResults
	});
	const { data: bonus } = useQuery({
		queryKey: ["bonus"],
		queryFn: getBonusLesson
	});
	const { data: bonusLessons = [] } = useQuery({
		queryKey: ["bonus-lessons"],
		queryFn: listBonusLessons
	});
	const { data: placementQuestions = [] } = useQuery({
		queryKey: ["placement-questions"],
		queryFn: listPlacementQuestions
	});
	const [questionForm, setQuestionForm] = (0, import_react.useState)({
		q: "",
		options: [
			"",
			"",
			"",
			""
		],
		answer: 0
	});
	const [editingQuestionId, setEditingQuestionId] = (0, import_react.useState)(null);
	function editQuestion(question) {
		setEditingQuestionId(question.id);
		setQuestionForm({
			q: question.q,
			options: [...question.options],
			answer: question.answer
		});
	}
	function resetQuestionForm() {
		setEditingQuestionId(null);
		setQuestionForm({
			q: "",
			options: [
				"",
				"",
				"",
				""
			],
			answer: 0
		});
	}
	async function submitQuestion() {
		if (!questionForm.q.trim() || questionForm.options.some((option) => !option.trim())) {
			toast.error("Fill in the question and all 4 options");
			return;
		}
		const payload = {
			q: questionForm.q.trim(),
			options: questionForm.options.map((option) => option.trim()),
			answer: questionForm.answer
		};
		if (editingQuestionId) {
			await updatePlacementQuestion(editingQuestionId, payload);
			toast.success("Question updated");
		} else {
			await addPlacementQuestion(payload);
			toast.success("Question added");
		}
		resetQuestionForm();
		queryClient.invalidateQueries({ queryKey: ["placement-questions"] });
	}
	async function removeQuestion(id) {
		await deletePlacementQuestion(id);
		if (editingQuestionId === id) resetQuestionForm();
		queryClient.invalidateQueries({ queryKey: ["placement-questions"] });
		toast.success("Question deleted");
	}
	const studentsByLevel = levelOrder.map((level) => ({
		level: level.replace("-", " "),
		value: users.filter((student) => student.level === level).length
	}));
	const averageBySkill = [
		"listening",
		"reading",
		"writing",
		"speaking"
	].map((skill) => ({
		skill: skill[0].toUpperCase() + skill.slice(1),
		value: results.length ? Math.round(results.reduce((sum, r) => sum + r[skill], 0) / results.length * 10) / 10 : 0
	}));
	const [video, setVideo] = (0, import_react.useState)({
		title: "",
		description: "",
		url: "",
		thumbnail: ""
	});
	const [videoMode, setVideoMode] = (0, import_react.useState)("youtube");
	const [videoFile, setVideoFile] = (0, import_react.useState)(null);
	const [uploadingVideo, setUploadingVideo] = (0, import_react.useState)(false);
	const [videoCompressRatio, setVideoCompressRatio] = (0, import_react.useState)(null);
	const [bonusForm, setBonusForm] = (0, import_react.useState)({
		title: "",
		description: "",
		url: ""
	});
	const [bonus_item, setBonus_item] = (0, import_react.useState)({
		title: "",
		description: "",
		url: ""
	});
	const [editingBonusId, setEditingBonusId] = (0, import_react.useState)(null);
	const [bonusMode, setBonusMode] = (0, import_react.useState)("youtube");
	const [bonusFile, setBonusFile] = (0, import_react.useState)(null);
	const [uploadingBonus, setUploadingBonus] = (0, import_react.useState)(false);
	const [bonusCompressRatio, setBonusCompressRatio] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (bonus) setBonusForm(bonus);
	}, [bonus]);
	(0, import_react.useEffect)(() => {
		if (!loading && !isAdmin) navigate({ to: "/login" });
	}, [
		loading,
		isAdmin,
		navigate
	]);
	if (loading || !isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Checking admin access…"
		})
	});
	async function submitVideo() {
		if (!video.title.trim()) {
			toast.error("Title is required");
			return;
		}
		if (videoMode === "youtube" && !video.url.trim()) {
			toast.error("Video URL is required");
			return;
		}
		if (videoMode === "file" && !videoFile) {
			toast.error("Choose a video file to upload");
			return;
		}
		setUploadingVideo(true);
		setVideoCompressRatio(null);
		try {
			const url = videoMode === "file" ? await uploadLessonVideo(videoFile, "videos", setVideoCompressRatio) : video.url.trim();
			await addVideo({
				title: video.title.trim(),
				description: video.description.trim(),
				url,
				sourceType: videoMode,
				thumbnail: video.thumbnail.trim() || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=60"
			});
			setVideo({
				title: "",
				description: "",
				url: "",
				thumbnail: ""
			});
			setVideoFile(null);
			queryClient.invalidateQueries({ queryKey: ["videos"] });
			toast.success("Video added");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Video upload failed");
		} finally {
			setUploadingVideo(false);
			setVideoCompressRatio(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-gradient-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5 shadow-card transition-transform lg:static lg:translate-x-0 lg:shadow-none", sidebarOpen ? "translate-x-0" : "-translate-x-full"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							onClick: () => setSidebarOpen(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex w-fit rounded-full bg-gradient-primary px-3 py-1 text-[11px] font-bold text-primary-foreground",
							children: "Admin Panel"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-8 space-y-1",
						children: tabs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setTab(item.id);
								setSidebarOpen(false);
							},
							className: cn("flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-colors", tab === item.id ? "bg-gradient-primary text-primary-foreground shadow-card" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), item.label]
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "pill",
						className: "mt-auto w-full justify-start",
						onClick: async () => {
							await signOut();
							navigate({
								to: "/",
								replace: true
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Sign out"]
					})
				]
			}),
			sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Close menu",
				className: "fixed inset-0 z-40 bg-foreground/30 lg:hidden",
				onClick: () => setSidebarOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-5 py-4 backdrop-blur-md lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-xl border border-border p-2",
						onClick: () => setSidebarOpen((v) => !v),
						"aria-label": "Toggle sidebar",
						children: sidebarOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-bold text-foreground",
						children: "Admin Panel"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "mx-auto max-w-6xl px-5 py-8",
					children: [
						tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-4 sm:grid-cols-3",
							children: [
								{
									label: "Students",
									value: users.length
								},
								{
									label: "Video lessons",
									value: videos.length
								},
								{
									label: "Mock attempts",
									value: results.length
								}
							].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl bg-card p-6 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
									children: stat.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-3xl font-extrabold text-foreground",
									children: stat.value
								})]
							}, stat.label))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid gap-6 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl bg-card p-6 shadow-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-sm font-bold text-foreground",
										children: "Students by level"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "How many registered students fall into each placement level."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
										config: levelChartConfig,
										className: "mt-4 aspect-auto h-64 w-full",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
											data: studentsByLevel,
											margin: { left: -20 },
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { vertical: false }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
													dataKey: "level",
													tickLine: false,
													axisLine: false,
													tickMargin: 8,
													fontSize: 11
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
													tickLine: false,
													axisLine: false,
													allowDecimals: false,
													fontSize: 11
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, { hideLabel: true }) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
													dataKey: "value",
													fill: "var(--color-primary)",
													radius: [
														6,
														6,
														0,
														0
													]
												})
											]
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl bg-card p-6 shadow-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-sm font-bold text-foreground",
										children: "Average band by skill"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "Average score across every saved mock test attempt."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
										config: skillChartConfig,
										className: "mt-4 aspect-auto h-64 w-full",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
											data: averageBySkill,
											margin: { left: -20 },
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { vertical: false }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
													dataKey: "skill",
													tickLine: false,
													axisLine: false,
													tickMargin: 8,
													fontSize: 11
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
													tickLine: false,
													axisLine: false,
													domain: [0, 9],
													fontSize: 11
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, { hideLabel: true }) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
													dataKey: "value",
													fill: "var(--color-primary)",
													radius: [
														6,
														6,
														0,
														0
													]
												})
											]
										})
									})
								]
							})]
						})] }),
						tab === "students" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-6 overflow-hidden rounded-3xl bg-card shadow-card",
							children: [users.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-8 text-center text-sm text-muted-foreground",
								children: "No students registered yet."
							}), users.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3 border-b border-border px-5 py-4 last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-bold text-foreground",
											children: student.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs text-muted-foreground",
											children: student.email
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground",
										children: student.level
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [student.videosWatched?.length ?? 0, " lessons"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: async () => {
											const authDeleted = await deleteUserProfile(student.uid);
											queryClient.invalidateQueries({ queryKey: ["users"] });
											toast.success("Student removed");
											if (!authDeleted) toast.warning("The Firebase Auth account could not be removed (server key not configured). The student may still log in.");
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
									})
								]
							}, student.uid))]
						}),
						tab === "videos" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-6 grid gap-6 lg:grid-cols-[380px_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl bg-card p-6 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-bold text-foreground",
									children: "Add a video lesson"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "v-title",
											children: "Title"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "v-title",
											value: video.title,
											maxLength: 120,
											onChange: (e) => setVideo({
												...video,
												title: e.target.value
											}),
											className: "mt-1.5"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "v-desc",
											children: "Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "v-desc",
											value: video.description,
											maxLength: 400,
											rows: 3,
											onChange: (e) => setVideo({
												...video,
												description: e.target.value
											}),
											className: "mt-1.5"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Source" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1.5 flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: videoMode === "youtube" ? "hero" : "soft",
												size: "pill",
												className: "flex-1",
												onClick: () => setVideoMode("youtube"),
												children: "Link"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: videoMode === "file" ? "hero" : "soft",
												size: "pill",
												className: "flex-1",
												onClick: () => setVideoMode("file"),
												children: "Upload file"
											})]
										})] }),
										videoMode === "youtube" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "v-url",
											children: "Video URL"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "v-url",
											value: video.url,
											maxLength: 500,
											placeholder: "https://youtube.com/watch?v=…",
											onChange: (e) => setVideo({
												...video,
												url: e.target.value
											}),
											className: "mt-1.5"
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "v-file",
												children: "Video file"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "v-file",
												type: "file",
												accept: "video/*",
												onChange: (e) => setVideoFile(e.target.files?.[0] ?? null),
												className: "mt-1.5"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1.5 text-xs text-muted-foreground",
												children: "Larger files are compressed in your browser first, then uploaded."
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "v-thumb",
											children: "Thumbnail URL (optional)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "v-thumb",
											value: video.thumbnail,
											maxLength: 500,
											onChange: (e) => setVideo({
												...video,
												thumbnail: e.target.value
											}),
											className: "mt-1.5"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "hero",
											size: "pill",
											className: "w-full",
											onClick: submitVideo,
											disabled: uploadingVideo,
											children: uploadingVideo ? videoCompressRatio !== null ? `Compressing… ${Math.round(videoCompressRatio * 100)}%` : "Uploading…" : "Add video"
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-hidden rounded-3xl bg-card shadow-card",
								children: videos.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4 border-b border-border p-4 last:border-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: item.thumbnail,
											alt: item.title,
											loading: "lazy",
											className: "h-14 w-24 shrink-0 rounded-xl object-cover"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-sm font-bold text-foreground",
												children: item.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-xs text-muted-foreground",
												children: item.description
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "sm",
											onClick: async () => {
												await deleteVideo(item.id);
												queryClient.invalidateQueries({ queryKey: ["videos"] });
												toast.success("Video deleted");
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
										})
									]
								}, item.id))
							})]
						}),
						tab === "placement" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-6 grid gap-6 lg:grid-cols-[380px_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl bg-card p-6 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-bold text-foreground",
									children: editingQuestionId ? "Edit question" : "Add a placement question"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "q-text",
											children: "Question"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "q-text",
											value: questionForm.q,
											maxLength: 300,
											rows: 2,
											onChange: (e) => setQuestionForm({
												...questionForm,
												q: e.target.value
											}),
											className: "mt-1.5"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Options — click the letter to mark the correct one" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1.5 space-y-2",
											children: questionForm.options.map((option, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setQuestionForm({
														...questionForm,
														answer: i
													}),
													"aria-label": `Mark option ${String.fromCharCode(65 + i)} as correct`,
													className: cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 text-xs font-bold transition-colors", questionForm.answer === i ? "border-primary bg-secondary text-primary" : "border-border text-muted-foreground hover:border-primary/40"),
													children: String.fromCharCode(65 + i)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: option,
													maxLength: 200,
													placeholder: `Option ${String.fromCharCode(65 + i)}`,
													onChange: (e) => {
														const next = [...questionForm.options];
														next[i] = e.target.value;
														setQuestionForm({
															...questionForm,
															options: next
														});
													}
												})]
											}, i))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "hero",
												size: "pill",
												className: "flex-1",
												onClick: submitQuestion,
												children: editingQuestionId ? "Save changes" : "Add question"
											}), editingQuestionId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "pill",
												onClick: resetQuestionForm,
												children: "Cancel"
											})]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "overflow-hidden rounded-3xl bg-card shadow-card",
								children: [placementQuestions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "p-8 text-center text-sm text-muted-foreground",
									children: "No placement questions yet."
								}), placementQuestions.map((question, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-b border-border p-4 last:border-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm font-bold text-foreground",
											children: [
												i + 1,
												". ",
												question.q
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex shrink-0 gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => editQuestion(question),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => removeQuestion(question.id),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 flex flex-wrap gap-1.5",
										children: question.options.map((option, oi) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("rounded-full px-2.5 py-1 text-[11px] font-medium", oi === question.answer ? "bg-success/15 text-success" : "bg-secondary text-secondary-foreground"),
											children: option
										}, oi))
									})]
								}, question.id))]
							})]
						}),
						tab === "results" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-6 overflow-hidden rounded-3xl bg-card shadow-card",
							children: [results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-8 text-center text-sm text-muted-foreground",
								children: "No mock results yet."
							}), results.map((result) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-4 border-b border-border px-5 py-4 last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-bold text-foreground",
											children: result.userName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: new Date(result.date).toLocaleDateString()
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"L ",
											result.listening,
											" · R ",
											result.reading,
											" · W ",
											result.writing,
											" · S",
											" ",
											result.speaking
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-lg font-extrabold text-foreground",
										children: result.overall.toFixed(1)
									})
								]
							}, result.id))]
						}),
						tab === "bonus" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-6 grid gap-6 lg:grid-cols-[380px_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl bg-card p-6 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-bold text-foreground",
									children: editingBonusId ? "Edit bonus" : "Add bonus lesson"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "bonus-title",
											children: "Title"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "bonus-title",
											value: bonus_item.title,
											maxLength: 120,
											onChange: (e) => setBonus_item({
												...bonus_item,
												title: e.target.value
											}),
											className: "mt-1.5"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "bonus-desc",
											children: "Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "bonus-desc",
											value: bonus_item.description,
											maxLength: 400,
											rows: 3,
											onChange: (e) => setBonus_item({
												...bonus_item,
												description: e.target.value
											}),
											className: "mt-1.5"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Source" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1.5 flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: bonusMode === "youtube" ? "hero" : "soft",
												size: "pill",
												className: "flex-1",
												onClick: () => setBonusMode("youtube"),
												children: "Link"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: bonusMode === "file" ? "hero" : "soft",
												size: "pill",
												className: "flex-1",
												onClick: () => setBonusMode("file"),
												children: "Upload file"
											})]
										})] }),
										bonusMode === "youtube" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "bonus-url",
											children: "Video URL"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "bonus-url",
											value: bonus_item.url,
											maxLength: 500,
											onChange: (e) => setBonus_item({
												...bonus_item,
												url: e.target.value
											}),
											className: "mt-1.5"
										})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "bonus-file",
												children: "Video file"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "bonus-file",
												type: "file",
												accept: "video/*",
												onChange: (e) => setBonusFile(e.target.files?.[0] ?? null),
												className: "mt-1.5"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1.5 text-xs text-muted-foreground",
												children: "Larger files are compressed in your browser first, then uploaded."
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "hero",
												size: "pill",
												className: "flex-1",
												disabled: uploadingBonus,
												onClick: async () => {
													if (!bonus_item.title.trim()) {
														toast.error("Title is required");
														return;
													}
													if (bonusMode === "youtube" && !bonus_item.url.trim()) {
														toast.error("Video URL is required");
														return;
													}
													if (bonusMode === "file" && !bonusFile && !editingBonusId) {
														toast.error("Choose a video file to upload");
														return;
													}
													setUploadingBonus(true);
													setBonusCompressRatio(null);
													try {
														const url = bonusMode === "file" && bonusFile ? await uploadLessonVideo(bonusFile, "bonus", setBonusCompressRatio) : bonus_item.url.trim();
														const payload = {
															...bonus_item,
															url,
															sourceType: bonusMode
														};
														if (editingBonusId) {
															await updateBonusLesson(editingBonusId, payload);
															toast.success("Bonus lesson updated");
														} else {
															await addBonusLesson(payload);
															toast.success("Bonus lesson added");
														}
														setBonus_item({
															title: "",
															description: "",
															url: ""
														});
														setBonusFile(null);
														setBonusMode("youtube");
														setEditingBonusId(null);
														queryClient.invalidateQueries({ queryKey: ["bonus-lessons"] });
													} catch (error) {
														toast.error(error instanceof Error ? error.message : "Video upload failed");
													} finally {
														setUploadingBonus(false);
														setBonusCompressRatio(null);
													}
												},
												children: uploadingBonus ? bonusCompressRatio !== null ? `Compressing… ${Math.round(bonusCompressRatio * 100)}%` : "Uploading…" : editingBonusId ? "Save changes" : "Add bonus"
											}), editingBonusId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "pill",
												onClick: () => {
													setBonus_item({
														title: "",
														description: "",
														url: ""
													});
													setBonusFile(null);
													setBonusMode("youtube");
													setEditingBonusId(null);
												},
												children: "Cancel"
											})]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "overflow-hidden rounded-3xl bg-card shadow-card",
								children: [bonusLessons.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "p-8 text-center text-sm text-muted-foreground",
									children: "No bonus lessons yet."
								}), bonusLessons.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border-b border-border p-4 last:border-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-sm font-bold text-foreground",
												children: item.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-xs text-muted-foreground",
												children: item.description
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex shrink-0 gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => {
													setEditingBonusId(item.id);
													setBonus_item(item);
													setBonusMode(item.sourceType === "file" ? "file" : "youtube");
													setBonusFile(null);
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: async () => {
													await deleteBonusLesson(item.id);
													queryClient.invalidateQueries({ queryKey: ["bonus-lessons"] });
													toast.success("Bonus lesson deleted");
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
											})]
										})]
									})
								}, item.id))]
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { AdminPage as component };
