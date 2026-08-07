import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { listVideos, markVideoWatched } from "@/lib/db";
import { useAuth } from "@/lib/auth";

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

  const watched = user?.videosWatched ?? [];
  const progress = videos.length ? (watched.length / videos.length) * 100 : 0;

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
