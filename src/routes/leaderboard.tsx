import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Crown, Medal } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { listMockResults } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — IEA" },
      {
        name: "description",
        content: "See the top IEA learners ranked by their best IELTS mock test band score.",
      },
      { property: "og:title", content: "Leaderboard — IEA" },
      { property: "og:description", content: "Compete with other IEA students for the top band." },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { user } = useAuth();
  const { data: results = [] } = useQuery({
    queryKey: ["mock-results"],
    queryFn: listMockResults,
  });

  const best = new Map<string, { name: string; band: number; attempts: number }>();
  for (const result of results) {
    const current = best.get(result.userId);
    best.set(result.userId, {
      name: result.userName,
      band: Math.max(current?.band ?? 0, result.overall),
      attempts: (current?.attempts ?? 0) + 1,
    });
  }
  const ranked = [...best.entries()]
    .map(([userId, value]) => ({ userId, ...value }))
    .sort((a, b) => b.band - a.band);

  return (
    <DashboardShell title="Leaderboard" subtitle="Ranked by best overall mock band">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-card shadow-card">
        {ranked.length === 0 && (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No mock results yet — be the first to take the mock test.
          </p>
        )}

        {ranked.map((entry, index) => (
          <div
            key={entry.userId}
            className={cn(
              "flex items-center gap-4 border-b border-border px-5 py-4 last:border-0",
              entry.userId === user?.uid && "bg-secondary",
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
                {entry.userId === user?.uid && (
                  <span className="ml-2 text-xs font-semibold text-primary">You</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {entry.attempts} {entry.attempts === 1 ? "attempt" : "attempts"}
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-lg font-extrabold text-foreground">
              {index < 3 && <Medal className="h-4 w-4 text-primary" />}
              {entry.band.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
