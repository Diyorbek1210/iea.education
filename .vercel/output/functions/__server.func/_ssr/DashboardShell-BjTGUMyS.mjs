import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { d as useRouterState, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useAuth } from "./router-CpIOtHbc.mjs";
import { B as ClipboardCheck, F as Gamepad2, O as LogOut, P as Gift, i as Video, j as LayoutDashboard, n as X, o as Trophy, w as Menu } from "../_libs/lucide-react.mjs";
import { i as cn, n as Logo, t as Button } from "./button-CYXajmEg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DashboardShell-BjTGUMyS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/videos",
		label: "Videos",
		icon: Video
	},
	{
		to: "/bonuses",
		label: "Bonuses",
		icon: Gift
	},
	{
		to: "/games",
		label: "Games",
		icon: Gamepad2
	},
	{
		to: "/mock-test",
		label: "Mock Test",
		icon: ClipboardCheck
	},
	{
		to: "/leaderboard",
		label: "Leaderboard",
		icon: Trophy
	}
];
function DashboardShell({ title, subtitle, children }) {
	const { user, loading, signOut } = useAuth();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/login" });
	}, [
		loading,
		user,
		navigate
	]);
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading your dashboard…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-sidebar-border bg-sidebar p-5 shadow-card transition-transform lg:static lg:translate-x-0 lg:shadow-none", open ? "translate-x-0" : "-translate-x-full"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						onClick: () => setOpen(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-8 space-y-1",
						children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							onClick: () => setOpen(false),
							className: cn("flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors", pathname === item.to ? "bg-gradient-primary text-primary-foreground shadow-card" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), item.label]
						}, item.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 rounded-2xl bg-secondary p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Your level"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-extrabold text-secondary-foreground",
								children: user.level
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [user.videosWatched?.length ?? 0, " lessons watched"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"🔥 ",
									user.streak ?? 0,
									"-day streak"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "pill",
						className: "mt-6 w-full justify-start",
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
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Close menu",
				className: "fixed inset-0 z-40 bg-foreground/30 lg:hidden",
				onClick: () => setOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-5 py-4 backdrop-blur-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded-xl border border-border p-2 lg:hidden",
							onClick: () => setOpen((v) => !v),
							"aria-label": "Toggle sidebar",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "truncate text-lg font-extrabold text-foreground",
								children: title
							}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: subtitle
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto hidden rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-secondary-foreground sm:block",
							children: user.name
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "p-5 lg:p-8",
					children
				})]
			})
		]
	});
}
//#endregion
export { DashboardShell as t };
