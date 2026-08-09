import { o as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useAuth } from "./router-CpIOtHbc.mjs";
import { C as Mic, D as Mail, E as MapPin, G as BookOpen, K as BookMarked, L as Earth, M as Headphones, S as PenLine, _ as Send, a as Users, b as Phone, f as Target, h as Sparkles, n as X, o as Trophy, p as Star, q as ArrowRight, w as Menu, y as Quote } from "../_libs/lucide-react.mjs";
import { n as Logo, t as Button } from "./button-CYXajmEg.mjs";
import { t as Input } from "./input-BZL4ZIgS.mjs";
import { t as Label } from "./label-CGSSyUya.mjs";
import { t as Textarea } from "./textarea-Bagx0Mq7.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DOQ8gV_Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var points = [
	{
		icon: BookOpen,
		title: "Structured lessons",
		text: "Every video is mapped to a skill and a level, so you always know what to study next."
	},
	{
		icon: Target,
		title: "Placement first",
		text: "A 20-question test defines your level before you register — no guesswork."
	},
	{
		icon: Trophy,
		title: "Real mock exams",
		text: "Full Listening, Reading, Writing and Speaking mocks with instant band estimates."
	},
	{
		icon: Earth,
		title: "Open to everyone",
		text: "Free access for every learner, anywhere. Ambition is the only requirement."
	}
];
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "about",
		className: "mx-auto max-w-7xl px-5 py-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-[0.2em] text-primary",
					children: "About IEA"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-3xl font-extrabold text-foreground sm:text-4xl",
					children: "An English academy that fits into your day"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted-foreground",
					children: "IEA — IELTS & English Access — is a free learning platform built for students who want measurable progress. Learn at your pace, test yourself often, and see exactly how far you've come."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
			children: points.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-card p-6 shadow-card transition-transform hover:-translate-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-11 w-11 items-center justify-center rounded-xl bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(point.icon, { className: "h-5 w-5 text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-base font-bold text-foreground",
						children: point.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted-foreground",
						children: point.text
					})
				]
			}, point.title))
		})]
	});
}
var schema = objectType({
	name: stringType().trim().min(1, "Please enter your name").max(100),
	email: stringType().trim().email("Enter a valid email address").max(255),
	message: stringType().trim().min(5, "Message is too short").max(1e3)
});
var details = [
	{
		icon: Mail,
		label: "Email",
		value: "hello@iea-academy.uz"
	},
	{
		icon: Phone,
		label: "Phone",
		value: "+998 90 000 00 00"
	},
	{
		icon: MapPin,
		label: "Location",
		value: "Tashkent, Uzbekistan (online worldwide)"
	}
];
function Contact() {
	const [values, setValues] = (0, import_react.useState)({
		name: "",
		email: "",
		message: ""
	});
	function handleSubmit(event) {
		event.preventDefault();
		const parsed = schema.safeParse(values);
		if (!parsed.success) {
			toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
			return;
		}
		toast.success("Thanks! We'll get back to you shortly.");
		setValues({
			name: "",
			email: "",
			message: ""
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "contact",
		className: "mx-auto max-w-7xl px-5 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-10 rounded-4xl bg-card p-8 shadow-soft lg:grid-cols-2 lg:p-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-[0.2em] text-primary",
					children: "Contact"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-3xl font-extrabold text-foreground sm:text-4xl",
					children: "Questions before you start?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted-foreground",
					children: "Write to us and the IEA team will answer within one working day. Or skip ahead — take the placement test and start learning right now."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 space-y-4",
					children: details.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-10 w-10 items-center justify-center rounded-xl bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4 text-primary" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-foreground",
							children: item.value
						})] })]
					}, item.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "hero",
					size: "pill",
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/test",
						children: "Start placement test"
					})
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4 rounded-3xl bg-secondary/60 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "c-name",
						children: "Full name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "c-name",
						value: values.name,
						maxLength: 100,
						onChange: (e) => setValues({
							...values,
							name: e.target.value
						}),
						placeholder: "Your name",
						className: "mt-1.5 bg-background"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "c-email",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "c-email",
						type: "email",
						value: values.email,
						maxLength: 255,
						onChange: (e) => setValues({
							...values,
							email: e.target.value
						}),
						placeholder: "you@example.com",
						className: "mt-1.5 bg-background"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "c-message",
						children: "Message"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "c-message",
						rows: 5,
						value: values.message,
						maxLength: 1e3,
						onChange: (e) => setValues({
							...values,
							message: e.target.value
						}),
						placeholder: "How can we help?",
						className: "mt-1.5 bg-background"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						variant: "hero",
						size: "pill",
						className: "w-full",
						children: ["Send message ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })]
					})
				]
			})]
		})
	});
}
var courses = [
	{
		icon: Mic,
		title: "IELTS Speaking",
		text: "Fluency drills, part 1–3 strategies and pronunciation feedback loops.",
		tag: "All levels"
	},
	{
		icon: Headphones,
		title: "IELTS Listening",
		text: "Prediction techniques, accents training and section-by-section practice.",
		tag: "Band 5–8"
	},
	{
		icon: BookMarked,
		title: "IELTS Reading",
		text: "Skimming, scanning and question-type rules for academic passages.",
		tag: "Band 5–8"
	},
	{
		icon: PenLine,
		title: "IELTS Writing",
		text: "Task 1 data language and Task 2 essay frameworks with model answers.",
		tag: "Band 6+"
	},
	{
		icon: Sparkles,
		title: "General English",
		text: "Grammar, everyday vocabulary and speaking confidence from zero upward.",
		tag: "A1–C1"
	}
];
function Courses() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "courses",
		className: "bg-card/60 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold uppercase tracking-[0.2em] text-primary",
							children: "Courses"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 text-3xl font-extrabold text-foreground sm:text-4xl",
							children: "Choose your track"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-muted-foreground",
							children: "Five learning paths, one platform. Take the placement test and we'll recommend where to start."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "hero",
					size: "pill",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/test",
						children: "Take the placement test"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3",
				children: courses.map((course) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "group rounded-2xl bg-background p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(course.icon, { className: "h-5 w-5 text-primary-foreground" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-foreground",
								children: course.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-secondary-foreground",
								children: course.tag
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: course.text
						})
					]
				}, course.title))
			})]
		})
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground",
						children: "IEA gives free, structured access to IELTS preparation and general English for learners at every level."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold text-foreground",
					children: "Platform"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/test",
							className: "hover:text-primary",
							children: "Placement test"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							search: {
								level: "",
								score: 0
							},
							className: "hover:text-primary",
							children: "Register"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "hover:text-primary",
							children: "Log in"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold text-foreground",
					children: "Explore"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#courses",
							className: "hover:text-primary",
							children: "Courses"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#teachers",
							className: "hover:text-primary",
							children: "Teachers"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#contact",
							className: "hover:text-primary",
							children: "Contact"
						}) })
					]
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-border py-5 text-center text-xs text-muted-foreground",
			children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" IEA — IELTS & English Access. Learning Today, Leading Tomorrow."
			]
		})]
	});
}
var hero_student_default = "/assets/hero-student-8OjfCtGS.jpg";
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "home",
		className: "relative overflow-hidden bg-gradient-soft",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:py-28",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-1.5 text-xs font-semibold text-primary shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), "100% free learning platform"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-6 text-4xl font-extrabold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl",
					children: [
						"Free ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gradient-primary",
							children: "IELTS & English"
						}),
						" Access"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg",
					children: "Learn English from zero or push your band score higher — with video lessons, interactive games, full mock exams and a live leaderboard. Start with a quick placement test and we'll build the path for you."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "hero",
						size: "pill-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/test",
							children: ["Join Now ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "pill-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#courses",
							children: "Explore Courses"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-10 flex flex-wrap gap-8",
					children: [
						["3000+", "Active learners"],
						["120+", "Video lessons"],
						["7.5", "Average band"]
					].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-2xl font-extrabold text-foreground",
						children: value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
						children: label
					})] }, label))
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-4xl bg-card p-6 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: hero_student_default,
							alt: "Student learning English with IEA",
							width: 1024,
							height: 1024,
							className: "mt-6 aspect-[4/3] w-full rounded-3xl object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center gap-3 rounded-2xl bg-secondary px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-primary-foreground" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-secondary-foreground",
								children: "Trusted by 3000+ learners"
							})]
						})
					]
				})
			})]
		})
	});
}
var links = [
	{
		label: "Home",
		href: "#home"
	},
	{
		label: "About",
		href: "#about"
	},
	{
		label: "Courses",
		href: "#courses"
	},
	{
		label: "Teachers",
		href: "#teachers"
	},
	{
		label: "Testimonials",
		href: "#testimonials"
	},
	{
		label: "Contact",
		href: "#contact"
	}
];
function Navbar() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const { user, isAdmin } = useAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					"aria-label": "IEA home",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "hidden items-center gap-7 lg:flex",
					children: links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: link.href,
						className: "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
						children: link.label
					}) }, link.href))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden items-center gap-2 lg:flex",
					children: user || isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "hero",
						size: "pill",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: isAdmin ? "/admin" : "/dashboard",
							children: isAdmin ? "Admin Panel" : "My Dashboard"
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "pill",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: "Log in"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "hero",
						size: "pill",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/test",
							children: "Join Now"
						})
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setOpen((v) => !v),
					className: "rounded-xl border border-border p-2 lg:hidden",
					"aria-label": "Toggle menu",
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-border bg-card px-5 py-4 lg:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: link.href,
					onClick: () => setOpen(false),
					className: "block text-sm font-medium text-muted-foreground",
					children: link.label
				}) }, link.href))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "pill",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						children: "Log in"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "hero",
					size: "pill",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/test",
						children: "Join Now"
					})
				})]
			})]
		})]
	});
}
var teachers = [
	{
		name: "Diyorbek M.",
		role: "Founder & IELTS Coach",
		band: "Band 8.5",
		bio: "Speaking and Writing specialist. Trained 1200+ students for the academic exam.",
		initials: "DM"
	},
	{
		name: "Nilufar A.",
		role: "Listening & Reading Lead",
		band: "Band 8.0",
		bio: "Builds exam strategy systems that turn practice hours into predictable scores.",
		initials: "NA"
	},
	{
		name: "Sardor K.",
		role: "General English Tutor",
		band: "CELTA",
		bio: "Takes absolute beginners to confident conversation in a single course cycle.",
		initials: "SK"
	},
	{
		name: "Emma R.",
		role: "Native Speaking Partner",
		band: "Native",
		bio: "Weekly speaking clubs, pronunciation clinics and real-life fluency practice.",
		initials: "ER"
	}
];
function Teachers() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "teachers",
		className: "mx-auto max-w-7xl px-5 py-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-bold uppercase tracking-[0.2em] text-primary",
				children: "Teachers"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 text-3xl font-extrabold text-foreground sm:text-4xl",
				children: "Learn from examiners & coaches"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
			children: teachers.map((teacher) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl bg-card p-7 text-center shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-lg font-extrabold text-primary-foreground",
						children: teacher.initials
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-base font-bold text-foreground",
						children: teacher.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-primary",
						children: teacher.role
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-3 inline-block rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-secondary-foreground",
						children: teacher.band
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: teacher.bio
					})
				]
			}, teacher.name))
		})]
	});
}
var testimonials = [
	{
		name: "Aziza T.",
		result: "Band 5.5 → 7.5",
		text: "The placement test put me in the right track immediately. Four months later I got the band I needed for my visa."
	},
	{
		name: "Jasur B.",
		result: "Beginner → B1",
		text: "I started with zero grammar. The games made vocabulary stick, and the videos never felt boring."
	},
	{
		name: "Malika S.",
		result: "Band 6.0 → 8.0",
		text: "Full mock tests every week and honest feedback. The leaderboard kept me competitive with myself."
	}
];
function Testimonials() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "testimonials",
		className: "bg-card/60 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-[0.2em] text-primary",
					children: "Testimonials"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 text-3xl font-extrabold text-foreground sm:text-4xl",
					children: "Results our learners talk about"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-5 md:grid-cols-3",
				children: testimonials.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "rounded-2xl bg-background p-7 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: "h-7 w-7 text-primary/30" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
							className: "mt-4 text-sm leading-relaxed text-foreground",
							children: [
								"“",
								item.text,
								"”"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "mt-6 flex items-center justify-between border-t border-border pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-foreground",
								children: item.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-primary",
								children: item.result
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-0.5",
								children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-warning text-warning" }, i))
							})]
						})
					]
				}, item.name))
			})]
		})
	});
}
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(About, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Courses, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Teachers, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Testimonials, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { Index as component };
