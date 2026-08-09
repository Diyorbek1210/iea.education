import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { R as redirect, _ as createRootRouteWithContext, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as __exportAll } from "./server-ihsQcs9K.mjs";
import { a as signOut, i as signInWithEmailAndPassword, r as onAuthStateChanged, t as createUserWithEmailAndPassword } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase.mjs";
import { A as recordActivity, F as weekStartKey, c as auth, d as createUserProfile, t as ADMIN_EMAIL, v as getUserProfile, y as isFirebaseConfigured } from "./db-n4ZYRMBI.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CpIOtHbc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-LQKXAQxF.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var AuthContext = (0, import_react.createContext)(null);
var SESSION_KEY = "iea_session_uid";
var ADMIN_KEY = "iea_session_admin";
var CRED_KEY = "iea_credentials";
function readCreds() {
	if (typeof window === "undefined") return {};
	try {
		return JSON.parse(window.localStorage.getItem(CRED_KEY) ?? "{}");
	} catch {
		return {};
	}
}
function writeCreds(creds) {
	window.localStorage.setItem(CRED_KEY, JSON.stringify(creds));
}
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const loadProfile = (0, import_react.useCallback)(async (uid) => {
		const profile = await getUserProfile(uid);
		setUser(profile);
	}, []);
	(0, import_react.useEffect)(() => {
		let active = true;
		if (isFirebaseConfigured && auth) {
			const unsub = onAuthStateChanged(auth, async (fbUser) => {
				if (!active) return;
				if (fbUser) {
					setIsAdmin(fbUser.email === ADMIN_EMAIL);
					await loadProfile(fbUser.uid);
				} else {
					setUser(null);
					setIsAdmin(false);
				}
				setLoading(false);
			});
			return () => {
				active = false;
				unsub();
			};
		}
		const uid = window.localStorage.getItem(SESSION_KEY);
		const admin = window.localStorage.getItem(ADMIN_KEY) === "true";
		setIsAdmin(admin);
		if (uid) loadProfile(uid).finally(() => setLoading(false));
		else setLoading(false);
		return () => {
			active = false;
		};
	}, [loadProfile]);
	const signUp = (0, import_react.useCallback)(async (name, email, password, level) => {
		let uid;
		if (isFirebaseConfigured && auth) uid = (await createUserWithEmailAndPassword(auth, email, password)).user.uid;
		else {
			const creds = readCreds();
			if (creds[email.toLowerCase()]) throw new Error("This email is already registered.");
			uid = crypto.randomUUID();
			creds[email.toLowerCase()] = {
				uid,
				password
			};
			writeCreds(creds);
			window.localStorage.setItem(SESSION_KEY, uid);
			window.localStorage.setItem(ADMIN_KEY, "false");
		}
		const placementCompleted = Boolean(level);
		const profile = {
			uid,
			name,
			email,
			level: level || "Beginner",
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			videosWatched: [],
			mockResults: [],
			xp: 0,
			streak: 0,
			longestStreak: 0,
			todayXp: 0,
			weeklyXp: 0,
			weekStartDate: weekStartKey(),
			dailyGoal: 20,
			badges: [],
			gamesPlayed: 0,
			placementCompleted: false
		};
		await createUserProfile(profile);
		let finalProfile = profile;
		if (placementCompleted) {
			await recordActivity(profile, "placementTest");
			finalProfile = await getUserProfile(uid) ?? profile;
		}
		setUser(finalProfile);
		setIsAdmin(email === ADMIN_EMAIL);
	}, []);
	const signIn = (0, import_react.useCallback)(async (email, password) => {
		const admin = email.trim().toLowerCase() === "diyorbekmuzaffarovich4@gmail.com" && password === "admin123";
		if (isFirebaseConfigured && auth) {
			if (admin) {
				try {
					await signInWithEmailAndPassword(auth, email, password);
				} catch {}
				setIsAdmin(true);
				window.localStorage.setItem(ADMIN_KEY, "true");
				return { isAdmin: true };
			}
			const cred = await signInWithEmailAndPassword(auth, email, password);
			await loadProfile(cred.user.uid);
			setIsAdmin(false);
			return { isAdmin: false };
		}
		if (admin) {
			setIsAdmin(true);
			window.localStorage.setItem(ADMIN_KEY, "true");
			return { isAdmin: true };
		}
		const entry = readCreds()[email.trim().toLowerCase()];
		if (!entry || entry.password !== password) throw new Error("Incorrect email or password.");
		window.localStorage.setItem(SESSION_KEY, entry.uid);
		window.localStorage.setItem(ADMIN_KEY, "false");
		setIsAdmin(false);
		await loadProfile(entry.uid);
		return { isAdmin: false };
	}, [loadProfile]);
	const signOut$1 = (0, import_react.useCallback)(async () => {
		if (isFirebaseConfigured && auth) await signOut(auth);
		window.localStorage.removeItem(SESSION_KEY);
		window.localStorage.removeItem(ADMIN_KEY);
		setUser(null);
		setIsAdmin(false);
	}, []);
	const refresh = (0, import_react.useCallback)(async () => {
		if (user) await loadProfile(user.uid);
	}, [user, loadProfile]);
	const value = (0, import_react.useMemo)(() => ({
		user,
		isAdmin,
		loading,
		signUp,
		signIn,
		signOut: signOut$1,
		refresh
	}), [
		user,
		isAdmin,
		loading,
		signUp,
		signIn,
		signOut$1,
		refresh
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$13 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "description",
				content: "Lovable Generated Project"
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Lovable App"
			},
			{
				property: "og:description",
				content: "Lovable Generated Project"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$13.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-center",
			richColors: true
		})] })
	});
}
var $$splitComponentImporter$11 = () => import("./routes-DOQ8gV_Z.mjs");
var Route$12 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "IEA — Free IELTS & English Access" },
		{
			name: "description",
			content: "Free IELTS and English learning platform: placement test, video lessons, games, full mock exams and a live leaderboard."
		},
		{
			property: "og:title",
			content: "IEA — Free IELTS & English Access"
		},
		{
			property: "og:description",
			content: "Take a 20-question placement test, then learn with video lessons, games and full IELTS mock exams."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./admin-8ZwcfI9k.mjs");
var Route$11 = createFileRoute("/admin")({
	head: () => ({ meta: [
		{ title: "Admin Panel — IEA" },
		{
			name: "description",
			content: "Manage IEA students, video lessons and bonus content."
		},
		{
			name: "robots",
			content: "noindex"
		},
		{
			property: "og:title",
			content: "Admin Panel — IEA"
		},
		{
			property: "og:description",
			content: "Internal management area for IEA administrators."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./bonuses-CylBcgoU.mjs");
var Route$10 = createFileRoute("/bonuses")({
	head: () => ({ meta: [
		{ title: "Bonus lessons — IEA Dashboard" },
		{
			name: "description",
			content: "Access your unlocked bonus IELTS lessons and exclusive content."
		},
		{
			property: "og:title",
			content: "Bonus lessons — IEA Dashboard"
		},
		{
			property: "og:description",
			content: "Your exclusive bonus lessons library."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./dashboard-DgUzLlau.mjs");
var Route$9 = createFileRoute("/dashboard")({
	head: () => ({ meta: [
		{ title: "Dashboard — IEA" },
		{
			name: "description",
			content: "Track your streak, XP, daily goal, mock test progress and unlocked badges."
		},
		{
			property: "og:title",
			content: "Dashboard — IEA"
		},
		{
			property: "og:description",
			content: "Your learning progress at a glance."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./games-Ci6GxDar.mjs");
var Route$8 = createFileRoute("/games")({
	head: () => ({ meta: [
		{ title: "English games — IEA" },
		{
			name: "description",
			content: "Play vocabulary rush, word rescue and unscramble games to grow your English."
		},
		{
			property: "og:title",
			content: "English games — IEA"
		},
		{
			property: "og:description",
			content: "Three quick games that make vocabulary stick."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./leaderboard-BdUb2MDR.mjs");
var Route$7 = createFileRoute("/leaderboard")({
	head: () => ({ meta: [
		{ title: "Leaderboard — IEA" },
		{
			name: "description",
			content: "See the top IEA learners ranked by weekly XP or best IELTS mock band score."
		},
		{
			property: "og:title",
			content: "Leaderboard — IEA"
		},
		{
			property: "og:description",
			content: "Compete with other IEA students for the top spot."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./login-BxzdXjrE.mjs");
var Route$6 = createFileRoute("/login")({
	head: () => ({ meta: [
		{ title: "Log in — IEA" },
		{
			name: "description",
			content: "Sign in to your IEA account to continue your IELTS and English lessons."
		},
		{
			property: "og:title",
			content: "Log in — IEA"
		},
		{
			property: "og:description",
			content: "Access your IEA dashboard, mocks and leaderboard."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./mock-test-CLNoiL8A.mjs");
var Route$5 = createFileRoute("/mock-test")({
	head: () => ({ meta: [
		{ title: "IELTS Mock Tests — IEA" },
		{
			name: "description",
			content: "Ten full IELTS mock tests — complete them in order to track your progress."
		},
		{
			property: "og:title",
			content: "IELTS Mock Tests — IEA"
		},
		{
			property: "og:description",
			content: "Complete mock tests in order and track your band scores."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var Route$4 = createFileRoute("/profile")({ beforeLoad: () => {
	throw redirect({ to: "/dashboard" });
} });
var $$splitComponentImporter$3 = () => import("./register-C0u5vaPL.mjs");
var Route$3 = createFileRoute("/register")({
	validateSearch: (search) => ({
		level: typeof search["level"] === "string" ? search["level"] : "",
		score: Number(search["score"]) || 0
	}),
	head: () => ({ meta: [
		{ title: "Create your IEA account" },
		{
			name: "description",
			content: "Register for free and unlock IEA video lessons, games and IELTS mock exams."
		},
		{
			property: "og:title",
			content: "Create your IEA account"
		},
		{
			property: "og:description",
			content: "Your placement level is saved to your profile automatically."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./test-BWR-TCFz.mjs");
var Route$2 = createFileRoute("/test")({
	head: () => ({ meta: [
		{ title: "Placement Test — IEA" },
		{
			name: "description",
			content: "Answer 20 questions and get your English level instantly, from Beginner to Advanced."
		},
		{
			property: "og:title",
			content: "Placement Test — IEA"
		},
		{
			property: "og:description",
			content: "A quick 20-question test that defines your English level before you register."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./videos-IB_fVrWo.mjs");
var Route$1 = createFileRoute("/videos")({
	head: () => ({ meta: [
		{ title: "Video lessons — IEA Dashboard" },
		{
			name: "description",
			content: "Watch IEA video lessons, track what you've completed and unlock bonus content."
		},
		{
			property: "og:title",
			content: "Video lessons — IEA"
		},
		{
			property: "og:description",
			content: "Your personal IELTS and English lesson library."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./mock-test_._mockId-DB2JgN7U.mjs");
var Route = createFileRoute("/mock-test_/$mockId")({
	head: () => ({ meta: [{ title: "IELTS Mock Test — IEA" }, {
		name: "description",
		content: "Take a full IELTS mock covering Listening, Reading, Writing and Speaking, and get an estimated band score."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
/** Loose comparison for typed answers: ignores case, punctuation, currency signs and extra spaces. */
/** Official IELTS band descriptor, so the number reads as a level, not just a score. */
/** Cambridge IELTS to CEFR alignment (approximate). */
/** The detailed examiner breakdown for one skill (inside the collapsible block). */
var rootRouteChildren = {
	IndexRoute: Route$12.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$13
	}),
	AdminRoute: Route$11.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$13
	}),
	BonusesRoute: Route$10.update({
		id: "/bonuses",
		path: "/bonuses",
		getParentRoute: () => Route$13
	}),
	DashboardRoute: Route$9.update({
		id: "/dashboard",
		path: "/dashboard",
		getParentRoute: () => Route$13
	}),
	GamesRoute: Route$8.update({
		id: "/games",
		path: "/games",
		getParentRoute: () => Route$13
	}),
	LeaderboardRoute: Route$7.update({
		id: "/leaderboard",
		path: "/leaderboard",
		getParentRoute: () => Route$13
	}),
	LoginRoute: Route$6.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$13
	}),
	MockTestRoute: Route$5.update({
		id: "/mock-test",
		path: "/mock-test",
		getParentRoute: () => Route$13
	}),
	ProfileRoute: Route$4.update({
		id: "/profile",
		path: "/profile",
		getParentRoute: () => Route$13
	}),
	RegisterRoute: Route$3.update({
		id: "/register",
		path: "/register",
		getParentRoute: () => Route$13
	}),
	TestRoute: Route$2.update({
		id: "/test",
		path: "/test",
		getParentRoute: () => Route$13
	}),
	VideosRoute: Route$1.update({
		id: "/videos",
		path: "/videos",
		getParentRoute: () => Route$13
	}),
	MockTestMockIdRoute: Route.update({
		id: "/mock-test_/$mockId",
		path: "/mock-test/$mockId",
		getParentRoute: () => Route$13
	})
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { useAuth as i, Route as n, Route$3 as r, router_exports as t };
