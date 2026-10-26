import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Crown, Medal } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { fetchLeaderboard } from "@/lib/leaderboardServer";
import { useAuth } from "@/lib/auth";
import { cn } from "@/shared/lib/utils";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard - Tafakkur Avlodi" },
      {
        name: "description",
        content: "See the top Tafakkur Avlodi learners ranked by their best IELTS mock band score.",
      },
      { property: "og:title", content: "Leaderboard - Tafakkur Avlodi" },
      { property: "og:description", content: "Compete with other Tafakkur Avlodi students for the top spot." },
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

function LeaderboardPage() {
  const { user } = useAuth();
  // Rankings span every student, but mock results also hold each learner's
  // essays and transcripts — so the aggregate is computed server-side and only
  // the display fields are returned.
  const { data } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => fetchLeaderboard(),
    staleTime: 60_000,
  });

  const bandRanked: RankRow[] = (data?.entries ?? []).map((entry) => ({
    userId: entry.userId,
    name: entry.name,
    value: entry.band,
    sub: `${entry.attempts} ${entry.attempts === 1 ? "attempt" : "attempts"}`,
  }));

  return (
    <DashboardShell title="Leaderboard" subtitle="Ranked by best mock band score">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-card shadow-card">
        {bandRanked.length === 0 && (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No mock results yet - be the first to take the mock test.
          </p>
        )}

        {bandRanked.map((entry, index) => (
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
              <p className="text-xs text-muted-foreground">{entry.sub}</p>
            </div>
            <span className="flex items-center gap-1.5 text-lg font-extrabold text-foreground">
              {index < 3 && <Medal className="h-4 w-4 text-primary" />}
              {entry.value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
