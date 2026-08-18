import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Calendar, BookOpen, Clock, Target, ChevronRight, ChevronLeft } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { addStudyPlan } from "@/lib/db";
import {
  generateStudyPlan,
  type SkillType,
  type StudyPlanConfig,
} from "@/data/studyPlan";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const BAND_OPTIONS = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];
const HOURS_OPTIONS = [1, 2, 3, 4, 5];
const SKILLS: { value: SkillType; label: string }[] = [
  { value: "listening", label: "Listening" },
  { value: "reading", label: "Reading" },
  { value: "writing", label: "Writing" },
  { value: "speaking", label: "Speaking" },
];

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    level: typeof search["level"] === "string" ? (search["level"] as string) : "",
    score: Number(search["score"]) || 0,
  }),
  head: () => ({
    meta: [
      { title: "Create your IEA account" },
      {
        name: "description",
        content: "Register for free and unlock IEA video lessons, practice tests and IELTS mock exams.",
      },
      { property: "og:title", content: "Create your IEA account" },
      {
        property: "og:description",
        content: "Your placement level is saved to your profile automatically.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { level, score } = Route.useSearch();
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"account" | "plan">("account");
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  // Study plan state
  const [planConfig, setPlanConfig] = useState<StudyPlanConfig>({
    targetBand: 6.5,
    examDate: "",
    currentBand: score || 5.0,
    weakSkills: [],
    studyHoursPerDay: 2,
  });

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  async function handleAccountSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setBusy(true);
    try {
      await signUp(parsed.data.name, parsed.data.email, parsed.data.password, level);
      toast.success("Account created! Now set up your study plan.");
      setStep("plan");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  async function handlePlanSubmit() {
    if (!user) return;
    setBusy(true);
    try {
      const plan = generateStudyPlan(planConfig);
      await addStudyPlan({ ...plan, userId: user.uid });
      toast.success("Study plan created! Let's start learning.");
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save study plan");
      navigate({ to: "/dashboard" });
    } finally {
      setBusy(false);
    }
  }

  function toggleWeakSkill(skill: SkillType) {
    setPlanConfig((prev) => ({
      ...prev,
      weakSkills: prev.weakSkills.includes(skill)
        ? prev.weakSkills.filter((s) => s !== skill)
        : [...prev.weakSkills, skill],
    }));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-soft px-5 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mx-auto flex w-fit">
          <Logo />
        </Link>

        <div className="mt-8 rounded-4xl bg-card p-8 shadow-soft">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
              step === "account" ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary",
            )}>
              1
            </div>
            <div className={cn(
              "h-0.5 flex-1 rounded-full",
              step === "plan" ? "bg-primary" : "bg-secondary",
            )} />
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
              step === "plan" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
            )}>
              2
            </div>
          </div>

          {step === "account" ? (
            <>
              <h1 className="text-2xl font-extrabold text-foreground">Create your account</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {level
                  ? `Your placement result (${score}/20) will be saved to your profile.`
                  : "Tip: take the placement test first so we can set your level."}
              </p>

              {level ? (
                <div className="mt-5 rounded-2xl bg-secondary px-5 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Detected level
                  </p>
                  <p className="text-lg font-extrabold text-secondary-foreground">{level}</p>
                </div>
              ) : (
                <Button asChild variant="soft" size="pill" className="mt-5 w-full">
                  <Link to="/test">Take the placement test</Link>
                </Button>
              )}

              <form onSubmit={handleAccountSubmit} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={values.name}
                    maxLength={100}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                    placeholder="Ali Valiyev"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={values.email}
                    maxLength={255}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                    placeholder="you@example.com"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={values.password}
                    maxLength={72}
                    onChange={(e) => setValues({ ...values, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="mt-1.5"
                  />
                </div>
                <Button type="submit" variant="hero" size="pill-lg" className="w-full" disabled={busy}>
                  {busy ? "Creating account..." : "Continue"}
                  {!busy && <ChevronRight className="ml-1 h-4 w-4" />}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-foreground">Set up your study plan</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We'll create a personalized weekly schedule based on your goals.
              </p>

              <div className="mt-6 space-y-5">
                {/* Target Band */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    Target Band Score
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {BAND_OPTIONS.map((band) => (
                      <button
                        key={band}
                        type="button"
                        onClick={() => setPlanConfig((prev) => ({ ...prev, targetBand: band }))}
                        className={cn(
                          "rounded-xl px-3 py-2.5 text-sm font-bold transition-all",
                          planConfig.targetBand === band
                            ? "bg-primary text-primary-foreground shadow-card"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                        )}
                      >
                        {band.toFixed(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Band */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Current Band Score
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {BAND_OPTIONS.map((band) => (
                      <button
                        key={band}
                        type="button"
                        onClick={() => setPlanConfig((prev) => ({ ...prev, currentBand: band }))}
                        className={cn(
                          "rounded-xl px-3 py-2.5 text-sm font-bold transition-all",
                          planConfig.currentBand === band
                            ? "bg-primary text-primary-foreground shadow-card"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                        )}
                      >
                        {band.toFixed(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exam Date */}
                <div>
                  <Label htmlFor="examDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Exam Date (optional)
                  </Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={planConfig.examDate}
                    onChange={(e) => setPlanConfig((prev) => ({ ...prev, examDate: e.target.value }))}
                    className="mt-1.5"
                    min={new Date().toISOString().slice(0, 10)}
                  />
                </div>

                {/* Weak Skills */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Weak Skills (select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {SKILLS.map((skill) => (
                      <button
                        key={skill.value}
                        type="button"
                        onClick={() => toggleWeakSkill(skill.value)}
                        className={cn(
                          "rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                          planConfig.weakSkills.includes(skill.value)
                            ? "bg-primary text-primary-foreground shadow-card"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                        )}
                      >
                        {skill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Study Hours */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Study Hours Per Day
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {HOURS_OPTIONS.map((hours) => (
                      <button
                        key={hours}
                        type="button"
                        onClick={() => setPlanConfig((prev) => ({ ...prev, studyHoursPerDay: hours }))}
                        className={cn(
                          "rounded-xl px-3 py-2.5 text-sm font-bold transition-all",
                          planConfig.studyHoursPerDay === hours
                            ? "bg-primary text-primary-foreground shadow-card"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                        )}
                      >
                        {hours}h
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="soft"
                  size="pill"
                  className="flex-1"
                  onClick={() => setStep("account")}
                  disabled={busy}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="pill-lg"
                  className="flex-[2]"
                  onClick={handlePlanSubmit}
                  disabled={busy}
                >
                  {busy ? "Saving..." : "Start Learning"}
                </Button>
              </div>

              <button
                onClick={() => navigate({ to: "/dashboard" })}
                className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </button>
            </>
          )}

          {step === "account" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Log in
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
