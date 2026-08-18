import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Flame,
  Loader2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { listStudyPlans } from "@/lib/db";
import { type StudyTask, type SkillType, type DayOfWeek, DAY_LABELS } from "@/data/studyPlan";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard - IEA" },
      {
        name: "description",
        content: "Your IELTS study dashboard with daily tasks, progress and mock test results.",
      },
      { property: "og:title", content: "Dashboard - IEA" },
      { property: "og:description", content: "Your IELTS learning progress at a glance." },
    ],
  }),
  component: DashboardPage,
});

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const SKILL_COLORS: Record<SkillType, string> = {
  listening: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  reading: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  writing: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  speaking: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

const SKILL_LABELS: Record<SkillType, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return days[new Date().getDay()]!;
}

function getCompletedTasks(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(`iea_daily_tasks_${getTodayKey()}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCompletedTasks(tasks: Record<string, boolean>) {
  localStorage.setItem(`iea_daily_tasks_${getTodayKey()}`, JSON.stringify(tasks));
}

function DailyStudyTasks({ plans }: { plans: Array<{ weekSchedule: Array<{ day: DayOfWeek; tasks: StudyTask[] }> }> }) {
  const today = getDayOfWeek();
  const todayLabel = DAY_LABELS[today];

  const todayTasks = useMemo(() => {
    if (!plans.length) return [];
    const plan = plans[0];
    const todaySchedule = plan.weekSchedule.find((s) => s.day === today);
    return todaySchedule?.tasks ?? [];
  }, [plans, today]);

  const [completed, setCompleted] = useState<Record<string, boolean>>(getCompletedTasks);

  const completedCount = todayTasks.filter((t) => completed[t.id]).length;
  const totalMinutes = todayTasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  const completedMinutes = todayTasks.filter((t) => completed[t.id]).reduce((sum, t) => sum + t.durationMinutes, 0);

  function toggleTask(taskId: string) {
    setCompleted((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      saveCompletedTasks(next);
      return next;
    });
  }

  if (todayTasks.length === 0) {
    return (
      <section className="rounded-3xl bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <CalendarCheck className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Today's Tasks</h3>
          <Badge variant="secondary" className="ml-auto">{todayLabel}</Badge>
        </div>
        <div className="rounded-2xl bg-secondary/60 p-8 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-semibold text-foreground">No tasks for today</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Set up your study plan to get daily tasks.
          </p>
          <Button asChild variant="soft" size="pill" className="mt-4">
            <a href="/settings">Set up study plan</a>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-card p-6 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <CalendarCheck className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">Today's Tasks</h3>
        <Badge variant="secondary" className="ml-auto">{todayLabel}</Badge>
      </div>

      {/* Progress bar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-primary transition-all duration-500"
            style={{ width: `${todayTasks.length ? (completedCount / todayTasks.length) * 100 : 0}%` }}
          />
        </div>
        <span className="text-xs font-bold text-muted-foreground">
          {completedCount}/{todayTasks.length}
        </span>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        {completedMinutes} / {totalMinutes} min completed
      </p>

      {/* Task list */}
      <div className="space-y-2">
        {todayTasks.map((task) => {
          const isDone = !!completed[task.id];
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all",
                isDone
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-secondary/60 hover:bg-secondary border border-transparent",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isDone
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn(
                  "text-sm font-semibold",
                  isDone ? "text-muted-foreground line-through" : "text-foreground",
                )}>
                  {task.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{task.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", SKILL_COLORS[task.skill])}>
                  {SKILL_LABELS[task.skill]}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {task.durationMinutes}m
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {completedCount === todayTasks.length && todayTasks.length > 0 && (
        <div className="mt-4 rounded-2xl bg-primary/10 p-4 text-center">
          <p className="text-sm font-bold text-primary">All tasks completed!</p>
          <p className="mt-1 text-xs text-muted-foreground">Great work today.</p>
        </div>
      )}
    </section>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const { data: plans = [] } = useQuery({
    queryKey: ["study-plans"],
    queryFn: listStudyPlans,
  });

  if (!user) return null;

  const myPlans = plans.filter((p) => p.userId === user.uid);

  return (
    <DashboardShell title="Dashboard">
      <div className="space-y-6">
        {/* User Profile */}
        <section className="flex flex-wrap items-center gap-5 rounded-3xl bg-card p-6 shadow-card">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-gradient-primary text-lg font-extrabold text-primary-foreground">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-extrabold text-foreground">{user.name}</h2>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary">{user.level}</Badge>
            </div>
          </div>
        </section>

        {/* Daily Study Tasks */}
        <DailyStudyTasks plans={myPlans} />
      </div>
    </DashboardShell>
  );
}
