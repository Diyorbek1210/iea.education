import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GraduationCap, Gift, Trash2, Users, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import {
  addVideo,
  deleteUserProfile,
  deleteVideo,
  getBonusLesson,
  listMockResults,
  listUsers,
  listVideos,
  saveBonusLesson,
} from "@/lib/db";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — IEA" },
      { name: "description", content: "Manage IEA students, video lessons and bonus content." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Panel — IEA" },
      { property: "og:description", content: "Internal management area for IEA administrators." },
    ],
  }),
  component: AdminPage,
});

type Tab = "students" | "videos" | "results" | "bonus";

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "students", label: "Students", icon: Users },
  { id: "videos", label: "Videos", icon: Video },
  { id: "results", label: "Mock results", icon: GraduationCap },
  { id: "bonus", label: "Bonus lesson", icon: Gift },
];

function AdminPage() {
  const { isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("students");

  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: listUsers });
  const { data: videos = [] } = useQuery({ queryKey: ["videos"], queryFn: listVideos });
  const { data: results = [] } = useQuery({
    queryKey: ["mock-results"],
    queryFn: listMockResults,
  });
  const { data: bonus } = useQuery({ queryKey: ["bonus"], queryFn: getBonusLesson });

  const [video, setVideo] = useState({ title: "", description: "", url: "", thumbnail: "" });
  const [bonusForm, setBonusForm] = useState({ title: "", description: "", url: "" });

  useEffect(() => {
    if (bonus) setBonusForm(bonus);
  }, [bonus]);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/login" });
  }, [loading, isAdmin, navigate]);

  if (loading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Checking admin access…</p>
      </div>
    );
  }

  async function submitVideo() {
    if (!video.title.trim() || !video.url.trim()) {
      toast.error("Title and video URL are required");
      return;
    }
    await addVideo({
      title: video.title.trim(),
      description: video.description.trim(),
      url: video.url.trim(),
      thumbnail:
        video.thumbnail.trim() ||
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=60",
    });
    setVideo({ title: "", description: "", url: "", thumbnail: "" });
    queryClient.invalidateQueries({ queryKey: ["videos"] });
    toast.success("Video added");
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="flex flex-wrap items-center gap-4 border-b border-border bg-background px-5 py-4">
        <Link to="/">
          <Logo />
        </Link>
        <span className="rounded-full bg-gradient-primary px-4 py-1 text-xs font-bold text-primary-foreground">
          Admin Panel
        </span>
        <Button
          variant="ghost"
          size="pill"
          className="ml-auto"
          onClick={async () => {
            await signOut();
            navigate({ to: "/", replace: true });
          }}
        >
          Sign out
        </Button>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Students", value: users.length },
            { label: "Video lessons", value: videos.length },
            { label: "Mock attempts", value: results.length },
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl bg-card p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-1 text-3xl font-extrabold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <nav className="mt-8 flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                tab === item.id
                  ? "bg-gradient-primary text-primary-foreground shadow-card"
                  : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {tab === "students" && (
          <section className="mt-6 overflow-hidden rounded-3xl bg-card shadow-card">
            {users.length === 0 && (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No students registered yet.
              </p>
            )}
            {users.map((student) => (
              <div
                key={student.uid}
                className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">{student.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{student.email}</p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {student.level}
                </span>
                <span className="text-xs text-muted-foreground">
                  {student.videosWatched?.length ?? 0} lessons
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await deleteUserProfile(student.uid);
                    queryClient.invalidateQueries({ queryKey: ["users"] });
                    toast.success("Student removed");
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </section>
        )}

        {tab === "videos" && (
          <section className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <h2 className="text-base font-bold text-foreground">Add a video lesson</h2>
              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="v-title">Title</Label>
                  <Input
                    id="v-title"
                    value={video.title}
                    maxLength={120}
                    onChange={(e) => setVideo({ ...video, title: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="v-desc">Description</Label>
                  <Textarea
                    id="v-desc"
                    value={video.description}
                    maxLength={400}
                    rows={3}
                    onChange={(e) => setVideo({ ...video, description: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="v-url">Video URL</Label>
                  <Input
                    id="v-url"
                    value={video.url}
                    maxLength={500}
                    placeholder="https://youtube.com/watch?v=…"
                    onChange={(e) => setVideo({ ...video, url: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="v-thumb">Thumbnail URL (optional)</Label>
                  <Input
                    id="v-thumb"
                    value={video.thumbnail}
                    maxLength={500}
                    onChange={(e) => setVideo({ ...video, thumbnail: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <Button variant="hero" size="pill" className="w-full" onClick={submitVideo}>
                  Add video
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl bg-card shadow-card">
              {videos.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b border-border p-4 last:border-0"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    loading="lazy"
                    className="h-14 w-24 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      await deleteVideo(item.id);
                      queryClient.invalidateQueries({ queryKey: ["videos"] });
                      toast.success("Video deleted");
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "results" && (
          <section className="mt-6 overflow-hidden rounded-3xl bg-card shadow-card">
            {results.length === 0 && (
              <p className="p-8 text-center text-sm text-muted-foreground">No mock results yet.</p>
            )}
            {results.map((result) => (
              <div
                key={result.id}
                className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-4 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">{result.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(result.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  L {result.listening} · R {result.reading} · W {result.writing} · S{" "}
                  {result.speaking}
                </p>
                <span className="text-lg font-extrabold text-foreground">
                  {result.overall.toFixed(1)}
                </span>
              </div>
            ))}
          </section>
        )}

        {tab === "bonus" && (
          <section className="mt-6 max-w-xl rounded-3xl bg-card p-6 shadow-card">
            <h2 className="text-base font-bold text-foreground">Bonus lesson</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Unlocked automatically for students who watch 5 lessons.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <Label htmlFor="b-title">Title</Label>
                <Input
                  id="b-title"
                  value={bonusForm.title}
                  maxLength={120}
                  onChange={(e) => setBonusForm({ ...bonusForm, title: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="b-desc">Description</Label>
                <Textarea
                  id="b-desc"
                  value={bonusForm.description}
                  maxLength={400}
                  rows={3}
                  onChange={(e) => setBonusForm({ ...bonusForm, description: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="b-url">Video URL</Label>
                <Input
                  id="b-url"
                  value={bonusForm.url}
                  maxLength={500}
                  onChange={(e) => setBonusForm({ ...bonusForm, url: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <Button
                variant="hero"
                size="pill"
                className="w-full"
                onClick={async () => {
                  await saveBonusLesson(bonusForm);
                  queryClient.invalidateQueries({ queryKey: ["bonus"] });
                  toast.success("Bonus lesson saved");
                }}
              >
                Save bonus lesson
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
