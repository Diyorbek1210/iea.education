import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Gift, Lock, PlayCircle } from "lucide-react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getBonusLesson, listBonusLessons, listVideos, markVideoWatched } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";



export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Video lessons — IEA Dashboard" },
      {
        name: "description",
        content: "Watch IEA video lessons, track what you've completed and unlock bonus content.",
      },
      { property: "og:title", content: "Video lessons — IEA Dashboard" },
      { property: "og:description", content: "Your personal IELTS and English lesson library." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const { data: videos = [] } = useQuery({ queryKey: ["videos"], queryFn: listVideos });
  const { data: bonus } = useQuery({ queryKey: ["bonus"], queryFn: getBonusLesson });
  const { data: bonusLessons = [] } = useQuery({
    queryKey: ["bonus-lessons"],
    queryFn: listBonusLessons,
  });

  const watched = user?.videosWatched ?? [];
  const progress = videos.length ? (watched.length / videos.length) * 100 : 0;
  const bonusUnlocked = watched.length >= 5;


  async function watch(id: string, url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
    if (!user || watched.includes(id)) return;
    await markVideoWatched(user.uid, id);
    await refresh();
    queryClient.invalidateQueries({ queryKey: ["videos"] });
    const total = watched.length + 1;
    toast.success(
      total === 5
        ? "5 lessons watched — your free IELTS bonus lesson is unlocked!"
        : "Marked as watched",
    );
  }

  return (
    <DashboardShell title="Video lessons" subtitle="Watch, learn and track your progress">
      <section className="rounded-3xl bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-foreground">Your progress</p>
            <p className="text-xs text-muted-foreground">
              {watched.length} of {videos.length} lessons watched ·{" "}
              {Math.max(0, 5 - watched.length)} more to unlock the bonus IELTS lesson
            </p>
          </div>
          <span className="rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="mt-4 h-2" />
      </section>

      {bonusLessons.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-bold text-foreground">Bonus lessons</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {bonusLessons.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex flex-wrap items-center gap-4 rounded-3xl p-6 shadow-card",
                  bonusUnlocked ? "bg-gradient-primary" : "bg-card",
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                    bonusUnlocked ? "bg-primary-foreground/20" : "bg-secondary",
                  )}
                >
                  {bonusUnlocked ? (
                    <Gift className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-extrabold",
                      bonusUnlocked ? "text-primary-foreground" : "text-foreground",
                    )}
                  >
                    {item.title}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xs line-clamp-2",
                      bonusUnlocked ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    {bonusUnlocked
                      ? item.description
                      : `Locked — watch ${5 - watched.length} more lesson(s) to unlock.`}
                  </p>
                </div>
                {bonusUnlocked && (
                  <Button
                    variant="soft"
                    size="pill"
                    className="shrink-0"
                    onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                  >
                    <PlayCircle className="h-4 w-4" /> Watch
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {bonus && (
        <section
          className={cn(
            "mt-6 flex flex-wrap items-center gap-4 rounded-3xl p-6 shadow-card",
            bonusUnlocked ? "bg-gradient-primary" : "bg-card",
          )}
        >
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              bonusUnlocked ? "bg-primary-foreground/20" : "bg-secondary",
            )}
          >
            {bonusUnlocked ? (
              <Gift className="h-5 w-5 text-primary-foreground" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "text-sm font-extrabold",
                bonusUnlocked ? "text-primary-foreground" : "text-foreground",
              )}
            >
              {bonus.title}
            </p>
            <p
              className={cn(
                "mt-1 text-xs",
                bonusUnlocked ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {bonusUnlocked
                ? bonus.description
                : `Locked — watch ${5 - watched.length} more lesson(s) to unlock this free bonus.`}
            </p>
          </div>
          {bonusUnlocked && (
            <Button
              variant="soft"
              size="pill"
              onClick={() => window.open(bonus.url, "_blank", "noopener,noreferrer")}
            >
              <PlayCircle className="h-4 w-4" /> Watch bonus
            </Button>
          )}
        </section>
      )}



      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => {
          const done = watched.includes(video.id);
          return (
            <article key={video.id} className="overflow-hidden rounded-3xl bg-card shadow-card">
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
                {done && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-success px-3 py-1 text-[11px] font-bold text-success-foreground">
                    <CheckCircle2 className="h-3 w-3" /> Watched
                  </span>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-sm font-bold text-foreground">{video.title}</h2>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {video.description}
                </p>
                <Button
                  variant={done ? "soft" : "hero"}
                  size="pill"
                  className="mt-4 w-full"
                  onClick={() => watch(video.id, video.url)}
                >
                  <PlayCircle className="h-4 w-4" />
                  {done ? "Watch again" : "Watch lesson"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      {videos.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          No lessons published yet. Check back soon.
        </p>
      )}
    </DashboardShell>
  );
}
