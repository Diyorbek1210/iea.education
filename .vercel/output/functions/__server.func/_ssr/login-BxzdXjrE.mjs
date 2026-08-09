import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useAuth } from "./router-CpIOtHbc.mjs";
import { g as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as Logo, t as Button } from "./button-CYXajmEg.mjs";
import { t as Input } from "./input-BZL4ZIgS.mjs";
import { t as Label } from "./label-CGSSyUya.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BxzdXjrE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { signIn } = useAuth();
	const navigate = useNavigate();
	const [values, setValues] = (0, import_react.useState)({
		email: "",
		password: ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function handleSubmit(event) {
		event.preventDefault();
		if (!values.email.trim() || !values.password) {
			toast.error("Enter your email and password");
			return;
		}
		setBusy(true);
		try {
			const { isAdmin } = await signIn(values.email, values.password);
			toast.success(isAdmin ? "Welcome back, admin" : "Welcome back!");
			navigate({ to: isAdmin ? "/admin" : "/dashboard" });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Login failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-screen items-center justify-center bg-gradient-soft px-5 py-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mx-auto flex w-fit",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 rounded-3xl bg-card p-4 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-lg font-extrabold text-foreground",
						children: "Welcome back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Log in to continue where you left off."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "mt-3 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								value: values.email,
								maxLength: 255,
								onChange: (e) => setValues({
									...values,
									email: e.target.value
								}),
								placeholder: "you@example.com",
								className: "mt-1"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "password",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: "password",
								value: values.password,
								maxLength: 72,
								onChange: (e) => setValues({
									...values,
									password: e.target.value
								}),
								placeholder: "Your password",
								className: "mt-1"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "hero",
								size: "pill",
								className: "w-full",
								disabled: busy,
								children: busy ? "Signing in…" : "Log in"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-start gap-2 rounded-xl bg-secondary px-3 py-2 text-xs text-secondary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Administrators are redirected to the Admin Panel automatically after login." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-center text-xs text-muted-foreground",
						children: [
							"No account yet?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/test",
								className: "font-semibold text-primary hover:underline",
								children: "Take the placement test"
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { LoginPage as component };
