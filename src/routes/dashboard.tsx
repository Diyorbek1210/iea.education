import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CheckCircle2,
  ClipboardCheck,
  Flame,
  Gamepad2,
  Gift,
  Lock,
  PlayCircle,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DailyGoalRing } from "@/components/dashboard/DailyGoalRing";
import { MockProgressChart } from "@/components/dashboard/MockProgressChart";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BADGES } from "@/data/badges";
import { useAuth } from "@/lib/auth";
import { listMockResults, setDailyGoal } from "@/lib/db";
import {
  computeXpLevel,
  DAILY_GOAL_PRESETS,
  DEFAULT_DAILY_GOAL,
  nextXpLevel,
} from "@/lib/gamification";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — IEA" },
      {
        name: "description",
        content: "Track your streak, XP, daily goal, mock test progress and unlocked badges.",
      },
      { property: "og:title", content: "Dashboard — IEA" },
      { property: "og:description", content: "Your learning progress at a glance." },
    ],
  }),
  component: DashboardPage,
});

const ICONS: Record<string, LucideIcon> = {
  CheckCircle2,
  Flame,
  Gift,
  PlayCircle,
  ClipboardCheck,
  Gamepad2,
  Star,
  Trophy,
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-secondary p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold text-secondary-foreground">{value}</p>
    </div>
  );
}

function DashboardPage() {
  const { user, refresh } = useAuth();
  const { data: mockResults = [] } = useQuery({
    queryKey: ["mock-results"],
    queryFn: listMockResults,
  });

  if (!user) return null;

  const myMockResults = mockResults.filter((r) => r.userId === user.uid);

  const xp = user.xp ?? 0;
  const streak = user.streak ?? 0;
  const longestStreak = user.longestStreak ?? 0;
  const todayXp = user.todayXp ?? 0;
  const dailyGoal = user.dailyGoal ?? DEFAULT_DAILY_GOAL;
  const unlockedBadges = new Set(user.badges ?? []);

  const currentLevel = computeXpLevel(xp);
  const next = nextXpLevel(xp);
  const levelProgress = next
    ? ((xp - currentLevel.minXp) / (next.minXp - currentLevel.minXp)) * 100
    : 100;

  async function pickGoal(goal: number) {
    if (!user) return;
    await setDailyGoal(user.uid, goal);
    await refresh();
    toast.success(`Daily goal set to ${goal} XP`);
  }

  return (
    <DashboardShell title="Dashboard" subtitle="Streak, XP, daily goal and badges">
      <div className="space-y-6">
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
              <Badge className="bg-gradient-primary text-primary-foreground">
                {currentLevel.title}
              </Badge>
            </div>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <p className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Flame className="h-4 w-4 text-primary" /> Streak
            </p>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{streak} days</p>
            <p className="mt-1 text-xs text-muted-foreground">Best streak: {longestStreak} days</p>
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <p className="text-sm font-bold text-foreground">Experience</p>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{xp} XP</p>
            <Progress value={levelProgress} className="mt-3 h-2" />
            <p className="mt-1 text-xs text-muted-foreground">
              {next ? `${next.minXp - xp} XP to ${next.title}` : "Max level reached"}
            </p>
          </div>
        </section>

        <MockProgressChart results={myMockResults} />

        <section className="rounded-3xl bg-card p-6 shadow-card">
          <p className="text-sm font-bold text-foreground">Daily goal</p>
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <DailyGoalRing todayXp={todayXp} dailyGoal={dailyGoal} />
            <div className="flex flex-wrap gap-2">
              {DAILY_GOAL_PRESETS.map((preset) => (
                <Button
                  key={preset}
                  variant={dailyGoal === preset ? "hero" : "soft"}
                  size="pill"
                  onClick={() => pickGoal(preset)}
                >
                  {preset} XP
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-foreground">Badges</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BADGES.map((badge) => {
              const unlocked = unlockedBadges.has(badge.id);
              const Icon = ICONS[badge.icon] ?? Star;
              return (
                <div
                  key={badge.id}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl p-4 shadow-card transition-all",
                    unlocked ? "bg-gradient-primary" : "bg-secondary opacity-70",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      unlocked ? "bg-primary-foreground/20" : "bg-card",
                    )}
                  >
                    {unlocked ? (
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-sm font-bold",
                        unlocked ? "text-primary-foreground" : "text-foreground",
                      )}
                    >
                      {badge.name}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        unlocked ? "text-primary-foreground/80" : "text-muted-foreground",
                      )}
                    >
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatTile label="Videos watched" value={user.videosWatched?.length ?? 0} />
          <StatTile label="Mock tests" value={user.mockResults?.length ?? 0} />
          <StatTile label="Games played" value={user.gamesPlayed ?? 0} />
        </section>
      </div>
    </DashboardShell>
  );
}
