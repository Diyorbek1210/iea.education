import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Calendar,
  Target,
  Clock,
  BookOpen,
  Headphones,
  PenLine,
  Mic,
  Flame,
  ChevronRight,
  Plus,
  Trash2,
  Trophy,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { listMockResults } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import {
  generateStudyPlan,
  daysUntilExam,
  type StudyPlanConfig,
  type SkillType,
  type StudyPlan,
  DAY_LABELS,
} from "@/data/studyPlan";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/study-plan")({
  head: () => ({
    meta: [
      { title: "Study Plan — IEA" },
      { name: "description", content: "Personalized IELTS study plan with daily schedules." },
    ],
  }),
  component: StudyPlanPage,
});

const SKILL_ICONS: Record<SkillType, typeof BookOpen> = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenLine,
  speaking: Mic,
};

const SKILL_COLORS: Record<SkillType, string> = {
  listening: "text-blue-500",
  reading: "text-green-500",
  writing: "text-orange-500",
  speaking: "text-purple-500",
};

function StudyPlanPage() {
  const { user } = useAuth();
  const { data: mockResults = [] } = useQuery({
    queryKey: ["mock-results"],
    queryFn: listMockResults,
  });

  const [showForm, setShowForm] = useState(false);
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [activePlan, setActivePlan] = useState<StudyPlan | null>(null);

  const [config, setConfig] = useState<StudyPlanConfig>({
    targetBand: 7,
    examDate: "",
    currentBand: 5,
    weakSkills: [],
    studyHoursPerDay: 2,
  });

  // Estimate current band from mock results
  const myResults = mockResults.filter((r) => r.userId === user?.uid);
  const estimatedBand = myResults.length > 0
    ? myResults.reduce((sum, r) => sum + r.overall, 0) / myResults.length
    : 5;

  const handleGenerate = () => {
    const plan = generateStudyPlan(config);
    setPlans((prev) => [...prev, plan]);
    setActivePlan(plan);
    setShowForm(false);
  };

  const toggleWeakSkill = (skill: SkillType) => {
    setConfig((prev) => ({
      ...prev,
      weakSkills: prev.weakSkills.includes(skill)
        ? prev.weakSkills.filter((s) => s !== skill)
        : [...prev.weakSkills, skill],
    }));
  };

  const daysLeft = config.examDate ? daysUntilExam(config.examDate) : null;

  return (
    <DashboardShell title="Study Plan" subtitle="Personalized daily IELTS study schedule">
      <div className="space-y-6">
        {/* Stats */}
        {activePlan && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-card p-4 shadow-card">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Target Band</p>
              <p className="mt-1 text-2xl font-extrabold text-primary">{activePlan.config.targetBand}</p>
            </div>
            <div className="rounded-2xl bg-card p-4 shadow-card">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Study Hours/Day</p>
              <p className="mt-1 text-2xl font-extrabold text-foreground">{activePlan.config.studyHoursPerDay}h</p>
            </div>
            <div className="rounded-2xl bg-card p-4 shadow-card">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Days Until Exam</p>
              <p className="mt-1 text-2xl font-extrabold text-foreground">{daysLeft ?? "—"}</p>
            </div>
          </div>
        )}

        {/* Create / View Toggle */}
        <div className="flex gap-3">
          <Button
            variant={!showForm ? "hero" : "soft"}
            size="pill"
            onClick={() => setShowForm(false)}
          >
            <Calendar className="mr-2 h-4 w-4" /> My Plan
          </Button>
          <Button
            variant={showForm ? "hero" : "soft"}
            size="pill"
            onClick={() => setShowForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Plan
          </Button>
        </div>

        {showForm ? (
          /* Create Plan Form */
          <div className="rounded-3xl bg-card p-6 shadow-card space-y-6">
            <h3 className="text-lg font-extrabold text-foreground">Create Your Study Plan</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-foreground">Current Band Score</label>
                <input
                  type="number"
                  min={1}
                  max={9}
                  step={0.5}
                  value={config.currentBand}
                  onChange={(e) => setConfig((p) => ({ ...p, currentBand: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Target Band Score</label>
                <input
                  type="number"
                  min={1}
                  max={9}
                  step={0.5}
                  value={config.targetBand}
                  onChange={(e) => setConfig((p) => ({ ...p, targetBand: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Exam Date</label>
                <input
                  type="date"
                  value={config.examDate}
                  onChange={(e) => setConfig((p) => ({ ...p, examDate: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Study Hours per Day</label>
                <input
                  type="number"
                  min={0.5}
                  max={8}
                  step={0.5}
                  value={config.studyHoursPerDay}
                  onChange={(e) => setConfig((p) => ({ ...p, studyHoursPerDay: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                />
              </div>
            </div>

            {/* Weak Skills */}
            <div>
              <label className="text-sm font-semibold text-foreground">Weak Skills (prioritized in plan)</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["listening", "reading", "writing", "speaking"] as SkillType[]).map((skill) => {
                  const Icon = SKILL_ICONS[skill];
                  const isActive = config.weakSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleWeakSkill(skill)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-semibold capitalize transition-all",
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button onClick={handleGenerate} variant="hero" size="pill">
              <Target className="mr-2 h-4 w-4" /> Generate Plan
            </Button>
          </div>
        ) : activePlan ? (
          /* Active Plan Display */
          <div className="space-y-4">
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-foreground">Weekly Schedule</h3>
                  <p className="text-sm text-muted-foreground">
                    Week {activePlan.weekNumber} • {activePlan.config.studyHoursPerDay}h/day
                  </p>
                </div>
                <Badge className="bg-gradient-primary text-primary-foreground">
                  <Trophy className="mr-1 h-3 w-3" /> Target: {activePlan.config.targetBand}
                </Badge>
              </div>
            </div>

            {activePlan.weekSchedule.map((day) => (
              <div key={day.day} className="rounded-3xl bg-card p-5 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-extrabold text-primary">
                      {DAY_LABELS[day.day]}
                    </div>
                    <div>
                      <p className="font-bold text-foreground capitalize">{day.day}</p>
                      <p className="text-xs text-muted-foreground">{day.totalMinutes} min • {day.tasks.length} tasks</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">{day.focusSkill}</Badge>
                </div>

                <div className="space-y-2">
                  {day.tasks.map((task) => {
                    const Icon = SKILL_ICONS[task.skill];
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 rounded-xl border border-border p-3"
                      >
                        <Icon className={cn("h-4 w-4 shrink-0", SKILL_COLORS[task.skill])} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground">{task.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="secondary" className="text-[10px]">{task.durationMinutes}min</Badge>
                          <Badge variant="secondary" className="text-[10px]">+{task.xpReward} XP</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl bg-card p-12 text-center shadow-card">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-bold text-foreground">No study plan yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a personalized study plan based on your target score and exam date.
            </p>
            <Button onClick={() => setShowForm(true)} variant="hero" size="pill" className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Create Your Plan
            </Button>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
