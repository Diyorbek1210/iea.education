import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ClipboardList,
  GraduationCap,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  Pencil,
  Trash2,
  Users,
  Video,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import {
  addBonusLesson,
  addPlacementQuestion,
  addVideo,
  deleteBonusLesson,
  deletePlacementQuestion,
  deleteUserProfile,
  deleteVideo,
  getBonusLesson,
  listBonusLessons,
  listMockResults,
  listPlacementQuestions,
  listUsers,
  listVideos,
  saveBonusLesson,
  updateBonusLesson,
  updatePlacementQuestion,
  uploadLessonVideo,
} from "@/lib/db";
import type { Level } from "@/lib/types";
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

type Tab = "overview" | "students" | "videos" | "placement" | "results" | "bonus";

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: Users },
  { id: "videos", label: "Videos", icon: Video },
  { id: "placement", label: "Placement test", icon: ClipboardList },
  { id: "results", label: "Mock results", icon: GraduationCap },
  { id: "bonus", label: "Bonus lesson", icon: Gift },
];

const levelOrder: Level[] = [
  "Beginner",
  "Elementary",
  "Intermediate",
  "Upper-Intermediate",
  "Advanced",
];

const skillChartConfig = {
  value: { label: "Average band", color: "var(--color-primary)" },
};

const levelChartConfig = {
  value: { label: "Students", color: "var(--color-primary)" },
};

function AdminPage() {
  const { isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: listUsers });
  const { data: videos = [] } = useQuery({ queryKey: ["videos"], queryFn: listVideos });
  const { data: results = [] } = useQuery({
    queryKey: ["mock-results"],
    queryFn: listMockResults,
  });
  const { data: bonus } = useQuery({ queryKey: ["bonus"], queryFn: getBonusLesson });
  const { data: bonusLessons = [] } = useQuery({
    queryKey: ["bonus-lessons"],
    queryFn: listBonusLessons,
  });
  const { data: placementQuestions = [] } = useQuery({
    queryKey: ["placement-questions"],
    queryFn: listPlacementQuestions,
  });

  const [questionForm, setQuestionForm] = useState({
    q: "",
    options: ["", "", "", ""],
    answer: 0,
  });
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  function editQuestion(question: (typeof placementQuestions)[number]) {
    setEditingQuestionId(question.id);
    setQuestionForm({ q: question.q, options: [...question.options], answer: question.answer });
  }

  function resetQuestionForm() {
    setEditingQuestionId(null);
    setQuestionForm({ q: "", options: ["", "", "", ""], answer: 0 });
  }

  async function submitQuestion() {
    if (!questionForm.q.trim() || questionForm.options.some((option) => !option.trim())) {
      toast.error("Fill in the question and all 4 options");
      return;
    }
    const payload = {
      q: questionForm.q.trim(),
      options: questionForm.options.map((option) => option.trim()),
      answer: questionForm.answer,
    };
    if (editingQuestionId) {
      await updatePlacementQuestion(editingQuestionId, payload);
      toast.success("Question updated");
    } else {
      await addPlacementQuestion(payload);
      toast.success("Question added");
    }
    resetQuestionForm();
    queryClient.invalidateQueries({ queryKey: ["placement-questions"] });
  }

  async function removeQuestion(id: string) {
    await deletePlacementQuestion(id);
    if (editingQuestionId === id) resetQuestionForm();
    queryClient.invalidateQueries({ queryKey: ["placement-questions"] });
    toast.success("Question deleted");
  }

  const studentsByLevel = levelOrder.map((level) => ({
    level: level.replace("-", " "),
    value: users.filter((student) => student.level === level).length,
  }));

  const averageBySkill = (["listening", "reading", "writing", "speaking"] as const).map(
    (skill) => ({
      skill: skill[0]!.toUpperCase() + skill.slice(1),
      value: results.length
        ? Math.round((results.reduce((sum, r) => sum + r[skill], 0) / results.length) * 10) / 10
        : 0,
    }),
  );

  const [video, setVideo] = useState({ title: "", description: "", url: "", thumbnail: "" });
  const [videoMode, setVideoMode] = useState<"youtube" | "file">("youtube");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoCompressRatio, setVideoCompressRatio] = useState<number | null>(null);
  const [bonusForm, setBonusForm] = useState({ title: "", description: "", url: "" });
  const [bonus_item, setBonus_item] = useState({ title: "", description: "", url: "" });
  const [editingBonusId, setEditingBonusId] = useState<string | null>(null);
  const [bonusMode, setBonusMode] = useState<"youtube" | "file">("youtube");
  const [bonusFile, setBonusFile] = useState<File | null>(null);
  const [uploadingBonus, setUploadingBonus] = useState(false);
  const [bonusCompressRatio, setBonusCompressRatio] = useState<number | null>(null);

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
    if (!video.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (videoMode === "youtube" && !video.url.trim()) {
      toast.error("Video URL is required");
      return;
    }
    if (videoMode === "file" && !videoFile) {
      toast.error("Choose a video file to upload");
      return;
    }

    setUploadingVideo(true);
    setVideoCompressRatio(null);
    try {
      const url =
        videoMode === "file"
          ? await uploadLessonVideo(videoFile!, "videos", setVideoCompressRatio)
          : video.url.trim();
      await addVideo({
        title: video.title.trim(),
        description: video.description.trim(),
        url,
        sourceType: videoMode,
        thumbnail:
          video.thumbnail.trim() ||
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=60",
      });
      setVideo({ title: "", description: "", url: "", thumbnail: "" });
      setVideoFile(null);
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Video upload failed");
    } finally {
      setUploadingVideo(false);
      setVideoCompressRatio(null);
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-soft">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5 shadow-card transition-transform lg:static lg:translate-x-0 lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            <Logo />
          </Link>
          <span className="inline-flex w-fit rounded-full bg-gradient-primary px-3 py-1 text-[11px] font-bold text-primary-foreground">
            Admin Panel
          </span>
        </div>

        <nav className="mt-8 space-y-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id);
                setSidebarOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-colors",
                tab === item.id
                  ? "bg-gradient-primary text-primary-foreground shadow-card"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="pill"
          className="mt-auto w-full justify-start"
          onClick={async () => {
            await signOut();
            navigate({ to: "/", replace: true });
          }}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-5 py-4 backdrop-blur-md lg:hidden">
          <button
            type="button"
            className="rounded-xl border border-border p-2"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <span className="text-sm font-bold text-foreground">Admin Panel</span>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8">
          {tab === "overview" && (
            <>
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

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl bg-card p-6 shadow-card">
                  <h2 className="text-sm font-bold text-foreground">Students by level</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    How many registered students fall into each placement level.
                  </p>
                  <ChartContainer config={levelChartConfig} className="mt-4 aspect-auto h-64 w-full">
                    <BarChart data={studentsByLevel} margin={{ left: -20 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="level"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={11}
                      />
                      <YAxis tickLine={false} axisLine={false} allowDecimals={false} fontSize={11} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>

                <div className="rounded-3xl bg-card p-6 shadow-card">
                  <h2 className="text-sm font-bold text-foreground">Average band by skill</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Average score across every saved mock test attempt.
                  </p>
                  <ChartContainer config={skillChartConfig} className="mt-4 aspect-auto h-64 w-full">
                    <BarChart data={averageBySkill} margin={{ left: -20 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="skill"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={11}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 9]}
                        fontSize={11}
                      />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </>
          )}

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
                    const authDeleted = await deleteUserProfile(student.uid);
                    queryClient.invalidateQueries({ queryKey: ["users"] });
                    toast.success("Student removed");
                    if (!authDeleted) {
                      toast.warning(
                        "The Firebase Auth account could not be removed (server key not configured). The student may still log in.",
                      );
                    }
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
                  <Label>Source</Label>
                  <div className="mt-1.5 flex gap-2">
                    <Button
                      type="button"
                      variant={videoMode === "youtube" ? "hero" : "soft"}
                      size="pill"
                      className="flex-1"
                      onClick={() => setVideoMode("youtube")}
                    >
                      Link
                    </Button>
                    <Button
                      type="button"
                      variant={videoMode === "file" ? "hero" : "soft"}
                      size="pill"
                      className="flex-1"
                      onClick={() => setVideoMode("file")}
                    >
                      Upload file
                    </Button>
                  </div>
                </div>
                {videoMode === "youtube" ? (
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
                ) : (
                  <div>
                    <Label htmlFor="v-file">Video file</Label>
                    <Input
                      id="v-file"
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                      className="mt-1.5"
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">Larger files are compressed in your browser first, then uploaded.</p>
                  </div>
                )}
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
                <Button
                  variant="hero"
                  size="pill"
                  className="w-full"
                  onClick={submitVideo}
                  disabled={uploadingVideo}
                >
                  {uploadingVideo
                    ? videoCompressRatio !== null
                      ? `Compressing… ${Math.round(videoCompressRatio * 100)}%`
                      : "Uploading…"
                    : "Add video"}
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

        {tab === "placement" && (
          <section className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <h2 className="text-base font-bold text-foreground">
                {editingQuestionId ? "Edit question" : "Add a placement question"}
              </h2>
              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="q-text">Question</Label>
                  <Textarea
                    id="q-text"
                    value={questionForm.q}
                    maxLength={300}
                    rows={2}
                    onChange={(e) => setQuestionForm({ ...questionForm, q: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Options — click the letter to mark the correct one</Label>
                  <div className="mt-1.5 space-y-2">
                    {questionForm.options.map((option, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuestionForm({ ...questionForm, answer: i })}
                          aria-label={`Mark option ${String.fromCharCode(65 + i)} as correct`}
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 text-xs font-bold transition-colors",
                            questionForm.answer === i
                              ? "border-primary bg-secondary text-primary"
                              : "border-border text-muted-foreground hover:border-primary/40",
                          )}
                        >
                          {String.fromCharCode(65 + i)}
                        </button>
                        <Input
                          value={option}
                          maxLength={200}
                          placeholder={`Option ${String.fromCharCode(65 + i)}`}
                          onChange={(e) => {
                            const next = [...questionForm.options];
                            next[i] = e.target.value;
                            setQuestionForm({ ...questionForm, options: next });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="hero" size="pill" className="flex-1" onClick={submitQuestion}>
                    {editingQuestionId ? "Save changes" : "Add question"}
                  </Button>
                  {editingQuestionId && (
                    <Button variant="ghost" size="pill" onClick={resetQuestionForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl bg-card shadow-card">
              {placementQuestions.length === 0 && (
                <p className="p-8 text-center text-sm text-muted-foreground">
                  No placement questions yet.
                </p>
              )}
              {placementQuestions.map((question, i) => (
                <div key={question.id} className="border-b border-border p-4 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-bold text-foreground">
                      {i + 1}. {question.q}
                    </p>
                    <div className="flex shrink-0 gap-1">
                      <Button variant="ghost" size="sm" onClick={() => editQuestion(question)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {question.options.map((option, oi) => (
                      <span
                        key={oi}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-medium",
                          oi === question.answer
                            ? "bg-success/15 text-success"
                            : "bg-secondary text-secondary-foreground",
                        )}
                      >
                        {option}
                      </span>
                    ))}
                  </div>
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
          <section className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <h2 className="text-base font-bold text-foreground">
                {editingBonusId ? "Edit bonus" : "Add bonus lesson"}
              </h2>
              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="bonus-title">Title</Label>
                  <Input
                    id="bonus-title"
                    value={bonus_item.title}
                    maxLength={120}
                    onChange={(e) => setBonus_item({ ...bonus_item, title: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="bonus-desc">Description</Label>
                  <Textarea
                    id="bonus-desc"
                    value={bonus_item.description}
                    maxLength={400}
                    rows={3}
                    onChange={(e) => setBonus_item({ ...bonus_item, description: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Source</Label>
                  <div className="mt-1.5 flex gap-2">
                    <Button
                      type="button"
                      variant={bonusMode === "youtube" ? "hero" : "soft"}
                      size="pill"
                      className="flex-1"
                      onClick={() => setBonusMode("youtube")}
                    >
                      Link
                    </Button>
                    <Button
                      type="button"
                      variant={bonusMode === "file" ? "hero" : "soft"}
                      size="pill"
                      className="flex-1"
                      onClick={() => setBonusMode("file")}
                    >
                      Upload file
                    </Button>
                  </div>
                </div>
                {bonusMode === "youtube" ? (
                  <div>
                    <Label htmlFor="bonus-url">Video URL</Label>
                    <Input
                      id="bonus-url"
                      value={bonus_item.url}
                      maxLength={500}
                      onChange={(e) => setBonus_item({ ...bonus_item, url: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="bonus-file">Video file</Label>
                    <Input
                      id="bonus-file"
                      type="file"
                      accept="video/*"
                      onChange={(e) => setBonusFile(e.target.files?.[0] ?? null)}
                      className="mt-1.5"
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">Larger files are compressed in your browser first, then uploaded.</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="hero"
                    size="pill"
                    className="flex-1"
                    disabled={uploadingBonus}
                    onClick={async () => {
                      if (!bonus_item.title.trim()) {
                        toast.error("Title is required");
                        return;
                      }
                      if (bonusMode === "youtube" && !bonus_item.url.trim()) {
                        toast.error("Video URL is required");
                        return;
                      }
                      if (bonusMode === "file" && !bonusFile && !editingBonusId) {
                        toast.error("Choose a video file to upload");
                        return;
                      }

                      setUploadingBonus(true);
                      setBonusCompressRatio(null);
                      try {
                        const url =
                          bonusMode === "file" && bonusFile
                            ? await uploadLessonVideo(bonusFile, "bonus", setBonusCompressRatio)
                            : bonus_item.url.trim();
                        const payload = { ...bonus_item, url, sourceType: bonusMode };
                        if (editingBonusId) {
                          await updateBonusLesson(editingBonusId, payload);
                          toast.success("Bonus lesson updated");
                        } else {
                          await addBonusLesson(payload);
                          toast.success("Bonus lesson added");
                        }
                        setBonus_item({ title: "", description: "", url: "" });
                        setBonusFile(null);
                        setBonusMode("youtube");
                        setEditingBonusId(null);
                        queryClient.invalidateQueries({ queryKey: ["bonus-lessons"] });
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Video upload failed");
                      } finally {
                        setUploadingBonus(false);
                        setBonusCompressRatio(null);
                      }
                    }}
                  >
                    {uploadingBonus
                      ? bonusCompressRatio !== null
                        ? `Compressing… ${Math.round(bonusCompressRatio * 100)}%`
                        : "Uploading…"
                      : editingBonusId
                        ? "Save changes"
                        : "Add bonus"}
                  </Button>
                  {editingBonusId && (
                    <Button
                      variant="ghost"
                      size="pill"
                      onClick={() => {
                        setBonus_item({ title: "", description: "", url: "" });
                        setBonusFile(null);
                        setBonusMode("youtube");
                        setEditingBonusId(null);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl bg-card shadow-card">
              {bonusLessons.length === 0 && (
                <p className="p-8 text-center text-sm text-muted-foreground">
                  No bonus lessons yet.
                </p>
              )}
              {bonusLessons.map((item) => (
                <div key={item.id} className="border-b border-border p-4 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingBonusId(item.id);
                          setBonus_item(item);
                          setBonusMode(item.sourceType === "file" ? "file" : "youtube");
                          setBonusFile(null);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          await deleteBonusLesson(item.id);
                          queryClient.invalidateQueries({ queryKey: ["bonus-lessons"] });
                          toast.success("Bonus lesson deleted");
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        </main>
      </div>
    </div>
  );
}
