import { createFileRoute } from "@tanstack/react-router";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { HangmanGame, ScrambleGame, TimedQuizGame } from "@/components/games/Games";

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
  return (
    <DashboardShell title="Games" subtitle="Learn vocabulary the fun way">
      <div className="grid gap-6 xl:grid-cols-2">
        <TimedQuizGame />
        <ScrambleGame />
        <div className="xl:col-span-2">
          <HangmanGame />
        </div>
      </div>
    </DashboardShell>
  );
}
