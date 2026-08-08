import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Gift, Lock, PlayCircle } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { listBonusLessons } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bonuses")({
  head: () => ({
    meta: [
      { title: "Bonus lessons — IEA Dashboard" },
      {
        name: "description",
        content: "Access your unlocked bonus IELTS lessons and exclusive content.",
      },
      { property: "og:title", content: "Bonus lessons — IEA Dashboard" },
      { property: "og:description", content: "Your exclusive bonus lessons library." },
    ],
  }),
  component: BonusesPage,
});

function BonusesPage() {
  const { user } = useAuth();
  const { data: bonusLessons = [] } = useQuery({
    queryKey: ["bonus-lessons"],
    queryFn: listBonusLessons,
  });

  const watched = user?.videosWatched ?? [];
  const bonusUnlocked = watched.length >= 5;

  return (
    <DashboardShell
      title="Bonus lessons"
      subtitle="Exclusive content unlocked after watching 5 lessons"
    >
      {!bonusUnlocked && (
        <section className="rounded-3xl bg-secondary p-6 shadow-card">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-bold text-foreground">Bonuses locked</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Watch {5 - watched.length} more lesson(s) to unlock all bonus content.
              </p>
            </div>
          </div>
        </section>
      )}

      {bonusLessons.length === 0 ? (
        <div className="rounded-3xl bg-card p-12 text-center shadow-card">
          <Gift className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm font-bold text-foreground">No bonuses yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Check back soon for exclusive bonus lessons.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bonusLessons.map((bonus) => (
            <article
              key={bonus.id}
              className={cn(
                "overflow-hidden rounded-3xl shadow-card transition-all",
                bonusUnlocked ? "bg-card" : "bg-secondary opacity-75",
              )}
            >
              <div className="bg-gradient-primary p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/80">
                      {bonusUnlocked ? "Unlocked" : "Locked"}
                    </p>
                    <h2 className="mt-2 text-lg font-extrabold text-primary-foreground">
                      {bonus.title}
                    </h2>
                  </div>
                  <Gift className="h-8 w-8 text-primary-foreground/40 shrink-0" />
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {bonus.description}
                </p>
                {bonusUnlocked ? (
                  <Button
                    variant="hero"
                    size="pill"
                    className="mt-5 w-full"
                    onClick={() => window.open(bonus.url, "_blank", "noopener,noreferrer")}
                  >
                    <PlayCircle className="h-4 w-4" /> Watch now
                  </Button>
                ) : (
                  <Button
                    variant="soft"
                    size="pill"
                    disabled
                    className="mt-5 w-full"
                  >
                    <Lock className="h-4 w-4" /> Locked
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
