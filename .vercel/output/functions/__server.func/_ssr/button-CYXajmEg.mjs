import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, h as Slot, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { N as GraduationCap } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-CYXajmEg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Logo({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-3", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary shadow-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-6 w-6 text-primary-foreground" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xl font-extrabold tracking-tight text-foreground",
			children: "IEA"
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:border-primary/40 hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",
			hero: "bg-gradient-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_oklch(0.354_0.145_265.6_/_0.4)]",
			soft: "bg-secondary text-secondary-foreground hover:bg-accent"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9",
			pill: "h-10 rounded-full px-6",
			"pill-lg": "h-12 rounded-full px-8 text-base"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { cn as i, Logo as n, buttonVariants as r, Button as t };
