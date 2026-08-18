import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ClipboardList,
  GraduationCap,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Users,
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
  addPlacementQuestion,
  addResource,
  deleteMockResult,
  deletePlacementQuestion,
  deleteResource,
  deleteUserProfile,
  listMockResults,
  listPlacementQuestions,
  listResources,
  listUsers,
  moveResource,
  updatePlacementQuestion,
  updateResource,
  uploadResourceFile,
} from "@/lib/db";
import type { Level, ResourceDoc } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel - IEA" },
      { name: "description", content: "Manage IEA students, resources and placement tests." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Panel - IEA" },
      { property: "og:description", content: "Internal management area for IEA administrators." },
    ],
  }),
  component: AdminPage,
});

type Tab = "overview" | "students" | "resources" | "placement" | "results";

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: Users },
  { id: "resources", label: "Resources", icon: Globe },
  { id: "placement", label: "Placement test", icon: ClipboardList },
  { id: "results", label: "Mock results", icon: GraduationCap },
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

const RESOURCE_TYPES: ResourceDoc["type"][] = ["official", "video", "book", "website", "app"];
const RESOURCE_SKILLS: ResourceDoc["skill"][] = ["all", "listening", "reading", "writing", "speaking"];

function AdminPage() {
  const { isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: listUsers });
  const { data: results = [] } = useQuery({
    queryKey: ["mock-results"],
    queryFn: listMockResults,
  });
  const { data: resources = [] } = useQuery({
    queryKey: ["resources"],
    queryFn: listResources,
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

  // Resource form state
  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    url: "",
    type: "website" as ResourceDoc["type"],
    skill: "all" as ResourceDoc["skill"],
    isFree: true,
    thumbnail: "",
  });
  const [resourceMode, setResourceMode] = useState<"link" | "file">("link");
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [uploadingResource, setUploadingResource] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);

  function resetResourceForm() {
    setResourceForm({ title: "", description: "", url: "", type: "website", skill: "all", isFree: true, thumbnail: "" });
    setResourceMode("link");
    setResourceFile(null);
    setEditingResourceId(null);
  }

  async function submitResource() {
    if (!resourceForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (resourceMode === "link" && !resourceForm.url.trim()) {
      toast.error("URL is required");
      return;
    }
    if (resourceMode === "file" && !resourceFile && !editingResourceId) {
      toast.error("Choose a file to upload");
      return;
    }

    setUploadingResource(true);
    try {
      let url = resourceForm.url.trim();
      if (resourceMode === "file" && resourceFile) {
        url = await uploadResourceFile(resourceFile);
      }
      const payload = {
        title: resourceForm.title.trim(),
        description: resourceForm.description.trim(),
        url,
        type: resourceForm.type,
        skill: resourceForm.skill,
        isFree: resourceForm.isFree,
        sourceType: resourceMode,
        thumbnail: resourceForm.thumbnail.trim(),
      };
      if (editingResourceId) {
        await updateResource(editingResourceId, payload);
        toast.success("Resource updated");
      } else {
        await addResource(payload);
        toast.success("Resource added");
      }
      resetResourceForm();
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploadingResource(false);
    }
  }

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/login" });
  }, [loading, isAdmin, navigate]);

  if (loading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Checking admin access...</p>
      </div>
    );
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
                  { label: "Resources", value: resources.length },
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
                  <ChartContainer
                    config={levelChartConfig}
                    className="mt-4 aspect-auto h-64 w-full"
                  >
                    <BarChart data={studentsByLevel} margin={{ left: -20 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="level"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={11}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        fontSize={11}
                      />
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
                  <ChartContainer
                    config={skillChartConfig}
                    className="mt-4 aspect-auto h-64 w-full"
                  >
                    <BarChart data={averageBySkill} margin={{ left: -20 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="skill"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        fontSize={11}
                      />
                      <YAxis tickLine={false} axisLine={false} domain={[0, 9]} fontSize={11} />
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      const authDeleted = await deleteUserProfile(student.uid);
                      queryClient.invalidateQueries({ queryKey: ["users"] });
                      toast.success("Student removed");
                      if (!authDeleted) {
                        toast.warning(
                          "The Firebase Auth account could not be removed (server key not configured).",
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

          {tab === "resources" && (
            <section className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
              <div className="rounded-3xl bg-card p-6 shadow-card">
                <h2 className="text-base font-bold text-foreground">
                  {editingResourceId ? "Edit resource" : "Add a resource"}
                </h2>
                <div className="mt-4 space-y-3">
                  <div>
                    <Label htmlFor="r-title">Title</Label>
                    <Input
                      id="r-title"
                      value={resourceForm.title}
                      maxLength={120}
                      onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="r-desc">Description</Label>
                    <Textarea
                      id="r-desc"
                      value={resourceForm.description}
                      maxLength={400}
                      rows={3}
                      onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Source</Label>
                    <div className="mt-1.5 flex gap-2">
                      <Button
                        type="button"
                        variant={resourceMode === "link" ? "hero" : "soft"}
                        size="pill"
                        className="flex-1"
                        onClick={() => setResourceMode("link")}
                      >
                        Link
                      </Button>
                      <Button
                        type="button"
                        variant={resourceMode === "file" ? "hero" : "soft"}
                        size="pill"
                        className="flex-1"
                        onClick={() => setResourceMode("file")}
                      >
                        Upload file
                      </Button>
                    </div>
                  </div>
                  {resourceMode === "link" ? (
                    <div>
                      <Label htmlFor="r-url">URL</Label>
                      <Input
                        id="r-url"
                        value={resourceForm.url}
                        maxLength={500}
                        placeholder="https://..."
                        onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="r-file">File</Label>
                      <Input
                        id="r-file"
                        type="file"
                        accept="*/*"
                        onChange={(e) => setResourceFile(e.target.files?.[0] ?? null)}
                        className="mt-1.5"
                      />
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Upload any file (PDF, image, document, etc.)
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="r-type">Type</Label>
                      <select
                        id="r-type"
                        value={resourceForm.type}
                        onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value as ResourceDoc["type"] })}
                        className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                      >
                        {RESOURCE_TYPES.map((t) => (
                          <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="r-skill">Skill</Label>
                      <select
                        id="r-skill"
                        value={resourceForm.skill}
                        onChange={(e) => setResourceForm({ ...resourceForm, skill: e.target.value as ResourceDoc["skill"] })}
                        className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                      >
                        {RESOURCE_SKILLS.map((s) => (
                          <option key={s} value={s}>{s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="r-thumb">Thumbnail URL (optional)</Label>
                    <Input
                      id="r-thumb"
                      value={resourceForm.thumbnail}
                      maxLength={500}
                      onChange={(e) => setResourceForm({ ...resourceForm, thumbnail: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="r-free"
                      type="checkbox"
                      checked={resourceForm.isFree}
                      onChange={(e) => setResourceForm({ ...resourceForm, isFree: e.target.checked })}
                      className="h-4 w-4 rounded"
                    />
                    <Label htmlFor="r-free">Free resource</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="hero"
                      size="pill"
                      className="flex-1"
                      onClick={submitResource}
                      disabled={uploadingResource}
                    >
                      {uploadingResource ? "Uploading..." : editingResourceId ? "Save changes" : "Add resource"}
                    </Button>
                    {editingResourceId && (
                      <Button variant="ghost" size="pill" onClick={resetResourceForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl bg-card shadow-card">
                {resources.length === 0 && (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    No resources yet.
                  </p>
                )}
                {resources.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border-b border-border p-4 last:border-0"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                      <div className="mt-1 flex gap-1.5">
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold">{item.type}</span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold">{item.skill}</span>
                        {item.isFree && <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">Free</span>}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={index === 0}
                        onClick={async () => {
                          await moveResource(item.id, "up");
                          queryClient.invalidateQueries({ queryKey: ["resources"] });
                        }}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={index === resources.length - 1}
                        onClick={async () => {
                          await moveResource(item.id, "down");
                          queryClient.invalidateQueries({ queryKey: ["resources"] });
                        }}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingResourceId(item.id);
                          setResourceForm({
                            title: item.title,
                            description: item.description,
                            url: item.url,
                            type: item.type,
                            skill: item.skill,
                            isFree: item.isFree,
                            thumbnail: item.thumbnail,
                          });
                          setResourceMode(item.sourceType === "file" ? "file" : "link");
                          setResourceFile(null);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          await deleteResource(item.id);
                          queryClient.invalidateQueries({ queryKey: ["resources"] });
                          toast.success("Resource deleted");
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
                    <Label>Options - click the letter to mark the correct one</Label>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
                <p className="p-8 text-center text-sm text-muted-foreground">
                  No mock results yet.
                </p>
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
                    L {result.listening} / R {result.reading} / W {result.writing} / S{" "}
                    {result.speaking}
                  </p>
                  <span className="text-lg font-extrabold text-foreground">
                    {result.overall.toFixed(1)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      queryClient.setQueryData(["mock-results"], (old: typeof results) =>
                        old.filter((r) => r.id !== result.id),
                      );
                      toast.success("Mock result deleted");
                      deleteMockResult(result.id, result.userId).catch(() => {
                        queryClient.invalidateQueries({ queryKey: ["mock-results"] });
                        toast.error("Failed to delete mock result");
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
