import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useAuth, r as Route$3 } from "./router-CpIOtHbc.mjs";
import { n as Logo, t as Button } from "./button-CYXajmEg.mjs";
import { t as Input } from "./input-BZL4ZIgS.mjs";
import { t as Label } from "./label-CGSSyUya.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-C0u5vaPL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	name: stringType().trim().min(2, "Please enter your full name").max(100),
	email: stringType().trim().email("Enter a valid email address").max(255),
	password: stringType().min(6, "Password must be at least 6 characters").max(72)
});
function RegisterPage() {
	const { level, score } = Route$3.useSearch();
	const { signUp, user } = useAuth();
	const navigate = useNavigate();
	const [values, setValues] = (0, import_react.useState)({
		name: "",
		email: "",
		password: ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user) navigate({ to: "/dashboard" });
	}, [user, navigate]);
	async function handleSubmit(event) {
		event.preventDefault();
		const parsed = schema.safeParse(values);
		if (!parsed.success) {
			toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
			return;
		}
		setBusy(true);
		try {
			await signUp(parsed.data.name, parsed.data.email, parsed.data.password, level);
			toast.success("Welcome to IEA!");
			navigate({ to: "/dashboard" });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Registration failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex min-h-screen items-center justify-center bg-gradient-soft px-5 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mx-auto flex w-fit",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-4xl bg-card p-8 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-extrabold text-foreground",
						children: "Create your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: level ? `Your placement result (${score}/20) will be saved to your profile.` : "Tip: take the placement test first so we can set your level."
					}),
					level ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 rounded-2xl bg-secondary px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-primary",
							children: "Detected level"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-extrabold text-secondary-foreground",
							children: level
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "soft",
						size: "pill",
						className: "mt-5 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/test",
							children: "Take the placement test"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "mt-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								children: "Full name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								value: values.name,
								maxLength: 100,
								onChange: (e) => setValues({
									...values,
									name: e.target.value
								}),
								placeholder: "Ali Valiyev",
								className: "mt-1.5"
							})] }),
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
								className: "mt-1.5"
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
								placeholder: "At least 6 characters",
								className: "mt-1.5"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "hero",
								size: "pill-lg",
								className: "w-full",
								disabled: busy,
								children: busy ? "Creating account…" : "Register"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: [
							"Already have an account?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "font-semibold text-primary hover:underline",
								children: "Log in"
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { RegisterPage as component };
