import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Crown,
  Lock,
  Sparkles,
  Clock,
  ChevronRight,
  BookOpen,
  RotateCcw,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AppHeader, HeaderAction } from "@/components/AppHeader";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { listLearningSteps } from "@/lib/db";
import { TECH } from "@/shared/data/learningPath";
import type { LearningPathStepDoc } from "@/shared/types/types";
import { cn } from "@/shared/lib/utils";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learning Path — IEA" },
      {
        name: "description",
        content: "Your personal learning path to English fluency and IELTS success.",
      },
      { property: "og:title", content: "Learning Path — IEA" },
    ],
  }),
  component: LearnPage,
});

type Status = "done" | "current" | "locked";

const STATUS_META: Record<
  Status,
  { label: string; dot: string; badge: string; card: string; ring: string; iconBorder: string }
> = {
  done: {
    label: "Completed",
    dot: "bg-[#00C853] border-4 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    card: "border-emerald-300/70 bg-emerald-50/60 hover:border-emerald-300",
    ring: "text-emerald-600",
    iconBorder: "border-emerald-200",
  },
  current: {
    label: "In progress",
    dot: "bg-[#4A90E2] border-4 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    card: "border-blue-300/70 bg-blue-50/60 hover:border-blue-300",
    ring: "text-blue-600",
    iconBorder: "border-blue-200",
  },
  locked: {
    label: "Locked",
    dot: "bg-slate-300 border-4 border-slate-200",
    badge: "bg-slate-200 text-slate-500",
    card: "border-slate-200 bg-slate-50/60",
    ring: "text-slate-400",
    iconBorder: "border-slate-200",
  },
};

const PROGRESS_KEY = "iea_learn_progress";

function loadProgress(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveProgress(ids: Set<string>) {
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify([...ids]));
}

function StatusBadge({ status }: { status: Status }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest",
        meta.badge,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status === "done" && "✓ "}
      {meta.label}
    </span>
  );
}

function SkillChips({ keys, finish }: { keys: string[]; finish?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {keys.map((key) => {
        const tech = TECH[key];
        if (!tech) return null;
        const Icon = tech.icon;
        return (
          <span
            key={key}
            title={tech.label}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest"
            style={{ backgroundColor: `${tech.color}14`, color: tech.color }}
          >
            <Icon className="h-3.5 w-3.5" />
            {tech.label}
          </span>
        );
      })}
      {finish && (
        <span
          title="Finish"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD7002e] px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#B8860B]"
        >
          <Crown className="h-3.5 w-3.5" /> Finish
        </span>
      )}
    </div>
  );
}

function PathCard({
  step,
  index,
  status,
  onComplete,
}: {
  step: LearningPathStepDoc;
  index: number;
  status: Status;
  onComplete: () => void;
}) {
  const meta = STATUS_META[status];
  const locked = status === "locked";

  return (
    <article
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        "w-[92%] animate-fade-up rounded-3xl border-2 p-5 shadow-soft transition-all duration-300 sm:w-[86%] sm:p-6 lg:w-[82%]",
        meta.card,
        !locked && "hover:-translate-y-0.5 hover:shadow-card",
        step.finish ? "border-amber-300 bg-amber-50/70" : undefined,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <StatusBadge status={status} />
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500 sm:inline-flex">
            Step {index + 1}
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
            <Clock className="h-3 w-3" />
            {step.minutes} min
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        {step.finish ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#E6A800] text-brand-900 shadow-glow">
            <Crown className="h-5 w-5" />
          </span>
        ) : (
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border bg-white",
              meta.iconBorder,
            )}
          >
            <BookOpen className={cn("h-5 w-5", meta.ring)} />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-black uppercase tracking-tight text-ink">{step.title}</h3>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
            {step.lessons} lessons
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs font-medium leading-relaxed text-ink-soft">{step.description}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <SkillChips keys={step.tech} finish={step.finish ?? false} />

        {status === "current" && (
          <button
            type="button"
            onClick={onComplete}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-brand transition-all duration-300 hover:bg-brand-600 active:translate-y-px"
          >
            Complete & continue
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
        {status === "done" && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Done
          </span>
        )}
        {locked && <Lock className="h-4 w-4 text-slate-300" />}
      </div>
    </article>
  );
}

function LearnPage() {
  const queryClient = useQueryClient();
  const { data: steps = [], isLoading } = useQuery({
    queryKey: ["learning-steps"],
    queryFn: listLearningSteps,
  });
  const [completed, setCompleted] = useState<Set<string>>(loadProgress);

  useEffect(() => {
    saveProgress(completed);
  }, [completed]);

  const ordered = useMemo(() => [...steps].sort((a, b) => a.order - b.order), [steps]);

  const statuses = useMemo(() => {
    let foundCurrent = false;
    return ordered.map((step) => {
      if (completed.has(step.id)) return "done" as Status;
      if (!foundCurrent) {
        foundCurrent = true;
        return "current" as Status;
      }
      return "locked" as Status;
    });
  }, [ordered, completed]);
  const doneIndexes = statuses.reduce((acc, s, i) => (s === "done" ? acc + 1 : acc), 0);
  const progress = ordered.length ? Math.round((doneIndexes / ordered.length) * 100) : 0;
  const totalLessons = useMemo(() => ordered.reduce((sum, s) => sum + s.lessons, 0), [ordered]);
  const totalMinutes = useMemo(() => ordered.reduce((sum, s) => sum + s.minutes, 0), [ordered]);

  const completeStep = useCallback(
    (id: string) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      toast.success("Nice work! Next module unlocked.");
      queryClient.invalidateQueries({ queryKey: ["learning-steps"] });
    },
    [queryClient],
  );

  const resetProgress = useCallback(() => {
    setCompleted(new Set());
    toast("Progress reset. Start again from the first module.");
  }, []);

  if (isLoading) {
    return (
      <DashboardShell title="Learning Path" subtitle="Your roadmap to IELTS">
        <div className="flex flex-col items-center gap-4 py-24">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          <p className="text-[11px] font-black uppercase tracking-widest text-ink-soft">
            Loading your path…
          </p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Learning Path" subtitle="Your roadmap to IELTS">
      <div className="space-y-6">
        <AppHeader
          eyebrow="Learning"
          title="Learning Path"
          subtitle="Follow the steps and unlock new modules"
          className="animate-fade-up"
          actions={
            <>
              <HeaderAction label="Notifications" icon={<Bell className="h-4 w-4" />} badge={2} />
              <HeaderAction label="Help" icon={<Sparkles className="h-4 w-4" />} />
            </>
          }
        />

        {/* Overview card */}
        <section className="animate-fade-up rounded-4xl border border-line bg-white p-6 shadow-soft [animation-delay:40ms]">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-50">
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#14537A ${progress * 3.6}deg, #E9EEF3 0deg)`,
                }}
              />
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-lg font-black text-brand-700">
                {progress}%
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-black uppercase tracking-tight text-ink">
                Path progress
              </h2>
              <p className="mt-1 text-xs font-semibold text-ink-soft">
                {doneIndexes} of {ordered.length} modules completed
              </p>
              <div className="mt-3 flex gap-1.5">
                {statuses.map((s, i) => (
                  <span
                    key={ordered[i]?.id ?? i}
                    className={cn(
                      "h-2 flex-1 rounded-full",
                      s === "done"
                        ? "bg-[#00C853]"
                        : s === "current"
                          ? "bg-[#4A90E2]"
                          : "bg-slate-200",
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex gap-4 text-center">
                {(["done", "current", "locked"] as Status[]).map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1.5">
                    <span
                      className={cn("h-3 w-3 rounded-full", STATUS_META[s].dot.split(" ")[0])}
                    />
                    <span className="text-[9px] font-black uppercase tracking-widest text-ink-faint">
                      {STATUS_META[s].label}
                    </span>
                  </div>
                ))}
              </div>
              {doneIndexes > 0 && (
                <button
                  type="button"
                  onClick={resetProgress}
                  className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-ink-faint transition-colors hover:text-rose-500"
                >
                  <RotateCcw className="h-3 w-3" /> Reset progress
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5 sm:grid-cols-4">
            {[
              { label: "Modules", value: ordered.length },
              { label: "Lessons", value: totalLessons },
              { label: "Total time", value: `${Math.round(totalMinutes / 60)}h ${totalMinutes % 60}m` },
              { label: "Completed", value: doneIndexes },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-surface px-4 py-3">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-ink-faint">
                  {stat.label}
                </p>
                <p className="mt-1 text-xl font-black tracking-tight text-ink">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Zigzag timeline */}
        <section className="relative pt-4">
          <span
            aria-hidden="true"
            className="absolute bottom-8 left-6 top-8 w-px bg-slate-200 lg:left-1/2 lg:-translate-x-1/2"
          />
          <ol className="space-y-0">
            {ordered.map((step, index) => {
              const status = statuses[index]!;
              const meta = STATUS_META[status];
              const left = index % 2 === 0;
              return (
                <li
                  key={step.id}
                  className="relative pb-8 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-x-10"
                >
                  {/* Connector dot */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-6 top-10 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full lg:left-1/2",
                      meta.dot,
                      status === "done" && "ring-4 ring-emerald-100",
                      status === "current" && "ring-4 ring-blue-100",
                      status === "locked" && "ring-4 ring-slate-100",
                    )}
                  >
                    {status === "current" && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-[#4A90E2]/40" />
                    )}
                  </span>

                  <div className={cn("pl-14 lg:pl-0", left ? "lg:col-start-1" : "lg:col-start-2")}>
                    <div
                      className={cn(
                        "lg:flex",
                        left ? "lg:justify-end lg:pr-10" : "lg:justify-start lg:pl-10",
                      )}
                    >
                      <PathCard
                        step={step}
                        index={index}
                        status={status}
                        onComplete={() => completeStep(step.id)}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </DashboardShell>
  );
}
