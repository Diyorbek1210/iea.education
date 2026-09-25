import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, BookOpen, CalendarCheck, CheckCircle2, Clock, Flame, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AppHeader, HeaderAction } from "@/components/AppHeader";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/lib/auth";
import { listStudyPlans } from "@/lib/db";
import {
  type StudyTask,
  type SkillType,
  type DayOfWeek,
  DAY_LABELS,
} from "@/shared/data/studyPlan";
import { cn } from "@/shared/lib/utils";
import type { StudyPlanRecord } from "@/shared/types/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — IEA" },
      {
        name: "description",
        content: "Your study dashboard: daily tasks, progress and mock test results.",
      },
      { property: "og:title", content: "Dashboard — IEA" },
      { property: "og:description", content: "Your progress in learning English." },
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
  listening: "bg-blue-100 text-blue-700",
  reading: "bg-emerald-100 text-emerald-700",
  writing: "bg-amber-100 text-amber-700",
  speaking: "bg-rose-100 text-rose-700",
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
  const days: DayOfWeek[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
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

function DailyStudyTasks({ plans }: { plans: StudyPlanRecord[] }) {
  const today = getDayOfWeek();
  const todayLabel = DAY_LABELS[today];

  const todayTasks = useMemo(() => {
    if (!plans.length) return [];
    const plan = plans[0];
    if (!plan) return [];
    const schedule = plan.weekSchedule as Array<{ day: DayOfWeek; tasks: StudyTask[] }>;
    const todaySchedule = schedule.find((s) => s.day === today);
    return todaySchedule?.tasks ?? [];
  }, [plans, today]);

  const [completed, setCompleted] = useState<Record<string, boolean>>(getCompletedTasks);

  const completedCount = todayTasks.filter((t) => completed[t.id]).length;
  const totalMinutes = todayTasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  const completedMinutes = todayTasks
    .filter((t) => completed[t.id])
    .reduce((sum, t) => sum + t.durationMinutes, 0);

  function toggleTask(taskId: string) {
    setCompleted((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      saveCompletedTasks(next);
      return next;
    });
  }

  if (todayTasks.length === 0) {
    return (
      <section className="animate-fade-up rounded-4xl border border-line bg-white p-6 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <CalendarCheck className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-black uppercase tracking-tight text-ink">Today's Tasks</h2>
          <Badge className="ml-auto">{todayLabel}</Badge>
        </div>
        <div className="rounded-2xl bg-sunken p-8 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-ink-faint" />
          <p className="mt-3 text-sm font-black text-ink">No tasks for today</p>
          <p className="mt-1 text-xs font-medium text-ink-soft">
            Set up your study plan to get daily tasks.
          </p>
          <Button asChild variant="ghost" size="sm" className="mt-4">
            <Link to="/settings">Set up plan</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-fade-up rounded-4xl border border-line bg-white p-5 shadow-soft sm:p-6 [animation-delay:60ms]">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <CalendarCheck className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-black uppercase tracking-tight text-ink">Today's Tasks</h2>
        <Badge className="ml-auto">{todayLabel}</Badge>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="h-2.5 flex-1 rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-600 transition-all duration-500"
            style={{
              width: `${todayTasks.length ? (completedCount / todayTasks.length) * 100 : 0}%`,
            }}
          />
        </div>
        <span className="text-[11px] font-black text-ink-soft">
          {completedCount}/{todayTasks.length}
        </span>
      </div>

      <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-ink-faint">
        {completedMinutes} of {totalMinutes} min completed
      </p>

      <div className="space-y-2">
        {todayTasks.map((task, i) => {
          const isDone = !!completed[task.id];
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              style={{ animationDelay: `${80 + i * 40}ms` }}
              className={cn(
                "flex w-full animate-fade-up items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-300",
                isDone
                  ? "border-emerald-200 bg-emerald-50/70"
                  : "border-transparent bg-sunken hover:border-brand-200 hover:bg-brand-50/50",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  isDone
                    ? "border-[#00C853] bg-[#00C853] text-white"
                    : "border-slate-200 bg-white text-ink-faint",
                )}
              >
                {isDone && <CheckCircle2 className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-bold",
                    isDone ? "text-ink-soft line-through" : "text-ink",
                  )}
                >
                  {task.title}
                </p>
                <p className="mt-0.5 text-xs font-medium text-ink-soft">{task.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                    SKILL_COLORS[task.skill],
                  )}
                >
                  {SKILL_LABELS[task.skill]}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-ink-soft">
                  <Clock className="h-3 w-3" />
                  {task.durationMinutes} min
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {completedCount === todayTasks.length && todayTasks.length > 0 && (
        <div className="mt-4 animate-fade-up rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-center [animation-delay:320ms]">
          <p className="text-sm font-black text-emerald-700">All tasks completed!</p>
          <p className="mt-1 text-xs font-semibold text-emerald-600">Great work today.</p>
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
  const streak = user.streak ?? 0;

  return (
    <DashboardShell title="Dashboard" subtitle="Your learning center">
      <div className="space-y-6">
        <AppHeader
          eyebrow="Hello, student"
          title="My Dashboard"
          subtitle={`Have a great day, ${user.name.split(" ")[0]}! Keep up the momentum.`}
          className="animate-fade-up"
          actions={
            <>
              <HeaderAction label="Notifications" icon={<Bell className="h-4 w-4" />} badge={2} />
              <HeaderAction label="Achievements" icon={<Sparkles className="h-4 w-4" />} />
            </>
          }
        />

        {/* User Profile */}
        <section className="flex animate-fade-up flex-wrap items-center gap-5 rounded-4xl border border-line bg-white p-6 shadow-soft [animation-delay:40ms]">
          <Avatar className="h-16 w-16 rounded-2xl">
            <AvatarFallback className="bg-gradient-to-br from-brand-700 to-brand-600 text-lg font-black text-white shadow-brand">
              {initials(user.name) || "ST"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-black tracking-tighter text-ink">{user.name}</h2>
            <p className="truncate text-xs font-semibold text-ink-soft">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge>{user.level}</Badge>
              <Badge variant="secondary">
                {user.level?.includes("Band") ? user.level : "Student"}
              </Badge>
              {streak > 0 && (
                <Badge className="bg-orange-100 text-orange-600">
                  <Flame className="mr-1 h-3 w-3" /> {streak}-day streak
                </Badge>
              )}
            </div>
          </div>
        </section>

        {/* Daily Study Tasks */}
        <DailyStudyTasks plans={myPlans} />
      </div>
    </DashboardShell>
  );
}
