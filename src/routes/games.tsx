import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { HangmanGame, ScrambleGame, TimedQuizGame } from "@/components/games/Games";
import { useAuth } from "@/lib/auth";
import { recordActivity } from "@/lib/db";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "English games — IEA" },
      {
        name: "description",
        content: "Play vocabulary rush, word rescue and unscramble games to grow your English.",
      },
      { property: "og:title", content: "English games — IEA" },
      { property: "og:description", content: "Three quick games that make vocabulary stick." },
    ],
  }),
  component: GamesPage,
});

function GamesPage() {
  const { user, refresh } = useAuth();

  async function handleComplete(score: number, _max: number) {
    if (!user) return;
    const { xpGained, newBadges } = await recordActivity(user, "game", { gameScore: score });
    await refresh();
    toast.success(`+${xpGained} XP`);
    newBadges.forEach((b) => toast(`🏅 New badge: ${b.name}`));
  }

  return (
    <DashboardShell title="Games" subtitle="Learn vocabulary the fun way">
      <div className="grid gap-6 xl:grid-cols-2">
        <TimedQuizGame onComplete={handleComplete} />
        <ScrambleGame onComplete={handleComplete} />
        <div className="xl:col-span-2">
          <HangmanGame onComplete={handleComplete} />
        </div>
      </div>
    </DashboardShell>
  );
}
