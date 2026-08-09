import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Crown, Medal, Zap } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listMockResults, listUsers } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { effectiveWeeklyXp } from "@/lib/gamification";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — IEA" },
      {
        name: "description",
        content: "See the top IEA learners ranked by weekly XP or best IELTS mock band score.",
      },
      { property: "og:title", content: "Leaderboard — IEA" },
      { property: "og:description", content: "Compete with other IEA students for the top spot." },
    ],
  }),
  component: LeaderboardPage,
});

interface RankRow {
  userId: string;
  name: string;
  value: number;
  sub: string;
}

function RankList({
  rows,
  currentUserId,
  emptyMessage,
  formatValue,
}: {
  rows: RankRow[];
  currentUserId: string | undefined;
  emptyMessage: string;
  formatValue: (value: number) => string;
}) {
  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-card shadow-card">
      {rows.length === 0 && (
        <p className="p-10 text-center text-sm text-muted-foreground">{emptyMessage}</p>
      )}

      {rows.map((entry, index) => (
        <div
          key={entry.userId}
          className={cn(
            "flex items-center gap-4 border-b border-border px-5 py-4 last:border-0",
            entry.userId === currentUserId && "bg-secondary",
          )}
        >
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold",
              index === 0
                ? "bg-gradient-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground",
            )}
          >
            {index === 0 ? <Crown className="h-4 w-4" /> : index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">
              {entry.name}
              {entry.userId === currentUserId && (
                <span className="ml-2 text-xs font-semibold text-primary">You</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{entry.sub}</p>
          </div>
          <span className="flex items-center gap-1.5 text-lg font-extrabold text-foreground">
            {index < 3 && <Medal className="h-4 w-4 text-primary" />}
            {formatValue(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function LeaderboardPage() {
  const { user } = useAuth();
  const { data: results = [] } = useQuery({
    queryKey: ["mock-results"],
    queryFn: listMockResults,
  });
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
  });

  const weeklyRanked: RankRow[] = users
    .map((u) => ({
      userId: u.uid,
      name: u.name,
      value: effectiveWeeklyXp(u),
      sub: "this week",
    }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value);

  const best = new Map<string, { name: string; band: number; attempts: number }>();
  for (const result of results) {
    const current = best.get(result.userId);
    best.set(result.userId, {
      name: result.userName,
      band: Math.max(current?.band ?? 0, result.overall),
      attempts: (current?.attempts ?? 0) + 1,
    });
  }
  const bandRanked: RankRow[] = [...best.entries()]
    .map(([userId, value]) => ({
      userId,
      name: value.name,
      value: value.band,
      sub: `${value.attempts} ${value.attempts === 1 ? "attempt" : "attempts"}`,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <DashboardShell title="Leaderboard" subtitle="Ranked by weekly XP or best mock band">
      <Tabs defaultValue="weekly" className="mx-auto max-w-3xl">
        <TabsList>
          <TabsTrigger value="weekly">
            <Zap className="mr-1.5 h-3.5 w-3.5" /> Weekly XP
          </TabsTrigger>
          <TabsTrigger value="band">Best Band</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          <RankList
            rows={weeklyRanked}
            currentUserId={user?.uid}
            emptyMessage="No XP earned this week yet — watch a lesson or play a game to get on the board."
            formatValue={(v) => `${v} XP`}
          />
        </TabsContent>
        <TabsContent value="band">
          <RankList
            rows={bandRanked}
            currentUserId={user?.uid}
            emptyMessage="No mock results yet — be the first to take the mock test."
            formatValue={(v) => v.toFixed(1)}
          />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
