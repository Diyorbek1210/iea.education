import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Sun,
  Moon,
  Monitor,
  Target,
  Calendar,
  Clock,
  Zap,
  LogOut,
  Pencil,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { listStudyPlans, addStudyPlan, deleteStudyPlan } from "@/lib/db";
import { useTheme } from "@/lib/useTheme";
import { useFontSize } from "@/lib/useFontSize";
import { generateStudyPlan, type SkillType } from "@/data/studyPlan";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings - IEA" },
      { name: "description", content: "Manage your account settings, theme, and study plan." },
    ],
  }),
  component: SettingsPage,
});

const BAND_OPTIONS = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];
const HOUR_OPTIONS = [1, 2, 3, 4, 5];
const SKILLS: SkillType[] = ["listening", "reading", "writing", "speaking"];

function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  const { data: plans = [] } = useQuery({
    queryKey: ["study-plans"],
    queryFn: listStudyPlans,
  });

  const existingPlan = plans.find((p) => p.userId === user?.uid);
  const existingConfig = existingPlan?.config as {
    targetBand?: number;
    currentBand?: number;
    examDate?: string;
    studyHoursPerDay?: number;
    weakSkills?: string[];
  } | undefined;

  const [editingPlan, setEditingPlan] = useState(false);
  const [targetBand, setTargetBand] = useState<number>(existingConfig?.targetBand ?? 6.5);
  const [currentBand, setCurrentBand] = useState<number>(existingConfig?.currentBand ?? 5.0);
  const [examDate, setExamDate] = useState(existingConfig?.examDate ?? "");
  const [weakSkills, setWeakSkills] = useState<string[]>(existingConfig?.weakSkills ?? []);
  const [studyHours, setStudyHours] = useState(existingConfig?.studyHoursPerDay ?? 2);
  const [savingPlan, setSavingPlan] = useState(false);

  function toggleSkill(skill: string) {
    setWeakSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  }

  async function handleSavePlan() {
    if (!user) return;
    setSavingPlan(true);
    try {
      if (existingPlan) {
        await deleteStudyPlan(existingPlan.id);
      }
      const config = {
        targetBand,
        currentBand,
        examDate,
        weakSkills: weakSkills as SkillType[],
        studyHoursPerDay: studyHours,
      };
      const plan = generateStudyPlan(config);
      await addStudyPlan({ ...plan, userId: user.uid });
      queryClient.invalidateQueries({ queryKey: ["study-plans"] });
      toast.success("Study plan saved!");
      setEditingPlan(false);
    } catch {
      toast.error("Failed to save study plan");
    } finally {
      setSavingPlan(false);
    }
  }

  if (!user) return null;

  return (
    <DashboardShell title="Settings" subtitle="Manage your preferences">
      <div className="mx-auto max-w-xl space-y-6">
        {/* Theme */}
        <section className="rounded-3xl bg-card p-6 shadow-card">
          <h3 className="text-sm font-bold text-foreground mb-3">Theme</h3>
          <div className="flex items-center gap-1 rounded-xl bg-secondary p-1">
            {([
              { value: "light" as const, icon: Sun, label: "Light" },
              { value: "dark" as const, icon: Moon, label: "Dark" },
              { value: "system" as const, icon: Monitor, label: "Auto" },
            ]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                  theme === opt.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <opt.icon className="h-3.5 w-3.5" />
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Font Size */}
        <section className="rounded-3xl bg-card p-6 shadow-card">
          <h3 className="text-sm font-bold text-foreground mb-3">Text Size</h3>
          <div className="flex items-center gap-1 rounded-xl bg-secondary p-1">
            {([
              { value: "small" as const, label: "A", size: "11px" },
              { value: "medium" as const, label: "A", size: "13px" },
              { value: "large" as const, label: "A", size: "15px" },
            ]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFontSize(opt.value)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2 text-center font-bold transition-colors",
                  fontSize === opt.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                style={{ fontSize: opt.size }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Study Plan */}
        <section className="rounded-3xl bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground">Study Plan</h3>
            {existingPlan && !editingPlan && (
              <button
                onClick={() => setEditingPlan(true)}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
            )}
          </div>

          {existingPlan && !editingPlan ? (
            <div className="space-y-2.5 rounded-2xl bg-secondary p-4">
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">Target:</span>
                <span className="font-bold text-foreground">Band {existingConfig?.targetBand}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">Current:</span>
                <span className="font-bold text-foreground">Band {existingConfig?.currentBand}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">Hours/day:</span>
                <span className="font-bold text-foreground">{existingConfig?.studyHoursPerDay}h</span>
              </div>
              {existingConfig?.examDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">Exam:</span>
                  <span className="font-bold text-foreground">{existingConfig.examDate}</span>
                </div>
              )}
              {existingConfig?.weakSkills && existingConfig.weakSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {existingConfig.weakSkills.map((s) => (
                    <Badge key={s} variant="secondary" className="capitalize">{s}</Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Target Band */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Target Band Score</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {BAND_OPTIONS.map((band) => (
                    <button
                      key={band}
                      onClick={() => setTargetBand(band)}
                      className={cn(
                        "rounded-xl border-2 px-3 py-2 text-sm font-bold transition-colors",
                        targetBand === band
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-secondary-foreground hover:border-primary/40",
                      )}
                    >
                      {band.toFixed(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Band */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Current Band Score</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {BAND_OPTIONS.map((band) => (
                    <button
                      key={band}
                      onClick={() => setCurrentBand(band)}
                      className={cn(
                        "rounded-xl border-2 px-3 py-2 text-sm font-bold transition-colors",
                        currentBand === band
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-secondary-foreground hover:border-primary/40",
                      )}
                    >
                      {band.toFixed(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exam Date */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Exam Date</p>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                  className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground"
                />
              </div>

              {/* Weak Skills */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Weak Skills</p>
                <div className="grid grid-cols-2 gap-2">
                  {SKILLS.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "rounded-xl border-2 px-4 py-2 text-sm font-bold capitalize transition-colors",
                        weakSkills.includes(skill)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-secondary-foreground hover:border-primary/40",
                      )}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Hours */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Study Hours Per Day</p>
                <div className="flex gap-2">
                  {HOUR_OPTIONS.map((h) => (
                    <button
                      key={h}
                      onClick={() => setStudyHours(h)}
                      className={cn(
                        "flex-1 rounded-xl border-2 px-3 py-2 text-sm font-bold transition-colors",
                        studyHours === h
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-secondary-foreground hover:border-primary/40",
                      )}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="hero" size="pill" className="flex-1" onClick={handleSavePlan} disabled={savingPlan}>
                  {savingPlan ? "Saving..." : "Save Plan"}
                </Button>
                {existingPlan && (
                  <Button variant="ghost" size="pill" onClick={() => setEditingPlan(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Sign Out */}
        <Button
          variant="destructive"
          size="lg"
          className="w-full"
          onClick={async () => {
            await signOut();
            navigate({ to: "/", replace: true });
          }}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </DashboardShell>
  );
}
