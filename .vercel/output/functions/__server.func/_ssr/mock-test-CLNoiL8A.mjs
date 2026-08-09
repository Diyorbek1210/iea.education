import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as listMockResults } from "./db-n4ZYRMBI.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as useAuth } from "./router-CpIOtHbc.mjs";
import { B as ClipboardCheck, H as CircleCheck, V as CirclePlay, k as Lock } from "../_libs/lucide-react.mjs";
import { i as cn, t as Button } from "./button-CYXajmEg.mjs";
import { t as DashboardShell } from "./DashboardShell-BjTGUMyS.mjs";
import { r as mockTests } from "./mockTest-DcSU1hPy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mock-test-CLNoiL8A.js
var import_jsx_runtime = require_jsx_runtime();
function MockTestListPage() {
	const { user } = useAuth();
	const { data: results = [] } = useQuery({
		queryKey: ["mock-results"],
		queryFn: listMockResults
	});
	const completed = new Set(user?.completedMockTests ?? []);
	const myResults = results.filter((r) => r.userId === user?.uid);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShell, {
		title: "IELTS Mock Tests",
		subtitle: "Complete each mock in order to unlock the next",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-3xl space-y-4",
			children: mockTests.map((mock, index) => {
				const isDone = completed.has(mock.id);
				const previous = index > 0 ? mockTests[index - 1] : null;
				const isUnlocked = index === 0 || (previous ? completed.has(previous.id) : true);
				const isLocked = !isDone && !isUnlocked;
				const result = myResults.find((r) => r.mockTestId === mock.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex flex-wrap items-center gap-4 rounded-3xl p-6 shadow-card", isDone ? "bg-gradient-primary" : isLocked ? "bg-secondary opacity-70" : "bg-card"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", isDone ? "bg-primary-foreground/20" : "bg-secondary"),
							children: isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-primary-foreground" }) : isLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "h-5 w-5 text-foreground" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("text-sm font-extrabold", isDone ? "text-primary-foreground" : "text-foreground"),
								children: mock.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("mt-1 text-xs", isDone ? "text-primary-foreground/80" : "text-muted-foreground"),
								children: isDone ? `Completed · Overall band ${result?.overall.toFixed(1) ?? "—"}` : isLocked ? `Complete ${previous?.title} first to unlock` : "Reading · Listening · Writing · Speaking"
							})]
						}),
						!isDone && !isLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "hero",
							size: "pill",
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/mock-test/$mockId",
								params: { mockId: mock.id },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-4 w-4" }), " Start"]
							})
						}),
						isLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "soft",
							size: "pill",
							disabled: true,
							className: "shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), " Locked"]
						})
					]
				}, mock.id);
			})
		})
	});
}
//#endregion
export { MockTestListPage as component };
