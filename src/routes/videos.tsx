import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { VideoPlayerDialog } from "@/components/VideoPlayerDialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { listVideos, markVideoWatched, recordActivity } from "@/lib/db";
import { useAuth } from "@/lib/auth";
import { BONUS_UNLOCK_VIDEOS } from "@/lib/gamification";
import type { VideoDoc } from "@/lib/types";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Video lessons — IEA Dashboard" },
      {
        name: "description",
        content: "Watch IEA video lessons, track what you've completed and unlock bonus content.",
      },
      { property: "og:title", content: "Video lessons — IEA" },
      { property: "og:description", content: "Your personal IELTS and English lesson library." },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const { data: videos = [] } = useQuery({ queryKey: ["videos"], queryFn: listVideos });
  const [playing, setPlaying] = useState<VideoDoc | null>(null);

  const watched = user?.videosWatched ?? [];
  const progress = videos.length ? (watched.length / videos.length) * 100 : 0;

  async function watch(video: VideoDoc) {
    if (video.sourceType === "file") {
      setPlaying(video);
    } else {
      window.open(video.url, "_blank", "noopener,noreferrer");
    }
    const { id } = video;
    if (!user || watched.includes(id)) return;
    await markVideoWatched(user.uid, id);
    const optimistic = { ...user, videosWatched: [...watched, id] };
    const { xpGained, newBadges } = await recordActivity(optimistic, "video");
    await refresh();
    queryClient.invalidateQueries({ queryKey: ["videos"] });
    const total = watched.length + 1;
    toast.success(
      total === BONUS_UNLOCK_VIDEOS
        ? `${BONUS_UNLOCK_VIDEOS} lessons watched — your free IELTS bonus lesson is unlocked! +${xpGained} XP`
        : `Marked as watched · +${xpGained} XP`,
    );
    newBadges.forEach((b) => toast(`🏅 New badge: ${b.name}`));
  }

  return (
    <DashboardShell title="Video lessons" subtitle="Watch, learn and track your progress">
      <section className="rounded-3xl bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-foreground">Your progress</p>
            <p className="text-xs text-muted-foreground">
              {watched.length} of {videos.length} lessons watched
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
                  onClick={() => watch(video)}
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

      <VideoPlayerDialog video={playing} onOpenChange={(open) => !open && setPlaying(null)} />
    </DashboardShell>
  );
}
