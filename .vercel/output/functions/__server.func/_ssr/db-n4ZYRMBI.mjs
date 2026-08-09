import { i as getServerFnById, r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-ihsQcs9K.mjs";
import { a as getApp, o as getApps, s as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import { n as getAuth } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase.mjs";
import { a as orderBy, c as updateDoc, d as doc, f as getFirestore, i as getDocs, l as arrayUnion, n as deleteDoc, o as query, r as getDoc, s as setDoc, t as addDoc, u as collection } from "../_libs/@firebase/firestore+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-n4ZYRMBI.js
var firebaseConfig = {
	apiKey: "AIzaSyCC5TBm4rC7AleakQl92W_yRPaiNoGoV9s",
	authDomain: "salom-4f3bd.firebaseapp.com",
	databaseURL: "https://salom-4f3bd-default-rtdb.firebaseio.com",
	projectId: "salom-4f3bd",
	storageBucket: "salom-4f3bd.firebasestorage.app",
	messagingSenderId: "223747081418",
	appId: "1:223747081418:web:5d1d89c7e00cc1a0b82033",
	measurementId: "G-JYXYC0S8DX"
};
var isFirebaseConfigured = !Object.values(firebaseConfig).some((value) => String(value).startsWith("YOUR_"));
var app = null;
var authInstance = null;
var dbInstance = null;
if (isFirebaseConfigured) {
	app = getApps().length ? getApp() : initializeApp(firebaseConfig);
	authInstance = getAuth(app);
	dbInstance = getFirestore(app);
}
var auth = authInstance;
var db = dbInstance;
var ADMIN_EMAIL = "diyorbekmuzaffarovich4@gmail.com";
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function isDeleteAuthUserInput(data) {
	return typeof data === "object" && data !== null && typeof data.uid === "string" && typeof data.idToken === "string";
}
var deleteAuthUser = createServerFn({ method: "POST" }).validator((data) => {
	if (!isDeleteAuthUserInput(data)) throw new Error("Invalid input: expected { uid: string, idToken: string }");
	return {
		uid: data.uid,
		idToken: data.idToken
	};
}).handler(createSsrRpc("4cd9fd6db330fd332d42575b02c398a3e8b8020671124b61669ccc5d7b97b509"));
var placementQuestions = [
	{
		q: "___ name is Ali.",
		options: [
			"My",
			"Me",
			"I",
			"Mine"
		],
		answer: 0
	},
	{
		q: "She ___ to school every day.",
		options: [
			"go",
			"goes",
			"going",
			"gone"
		],
		answer: 1
	},
	{
		q: "There ___ two books on the table.",
		options: [
			"is",
			"am",
			"are",
			"be"
		],
		answer: 2
	},
	{
		q: "I ___ coffee at the moment.",
		options: [
			"drink",
			"drinks",
			"am drinking",
			"drank"
		],
		answer: 2
	},
	{
		q: "He is taller ___ his brother.",
		options: [
			"then",
			"than",
			"as",
			"of"
		],
		answer: 1
	},
	{
		q: "We ___ to Paris last summer.",
		options: [
			"go",
			"went",
			"gone",
			"have go"
		],
		answer: 1
	},
	{
		q: "I have lived here ___ 2015.",
		options: [
			"for",
			"since",
			"from",
			"during"
		],
		answer: 1
	},
	{
		q: "If it rains, we ___ at home.",
		options: [
			"stay",
			"stayed",
			"will stay",
			"would stay"
		],
		answer: 2
	},
	{
		q: "The letter ___ yesterday.",
		options: [
			"sent",
			"was sent",
			"is sent",
			"sends"
		],
		answer: 1
	},
	{
		q: "She asked me where I ___ from.",
		options: [
			"come",
			"came",
			"coming",
			"comes"
		],
		answer: 1
	},
	{
		q: "Choose the correct word: an ___ decision.",
		options: [
			"economic",
			"economical",
			"economy",
			"economically"
		],
		answer: 0
	},
	{
		q: "I'd rather you ___ smoke here.",
		options: [
			"don't",
			"didn't",
			"not",
			"won't"
		],
		answer: 1
	},
	{
		q: "By next June, he ___ his degree.",
		options: [
			"finishes",
			"will finish",
			"will have finished",
			"finished"
		],
		answer: 2
	},
	{
		q: "It's high time we ___ something about it.",
		options: [
			"do",
			"did",
			"have done",
			"will do"
		],
		answer: 1
	},
	{
		q: "Hardly ___ the door when the phone rang.",
		options: [
			"I had opened",
			"had I opened",
			"I opened",
			"did I open"
		],
		answer: 1
	},
	{
		q: "The report is ___ with errors.",
		options: [
			"riddled",
			"filled up",
			"packed on",
			"loaded in"
		],
		answer: 0
	},
	{
		q: "His argument doesn't ___ water.",
		options: [
			"carry",
			"hold",
			"keep",
			"take"
		],
		answer: 1
	},
	{
		q: "She takes everything he says with a ___ of salt.",
		options: [
			"pinch",
			"spoon",
			"bag",
			"drop"
		],
		answer: 0
	},
	{
		q: "Not only ___ late, but he also forgot the files.",
		options: [
			"he was",
			"was he",
			"he is",
			"is he"
		],
		answer: 1
	},
	{
		q: "The proposal was rejected out of ___.",
		options: [
			"hand",
			"reach",
			"order",
			"place"
		],
		answer: 0
	}
];
function levelFromScore(score) {
	if (score <= 5) return "Beginner";
	if (score <= 10) return "Elementary";
	if (score <= 14) return "Intermediate";
	if (score <= 17) return "Upper-Intermediate";
	return "Advanced";
}
var levelDescription = {
	Beginner: "You're starting from the basics — we'll build your foundation step by step.",
	Elementary: "You know the essentials. Time to grow vocabulary and confidence.",
	Intermediate: "Solid ground. Focus now on accuracy and IELTS exam strategy.",
	"Upper-Intermediate": "Strong English. Targeted practice will push you toward band 7+.",
	Advanced: "Excellent command. Polish precision and exam timing for band 8+."
};
var BADGES = [
	{
		id: "placement-done",
		name: "Level Found",
		description: "Completed the placement test",
		icon: "CheckCircle2",
		criteria: { type: "placementCompleted" }
	},
	{
		id: "streak-3",
		name: "Warming Up",
		description: "3-day streak",
		icon: "Flame",
		criteria: {
			type: "streak",
			days: 3
		}
	},
	{
		id: "streak-7",
		name: "Week Warrior",
		description: "7-day streak",
		icon: "Flame",
		criteria: {
			type: "streak",
			days: 7
		}
	},
	{
		id: "streak-30",
		name: "Unstoppable",
		description: "30-day streak",
		icon: "Flame",
		criteria: {
			type: "streak",
			days: 30
		}
	},
	{
		id: "videos-5",
		name: "Bonus Unlocked",
		description: "Watched 5 video lessons",
		icon: "Gift",
		criteria: {
			type: "videosWatched",
			count: 5
		}
	},
	{
		id: "videos-15",
		name: "Video Scholar",
		description: "Watched 15 video lessons",
		icon: "PlayCircle",
		criteria: {
			type: "videosWatched",
			count: 15
		}
	},
	{
		id: "mock-1",
		name: "First Mock",
		description: "Completed your first mock test",
		icon: "ClipboardCheck",
		criteria: {
			type: "mockTestsTaken",
			count: 1
		}
	},
	{
		id: "mock-5",
		name: "Mock Marathoner",
		description: "Completed 5 mock tests",
		icon: "ClipboardCheck",
		criteria: {
			type: "mockTestsTaken",
			count: 5
		}
	},
	{
		id: "mock-10",
		name: "IELTS Ready",
		description: "Completed all 10 mock tests",
		icon: "Trophy",
		criteria: {
			type: "mockTestsTaken",
			count: 10
		}
	},
	{
		id: "games-10",
		name: "Game On",
		description: "Played 10 games",
		icon: "Gamepad2",
		criteria: {
			type: "gamesPlayed",
			count: 10
		}
	},
	{
		id: "xp-100",
		name: "Rising Star",
		description: "Earned 100 XP",
		icon: "Star",
		criteria: {
			type: "xp",
			amount: 100
		}
	},
	{
		id: "xp-500",
		name: "XP Champion",
		description: "Earned 500 XP",
		icon: "Trophy",
		criteria: {
			type: "xp",
			amount: 500
		}
	}
];
var XP_REWARDS = {
	VIDEO_WATCHED: 10,
	GAME_BASE: 5,
	GAME_SCORE_MULTIPLIER: 2,
	GAME_MAX_BONUS: 20,
	MOCK_TEST_COMPLETED: 50,
	PLACEMENT_TEST_COMPLETED: 15
};
var DAILY_GOAL_PRESETS = [
	10,
	20,
	50
];
var XP_LEVELS = [
	{
		level: 1,
		minXp: 0,
		title: "Newcomer"
	},
	{
		level: 2,
		minXp: 100,
		title: "Learner"
	},
	{
		level: 3,
		minXp: 250,
		title: "Motivated"
	},
	{
		level: 4,
		minXp: 500,
		title: "Dedicated"
	},
	{
		level: 5,
		minXp: 900,
		title: "Fluent Fighter"
	},
	{
		level: 6,
		minXp: 1400,
		title: "Word Warrior"
	},
	{
		level: 7,
		minXp: 2e3,
		title: "Language Master"
	},
	{
		level: 8,
		minXp: 3e3,
		title: "IEA Legend"
	}
];
function computeXpLevel(xp = 0) {
	let current = XP_LEVELS[0];
	for (const def of XP_LEVELS) if (xp >= def.minXp) current = def;
	else break;
	return current;
}
function nextXpLevel(xp = 0) {
	const current = computeXpLevel(xp);
	return XP_LEVELS.find((def) => def.minXp > current.minXp) ?? null;
}
function todayKey(d = /* @__PURE__ */ new Date()) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseDateKey(key) {
	const [y, m, d] = key.split("-").map(Number);
	return new Date(y, m - 1, d);
}
function daysBetween(a, b) {
	return Math.round((parseDateKey(b).getTime() - parseDateKey(a).getTime()) / 864e5);
}
function weekStartKey(today = todayKey()) {
	const d = parseDateKey(today);
	const day = d.getDay();
	d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
	return todayKey(d);
}
function applyStreak(user, today = todayKey()) {
	const last = user.lastActivityDate;
	let streak = user.streak ?? 0;
	let todayXp = user.todayXp ?? 0;
	if (!last) {
		streak = 1;
		todayXp = 0;
	} else {
		const gap = daysBetween(last, today);
		if (gap === 1) {
			streak += 1;
			todayXp = 0;
		} else if (gap > 1) {
			streak = 1;
			todayXp = 0;
		}
	}
	return {
		streak,
		longestStreak: Math.max(user.longestStreak ?? 0, streak),
		todayXp,
		lastActivityDate: today
	};
}
function applyWeeklyReset(user, today = todayKey()) {
	const currentWeekStart = weekStartKey(today);
	return {
		weekStartDate: currentWeekStart,
		weeklyXp: user.weekStartDate === currentWeekStart ? user.weeklyXp ?? 0 : 0
	};
}
function effectiveWeeklyXp(u, today = todayKey()) {
	return u.weekStartDate === weekStartKey(today) ? u.weeklyXp ?? 0 : 0;
}
function xpForActivity(activity, opts) {
	switch (activity) {
		case "video": return XP_REWARDS.VIDEO_WATCHED;
		case "mockTest": return XP_REWARDS.MOCK_TEST_COMPLETED;
		case "placementTest": return XP_REWARDS.PLACEMENT_TEST_COMPLETED;
		case "game": {
			const bonus = Math.min(XP_REWARDS.GAME_MAX_BONUS, (opts?.gameScore ?? 0) * XP_REWARDS.GAME_SCORE_MULTIPLIER);
			return XP_REWARDS.GAME_BASE + bonus;
		}
	}
}
function meetsCriteria(p, b) {
	const c = b.criteria;
	switch (c.type) {
		case "streak": return (p.streak ?? 0) >= c.days;
		case "videosWatched": return (p.videosWatched?.length ?? 0) >= c.count;
		case "mockTestsTaken": return (p.mockResults?.length ?? 0) >= c.count;
		case "gamesPlayed": return (p.gamesPlayed ?? 0) >= c.count;
		case "xp": return (p.xp ?? 0) >= c.amount;
		case "placementCompleted": return !!p.placementCompleted;
	}
}
function evaluateBadges(profile) {
	const unlocked = new Set(profile.badges ?? []);
	return BADGES.filter((b) => !unlocked.has(b.id) && meetsCriteria(profile, b)).map((b) => b.id);
}
function withGamificationDefaults(p) {
	return {
		xp: 0,
		streak: 0,
		longestStreak: 0,
		todayXp: 0,
		weeklyXp: 0,
		weekStartDate: weekStartKey(),
		dailyGoal: 20,
		badges: [],
		gamesPlayed: 0,
		placementCompleted: false,
		...p
	};
}
var KEYS = {
	users: "iea_users",
	videos: "iea_videos",
	mocks: "iea_mock_results",
	bonus: "iea_bonus_lesson",
	placement: "iea_placement_questions"
};
function read(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function write(key, value) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(key, JSON.stringify(value));
}
var seedVideos = [
	{
		id: "v1",
		title: "IELTS Speaking Part 1 — Fluency Basics",
		description: "How to answer personal questions naturally and confidently.",
		url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		thumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=60",
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "v2",
		title: "Listening: Note Completion Strategy",
		description: "Predict answers before the recording starts and never lose your place.",
		url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=60",
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "v3",
		title: "Reading: True / False / Not Given",
		description: "The decision rules that make this question type simple.",
		url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		thumbnail: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=60",
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "v4",
		title: "Writing Task 2 — Essay Structure",
		description: "A repeatable four-paragraph plan for band 7+ essays.",
		url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=60",
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "v5",
		title: "Grammar Reset: Tenses in 20 Minutes",
		description: "Fix the tense mistakes that cost you marks in every skill.",
		url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=60",
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "v6",
		title: "Vocabulary for Describing Graphs",
		description: "Precise language for Writing Task 1 trends and comparisons.",
		url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=60",
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}
];
var defaultBonus = {
	title: "Bonus: Full IELTS Speaking Masterclass",
	description: "Unlocked for learners who completed 5 video lessons. A complete walkthrough of all three Speaking parts with band-9 model answers.",
	url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
};
function localVideos() {
	const existing = read(KEYS.videos, null);
	if (existing && existing.length) return existing;
	write(KEYS.videos, seedVideos);
	return seedVideos;
}
var seedPlacementQuestions = placementQuestions.map((question, index) => ({
	id: `p${index + 1}`,
	...question,
	createdAt: (/* @__PURE__ */ new Date()).toISOString()
}));
function localPlacementQuestions() {
	const existing = read(KEYS.placement, null);
	if (existing && existing.length) return existing;
	write(KEYS.placement, seedPlacementQuestions);
	return seedPlacementQuestions;
}
var CLOUDINARY_CLOUD_NAME = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_CLOUDINARY_CLOUD_NAME": "ltmtjl4i",
	"VITE_CLOUDINARY_UPLOAD_PRESET": "iea-cloude-test"
}["VITE_CLOUDINARY_CLOUD_NAME"];
var CLOUDINARY_UPLOAD_PRESET = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_CLOUDINARY_CLOUD_NAME": "ltmtjl4i",
	"VITE_CLOUDINARY_UPLOAD_PRESET": "iea-cloude-test"
}["VITE_CLOUDINARY_UPLOAD_PRESET"];
/**
* Uploads a video file for a lesson/bonus and returns its playable URL.
* Files over Cloudinary's free-plan cap are compressed in the browser first
* (see videoCompress.ts). `onCompressProgress` receives a 0–1 ratio while
* the browser is transcoding.
*/
async function uploadLessonVideo(file, folder, onCompressProgress) {
	if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) throw new Error("Video upload isn't configured yet. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET — see .env.example.");
	if (file.size > 104857600) {
		const originalMb = Math.round(file.size / 1048576);
		const { compressVideo } = await import("./videoCompress-0WnA7Ay1.mjs");
		file = await compressVideo(file, onCompressProgress);
		if (file.size > 104857600) {
			const mb = Math.round(file.size / 1048576);
			throw new Error(`Video is ${originalMb}MB and still ${mb}MB after compression — the free Cloudinary plan allows up to 100MB per file.`);
		}
	}
	const body = new FormData();
	body.append("file", file);
	body.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
	body.append("folder", folder);
	const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, {
		method: "POST",
		body
	});
	if (!res.ok) {
		if (res.status === 413) throw new Error("The video is too large for Cloudinary's free plan (over 100MB even after compression). Trim it or compress it further before uploading.");
		const message = await res.text().catch(() => res.statusText);
		throw new Error(`Video upload failed: ${message}`);
	}
	return (await res.json()).secure_url;
}
async function listUsers() {
	if (!isFirebaseConfigured || !db) return read(KEYS.users, []).map(withGamificationDefaults);
	return (await getDocs(collection(db, "users"))).docs.map((d) => withGamificationDefaults({
		uid: d.id,
		...d.data()
	}));
}
async function getUserProfile(uid) {
	if (!isFirebaseConfigured || !db) {
		const found = read(KEYS.users, []).find((u) => u.uid === uid) ?? null;
		return found ? withGamificationDefaults(found) : null;
	}
	const snap = await getDoc(doc(db, "users", uid));
	return snap.exists() ? withGamificationDefaults({
		uid,
		...snap.data()
	}) : null;
}
async function createUserProfile(profile) {
	if (!isFirebaseConfigured || !db) {
		const users = read(KEYS.users, []);
		write(KEYS.users, [...users.filter((u) => u.uid !== profile.uid), profile]);
		return;
	}
	const { uid, ...rest } = profile;
	await setDoc(doc(db, "users", uid), rest);
}
async function updateUserProfile(uid, data) {
	if (!isFirebaseConfigured || !db) {
		const users = read(KEYS.users, []);
		write(KEYS.users, users.map((u) => u.uid === uid ? {
			...u,
			...data
		} : u));
		return;
	}
	await updateDoc(doc(db, "users", uid), data);
}
/**
* Deletes a student's Firestore profile AND their Firebase Auth account.
* Auth deletion runs through a server function (the client SDK can only
* delete the current user's own account). Returns whether the Auth account
* was removed too — false means the server key isn't configured, the Auth
* account still exists, and the student could still log in.
*/
async function deleteUserProfile(uid) {
	if (!isFirebaseConfigured || !db) {
		write(KEYS.users, read(KEYS.users, []).filter((u) => u.uid !== uid));
		return true;
	}
	let authDeleted = false;
	const current = auth?.currentUser;
	if (current) try {
		await deleteAuthUser({ data: {
			uid,
			idToken: await current.getIdToken()
		} });
		authDeleted = true;
	} catch (error) {
		console.warn("Firebase Auth account removal failed:", error);
	}
	await deleteDoc(doc(db, "users", uid));
	return authDeleted;
}
async function markVideoWatched(uid, videoId) {
	if (!isFirebaseConfigured || !db) {
		const users = read(KEYS.users, []);
		write(KEYS.users, users.map((u) => u.uid === uid ? {
			...u,
			videosWatched: Array.from(/* @__PURE__ */ new Set([...u.videosWatched ?? [], videoId]))
		} : u));
		return;
	}
	await updateDoc(doc(db, "users", uid), { videosWatched: arrayUnion(videoId) });
}
async function markMockTestCompleted(uid, mockTestId) {
	if (!isFirebaseConfigured || !db) {
		const users = read(KEYS.users, []);
		write(KEYS.users, users.map((u) => u.uid === uid ? {
			...u,
			completedMockTests: Array.from(/* @__PURE__ */ new Set([...u.completedMockTests ?? [], mockTestId]))
		} : u));
		return;
	}
	await updateDoc(doc(db, "users", uid), { completedMockTests: arrayUnion(mockTestId) });
}
async function recordActivity(profile, activity, opts) {
	const today = todayKey();
	const streakPatch = applyStreak(profile, today);
	const weekPatch = applyWeeklyReset(profile, today);
	const xpGained = xpForActivity(activity, opts);
	const merged = {
		...profile,
		...streakPatch,
		...weekPatch,
		xp: (profile.xp ?? 0) + xpGained,
		todayXp: streakPatch.todayXp + xpGained,
		weeklyXp: weekPatch.weeklyXp + xpGained,
		gamesPlayed: (profile.gamesPlayed ?? 0) + (activity === "game" ? 1 : 0),
		placementCompleted: profile.placementCompleted || activity === "placementTest"
	};
	const newBadgeIds = evaluateBadges(merged);
	const patch = {
		xp: merged.xp,
		streak: merged.streak,
		longestStreak: merged.longestStreak,
		lastActivityDate: merged.lastActivityDate,
		todayXp: merged.todayXp,
		weeklyXp: merged.weeklyXp,
		weekStartDate: merged.weekStartDate,
		gamesPlayed: merged.gamesPlayed,
		badges: [...profile.badges ?? [], ...newBadgeIds],
		...activity === "placementTest" ? { placementCompleted: true } : {}
	};
	await updateUserProfile(profile.uid, patch);
	return {
		xpGained,
		newBadges: BADGES.filter((b) => newBadgeIds.includes(b.id))
	};
}
async function setDailyGoal(uid, goalXp) {
	await updateUserProfile(uid, { dailyGoal: goalXp });
}
async function listVideos() {
	if (!isFirebaseConfigured || !db) return localVideos();
	return (await getDocs(query(collection(db, "videos"), orderBy("createdAt", "desc")))).docs.map((d) => ({
		id: d.id,
		...d.data()
	}));
}
async function addVideo(video) {
	const payload = {
		...video,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (!isFirebaseConfigured || !db) {
		write(KEYS.videos, [{
			id: crypto.randomUUID(),
			...payload
		}, ...localVideos()]);
		return;
	}
	await addDoc(collection(db, "videos"), payload);
}
async function deleteVideo(id) {
	if (!isFirebaseConfigured || !db) {
		write(KEYS.videos, localVideos().filter((v) => v.id !== id));
		return;
	}
	await deleteDoc(doc(db, "videos", id));
}
async function listMockResults() {
	if (!isFirebaseConfigured || !db) return read(KEYS.mocks, []);
	return (await getDocs(collection(db, "mockResults"))).docs.map((d) => ({
		id: d.id,
		...d.data()
	}));
}
async function addMockResult(result) {
	if (!isFirebaseConfigured || !db) {
		const id = crypto.randomUUID();
		write(KEYS.mocks, [{
			id,
			...result
		}, ...read(KEYS.mocks, [])]);
		const users = read(KEYS.users, []);
		write(KEYS.users, users.map((u) => u.uid === result.userId ? {
			...u,
			mockResults: [...u.mockResults ?? [], id]
		} : u));
		return;
	}
	const created = await addDoc(collection(db, "mockResults"), result);
	await updateDoc(doc(db, "users", result.userId), { mockResults: arrayUnion(created.id) });
}
async function getBonusLesson() {
	if (!isFirebaseConfigured || !db) return read(KEYS.bonus, defaultBonus);
	const snap = await getDoc(doc(db, "content", "bonusLesson"));
	return snap.exists() ? snap.data() : defaultBonus;
}
var KEYS_BONUS_LESSONS = "iea_bonus_lessons";
function localBonusLessons() {
	const existing = read(KEYS_BONUS_LESSONS, null);
	if (existing && existing.length) return existing;
	return [];
}
async function listBonusLessons() {
	if (!isFirebaseConfigured || !db) return localBonusLessons();
	return (await getDocs(query(collection(db, "bonusLessons"), orderBy("createdAt", "desc")))).docs.map((d) => ({
		id: d.id,
		...d.data()
	}));
}
async function addBonusLesson(lesson) {
	const payload = {
		...lesson,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (!isFirebaseConfigured || !db) {
		write(KEYS_BONUS_LESSONS, [{
			id: crypto.randomUUID(),
			...payload
		}, ...localBonusLessons()]);
		return;
	}
	await addDoc(collection(db, "bonusLessons"), payload);
}
async function updateBonusLesson(id, data) {
	if (!isFirebaseConfigured || !db) {
		write(KEYS_BONUS_LESSONS, localBonusLessons().map((b) => b.id === id ? {
			...b,
			...data
		} : b));
		return;
	}
	await updateDoc(doc(db, "bonusLessons", id), data);
}
async function deleteBonusLesson(id) {
	if (!isFirebaseConfigured || !db) {
		write(KEYS_BONUS_LESSONS, localBonusLessons().filter((b) => b.id !== id));
		return;
	}
	await deleteDoc(doc(db, "bonusLessons", id));
}
async function listPlacementQuestions() {
	if (!isFirebaseConfigured || !db) return localPlacementQuestions();
	const snap = await getDocs(query(collection(db, "placementQuestions"), orderBy("createdAt", "asc")));
	if (snap.empty) {
		await Promise.all(seedPlacementQuestions.map(({ id, ...question }) => setDoc(doc(db, "placementQuestions", id), question)));
		return seedPlacementQuestions;
	}
	return snap.docs.map((d) => ({
		id: d.id,
		...d.data()
	}));
}
async function addPlacementQuestion(question) {
	const payload = {
		...question,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (!isFirebaseConfigured || !db) {
		write(KEYS.placement, [...localPlacementQuestions(), {
			id: crypto.randomUUID(),
			...payload
		}]);
		return;
	}
	await addDoc(collection(db, "placementQuestions"), payload);
}
async function updatePlacementQuestion(id, data) {
	if (!isFirebaseConfigured || !db) {
		write(KEYS.placement, localPlacementQuestions().map((q) => q.id === id ? {
			...q,
			...data
		} : q));
		return;
	}
	await updateDoc(doc(db, "placementQuestions", id), data);
}
async function deletePlacementQuestion(id) {
	if (!isFirebaseConfigured || !db) {
		write(KEYS.placement, localPlacementQuestions().filter((q) => q.id !== id));
		return;
	}
	await deleteDoc(doc(db, "placementQuestions", id));
}
//#endregion
export { recordActivity as A, listMockResults as C, markMockTestCompleted as D, listVideos as E, weekStartKey as F, updateBonusLesson as M, updatePlacementQuestion as N, markVideoWatched as O, uploadLessonVideo as P, listBonusLessons as S, listUsers as T, getBonusLesson as _, addMockResult as a, levelDescription as b, auth as c, createUserProfile as d, deleteBonusLesson as f, effectiveWeeklyXp as g, deleteVideo as h, addBonusLesson as i, setDailyGoal as j, nextXpLevel as k, computeXpLevel as l, deleteUserProfile as m, BADGES as n, addPlacementQuestion as o, deletePlacementQuestion as p, DAILY_GOAL_PRESETS as r, addVideo as s, ADMIN_EMAIL as t, createSsrRpc as u, getUserProfile as v, listPlacementQuestions as w, levelFromScore as x, isFirebaseConfigured as y };
