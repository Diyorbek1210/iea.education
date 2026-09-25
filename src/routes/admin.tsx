import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ClipboardList,
  Database,
  GraduationCap,
  Globe,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Users,
  XCircle,
  BookOpen,
  FileText,
  Target,
  MessageSquare,
  ThumbsUp,
  Shield,
  Send,
  Repeat2,
  Youtube,
  Captions,
  Loader2,
  Route as RouteIcon,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { Logo } from "@/components/Logo";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui/chart";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { useAuth } from "@/lib/auth";
import { ADMIN_EMAIL } from "@/shared/config/firebase";
import {
  addPlacementQuestion,
  addResource,
  addVocabWord,
  updateVocabWord,
  deleteVocabWord,
  addModelAnswer,
  updateModelAnswer,
  deleteModelAnswer,
  addCountryRequirement,
  updateCountryRequirement,
  deleteCountryRequirement,
  addUniversityRequirement,
  updateUniversityRequirement,
  deleteUniversityRequirement,
  listMockTests,
  addMockTest,
  deleteMockTest,
  deleteMockResult,
  deletePlacementQuestion,
  deleteResource,
  deleteUserProfile,
  listMockResults,
  listPlacementQuestions,
  listResources,
  listUsers,
  listVocabulary,
  listModelAnswers,
  listCountryRequirements,
  listUniversityRequirements,
  moveResource,
  updatePlacementQuestion,
  updateResource,
  uploadResourceFile,
  seedAllDataToFirestore,
  listLearningSteps,
  addLearningStep,
  updateLearningStep,
  deleteLearningStep,
  moveLearningStep,
  listShadowingClips,
  addShadowingClip,
  updateShadowingClip,
  deleteShadowingClip,
  uploadShadowingFile,
  listCommunityThreads,
  addCommunityReply,
  deleteCommunityThread as deleteCommunityThreadFromDb,
  deleteCommunityReply as deleteCommunityReplyFromDb,
  type SeedProgress,
} from "@/lib/db";
import type {
  CommunityReply,
  CommunityThread,
  Level,
  ResourceDoc,
  LearningPathStepDoc,
  ShadowingClip,
  ShadowingSegment,
  ThreadCategory,
} from "@/shared/types/types";
import { extractYouTubeTranscript, extractYouTubeVideoId } from "@/lib/shadowing";
import type {
  VocabWordDoc,
  ModelAnswerDoc,
  CountryRequirementDoc,
  UniversityRequirementDoc,
} from "@/lib/db";
import type { MockTestSet } from "@/shared/data/mockTest";
import { TECH, TECH_KEYS } from "@/shared/data/learningPath";
import { cn } from "@/shared/lib/utils";

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

type Tab =
  | "overview"
  | "students"
  | "resources"
  | "learning-path"
  | "placement"
  | "results"
  | "vocabulary"
  | "model-answers"
  | "requirements"
  | "mock-tests"
  | "community"
  | "shadowing"
  | "seed";

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: Users },
  { id: "mock-tests", label: "Mock Tests", icon: ClipboardList },
  { id: "results", label: "Mock results", icon: GraduationCap },
  { id: "placement", label: "Placement test", icon: ClipboardList },
  { id: "resources", label: "Resources", icon: Globe },
  { id: "learning-path", label: "Learning Path", icon: RouteIcon },
  { id: "vocabulary", label: "Vocabulary", icon: BookOpen },
  { id: "model-answers", label: "Model Answers", icon: FileText },
  { id: "requirements", label: "Requirements", icon: Target },
  { id: "community", label: "Community", icon: MessageSquare },
  { id: "shadowing", label: "Shadowing", icon: Repeat2 },
  { id: "seed", label: "Seed Data", icon: Database },
];

const navSections: { label: string; items: { id: Tab; label: string; icon: typeof Users }[] }[] = [
  { label: "Overview", items: [tabs[0]!] },
  {
    label: "Learners",
    items: ["students", "mock-tests", "results", "placement"].map(
      (id) => tabs.find((t) => t.id === id)!,
    ),
  },
  {
    label: "Learning content",
    items: ["learning-path", "resources", "vocabulary", "model-answers", "requirements", "shadowing"].map(
      (id) => tabs.find((t) => t.id === id)!,
    ),
  },
  { label: "Community", items: ["community"].map((id) => tabs.find((t) => t.id === id)!) },
  { label: "System", items: ["seed"].map((id) => tabs.find((t) => t.id === id)!) },
];

function AdminSidebar({
  tab,
  onSelect,
  onSignOut,
}: {
  tab: Tab;
  onSelect: (tab: Tab) => void;
  onSignOut: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 pt-5">
        <Logo compact />
        <div className="min-w-0">
          <p className="truncate text-[12px] font-black uppercase tracking-widest text-ink">
            IEA Admin
          </p>
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-ink-faint">
            Control panel
          </p>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-6 overflow-y-auto px-3" aria-label="Admin sections">
        {navSections.map((group) => (
          <div key={group.label}>
            <p className="px-2 text-[9px] font-black uppercase tracking-[0.3em] text-ink-faint">
              {group.label}
            </p>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-300",
                      active
                        ? "bg-brand-700 text-white shadow-brand"
                        : "text-slate-500 hover:bg-brand-50 hover:text-brand-700",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
                        active
                          ? "bg-white/15 text-white"
                          : "bg-slate-100 text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-600",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="truncate text-[11px] font-bold tracking-wide">
                      {item.label}
                    </span>
                    {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-white/70" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200/70 p-3">
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-[11px] font-bold tracking-wide text-rose-500 transition-all duration-300 hover:bg-rose-50"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
            <LogOut className="h-4 w-4" />
          </span>
          Sign out
        </button>
      </div>
    </div>
  );
}

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
const RESOURCE_SKILLS: ResourceDoc["skill"][] = [
  "all",
  "listening",
  "reading",
  "writing",
  "speaking",
];

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon?: typeof Users | undefined;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {Icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <Icon className="h-4 w-4" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <h2 className="text-[12px] font-black uppercase tracking-widest text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[11px] font-medium text-ink-faint">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Panel({
  title,
  icon,
  subtitle,
  action,
  children,
  className,
  contentClassName,
}: {
  title: ReactNode;
  icon?: typeof Users | undefined;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={cn("rounded-4xl border border-line bg-white shadow-soft", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
        <SectionTitle icon={icon} title={title} subtitle={subtitle} />
        {action}
      </header>
      <div className={cn("p-5 sm:p-6", contentClassName)}>{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <Label className="text-[10px] font-black uppercase tracking-widest text-ink-soft">
        {label}
      </Label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-[11px] font-medium text-ink-faint">{hint}</p>}
    </div>
  );
}

function AdminPage() {
  const { isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: listUsers });
  const { data: results = [] } = useQuery({
    queryKey: ["mock-results"],
    queryFn: listMockResults,
  });
  const { data: resources = [] } = useQuery({
    queryKey: ["resources"],
    queryFn: listResources,
  });
  const { data: learningSteps = [] } = useQuery({
    queryKey: ["learning-steps"],
    queryFn: listLearningSteps,
  });
  const { data: placementQuestions = [] } = useQuery({
    queryKey: ["placement-questions"],
    queryFn: listPlacementQuestions,
  });
  const { data: vocabWords = [] } = useQuery({
    queryKey: ["vocabulary"],
    queryFn: listVocabulary,
  });
  const { data: modelAnswers = [] } = useQuery({
    queryKey: ["model-answers"],
    queryFn: listModelAnswers,
  });
  const { data: countryReqs = [] } = useQuery({
    queryKey: ["country-requirements"],
    queryFn: listCountryRequirements,
  });
  const { data: uniReqs = [] } = useQuery({
    queryKey: ["university-requirements"],
    queryFn: listUniversityRequirements,
  });
  const { data: mockTests = [] } = useQuery({
    queryKey: ["mock-tests"],
    queryFn: listMockTests,
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
    setResourceForm({
      title: "",
      description: "",
      url: "",
      type: "website",
      skill: "all",
      isFree: true,
      thumbnail: "",
    });
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

  // Learning path form state
  const emptyLearningStep = {
    title: "",
    description: "",
    lessons: 3,
    minutes: 60,
    tech: [] as string[],
    finish: false,
  };
  const [learningStepForm, setLearningStepForm] = useState(emptyLearningStep);
  const [editingLearningStepId, setEditingLearningStepId] = useState<string | null>(null);

  function editLearningStep(s: LearningPathStepDoc) {
    setEditingLearningStepId(s.id);
    setLearningStepForm({
      title: s.title,
      description: s.description,
      lessons: s.lessons,
      minutes: s.minutes,
      tech: [...s.tech],
      finish: !!s.finish,
    });
  }

  function resetLearningStepForm() {
    setLearningStepForm(emptyLearningStep);
    setEditingLearningStepId(null);
  }

  async function submitLearningStep() {
    if (!learningStepForm.title.trim() || !learningStepForm.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    const payload = {
      title: learningStepForm.title.trim(),
      description: learningStepForm.description.trim(),
      lessons: Math.max(1, learningStepForm.lessons),
      minutes: Math.max(1, learningStepForm.minutes),
      tech: learningStepForm.tech,
      finish: learningStepForm.finish,
    };
    if (editingLearningStepId) {
      await updateLearningStep(editingLearningStepId, payload);
      toast.success("Step updated");
    } else {
      await addLearningStep(payload);
      toast.success("Step added");
    }
    resetLearningStepForm();
    queryClient.invalidateQueries({ queryKey: ["learning-steps"] });
  }

  async function removeLearningStep(id: string) {
    await deleteLearningStep(id);
    if (editingLearningStepId === id) resetLearningStepForm();
    queryClient.invalidateQueries({ queryKey: ["learning-steps"] });
    toast.success("Step deleted");
  }

  function toggleLearningStepTech(key: string) {
    setLearningStepForm((prev) => ({
      ...prev,
      tech: prev.tech.includes(key) ? prev.tech.filter((t) => t !== key) : [...prev.tech, key],
    }));
  }

  // Vocabulary form state
  const emptyVocab = {
    word: "",
    definition: "",
    example: "",
    synonym: "",
    antonym: "",
    topic: "education" as VocabWordDoc["topic"],
    difficulty: "beginner" as VocabWordDoc["difficulty"],
    ieltsFrequency: "medium" as VocabWordDoc["ieltsFrequency"],
  };
  const [vocabForm, setVocabForm] = useState(emptyVocab);
  const [editingVocabId, setEditingVocabId] = useState<string | null>(null);

  function editVocabWord(w: VocabWordDoc) {
    setEditingVocabId(w.id);
    setVocabForm({
      word: w.word,
      definition: w.definition,
      example: w.example,
      synonym: w.synonym,
      antonym: w.antonym,
      topic: w.topic,
      difficulty: w.difficulty,
      ieltsFrequency: w.ieltsFrequency,
    });
  }

  function resetVocabForm() {
    setVocabForm(emptyVocab);
    setEditingVocabId(null);
  }

  async function submitVocabWord() {
    if (!vocabForm.word.trim() || !vocabForm.definition.trim()) {
      toast.error("Word and definition are required");
      return;
    }
    if (editingVocabId) {
      await updateVocabWord(editingVocabId, vocabForm);
      toast.success("Vocabulary updated");
    } else {
      await addVocabWord(vocabForm);
      toast.success("Vocabulary added");
    }
    resetVocabForm();
    queryClient.invalidateQueries({ queryKey: ["vocabulary"] });
  }

  async function removeVocabWord(id: string) {
    await deleteVocabWord(id);
    if (editingVocabId === id) resetVocabForm();
    queryClient.invalidateQueries({ queryKey: ["vocabulary"] });
    toast.success("Vocabulary deleted");
  }

  // Model Answer form state
  const emptyModelAnswer = {
    title: "",
    category: "",
    skill: "writing" as ModelAnswerDoc["skill"],
    band: 7,
    prompt: "",
    answer: "",
    criteria: [] as ModelAnswerDoc["criteria"],
    tips: [""],
  };
  const [modelAnswerForm, setModelAnswerForm] = useState(emptyModelAnswer);
  const [editingModelAnswerId, setEditingModelAnswerId] = useState<string | null>(null);

  function editModelAnswer(a: ModelAnswerDoc) {
    setEditingModelAnswerId(a.id);
    setModelAnswerForm({
      title: a.title,
      category: a.category,
      skill: a.skill,
      band: a.band,
      prompt: a.prompt,
      answer: a.answer,
      criteria: a.criteria,
      tips: a.tips,
    });
  }

  function resetModelAnswerForm() {
    setModelAnswerForm(emptyModelAnswer);
    setEditingModelAnswerId(null);
  }

  async function submitModelAnswer() {
    if (!modelAnswerForm.title.trim() || !modelAnswerForm.prompt.trim()) {
      toast.error("Title and prompt are required");
      return;
    }
    const payload = { ...modelAnswerForm, tips: modelAnswerForm.tips.filter((t) => t.trim()) };
    if (editingModelAnswerId) {
      await updateModelAnswer(editingModelAnswerId, payload);
      toast.success("Model answer updated");
    } else {
      await addModelAnswer(payload);
      toast.success("Model answer added");
    }
    resetModelAnswerForm();
    queryClient.invalidateQueries({ queryKey: ["model-answers"] });
  }

  async function removeModelAnswer(id: string) {
    await deleteModelAnswer(id);
    if (editingModelAnswerId === id) resetModelAnswerForm();
    queryClient.invalidateQueries({ queryKey: ["model-answers"] });
    toast.success("Model answer deleted");
  }

  // Country requirement form state
  const emptyCountryReq = {
    country: "",
    flag: "",
    purpose: "",
    overallBand: 5.5,
    minPerSkill: 5.0,
    notes: "",
  };
  const [countryReqForm, setCountryReqForm] = useState(emptyCountryReq);
  const [editingCountryReqId, setEditingCountryReqId] = useState<string | null>(null);

  function editCountryReq(r: CountryRequirementDoc) {
    setEditingCountryReqId(r.id);
    setCountryReqForm({
      country: r.country,
      flag: r.flag,
      purpose: r.purpose,
      overallBand: r.overallBand,
      minPerSkill: r.minPerSkill,
      notes: r.notes,
    });
  }

  function resetCountryReqForm() {
    setCountryReqForm(emptyCountryReq);
    setEditingCountryReqId(null);
  }

  async function submitCountryReq() {
    if (!countryReqForm.country.trim()) {
      toast.error("Country is required");
      return;
    }
    if (editingCountryReqId) {
      await updateCountryRequirement(editingCountryReqId, countryReqForm);
      toast.success("Country requirement updated");
    } else {
      await addCountryRequirement(countryReqForm);
      toast.success("Country requirement added");
    }
    resetCountryReqForm();
    queryClient.invalidateQueries({ queryKey: ["country-requirements"] });
  }

  async function removeCountryReq(id: string) {
    await deleteCountryRequirement(id);
    if (editingCountryReqId === id) resetCountryReqForm();
    queryClient.invalidateQueries({ queryKey: ["country-requirements"] });
    toast.success("Country requirement deleted");
  }

  // University requirement form state
  const emptyUniReq = {
    university: "",
    country: "",
    program: "All Programs",
    overallBand: 6.5,
    minWriting: 6.0,
    minSpeaking: 6.0,
    url: "",
  };
  const [uniReqForm, setUniReqForm] = useState(emptyUniReq);
  const [editingUniReqId, setEditingUniReqId] = useState<string | null>(null);

  function editUniReq(r: UniversityRequirementDoc) {
    setEditingUniReqId(r.id);
    setUniReqForm({
      university: r.university,
      country: r.country,
      program: r.program,
      overallBand: r.overallBand,
      minWriting: r.minWriting,
      minSpeaking: r.minSpeaking,
      url: r.url,
    });
  }

  function resetUniReqForm() {
    setUniReqForm(emptyUniReq);
    setEditingUniReqId(null);
  }

  async function submitUniReq() {
    if (!uniReqForm.university.trim()) {
      toast.error("University name is required");
      return;
    }
    if (editingUniReqId) {
      await updateUniversityRequirement(editingUniReqId, uniReqForm);
      toast.success("University requirement updated");
    } else {
      await addUniversityRequirement(uniReqForm);
      toast.success("University requirement added");
    }
    resetUniReqForm();
    queryClient.invalidateQueries({ queryKey: ["university-requirements"] });
  }

  async function removeUniReq(id: string) {
    await deleteUniversityRequirement(id);
    if (editingUniReqId === id) resetUniReqForm();
    queryClient.invalidateQueries({ queryKey: ["university-requirements"] });
    toast.success("University requirement deleted");
  }

  // Mock test form state
  const emptyMockForm = {
    id: "",
    order: mockTests.length + 1,
    title: "",
    writing: { task1: "", task2: "" },
    speaking: [] as {
      part: 1 | 2 | 3;
      prompt: string;
      prepSeconds: number;
      answerSeconds: number;
    }[],
    readingPassages: [] as {
      title: string;
      passage: string;
      questions: { q: string; options: string[]; answer: number }[];
    }[],
    listeningSections: [] as {
      title: string;
      transcript: string;
      questions: { q: string; accepted: string[] }[];
    }[],
  };
  const [mockForm, setMockForm] = useState(emptyMockForm);
  const [editingMockId, setEditingMockId] = useState<string | null>(null);

  function editMockTest(m: MockTestSet) {
    setEditingMockId(m.id);
    setMockForm({
      id: m.id,
      order: m.order,
      title: m.title,
      writing: { task1: m.writing.task1, task2: m.writing.task2 },
      speaking: m.speaking.map((s) => ({ ...s })),
      readingPassages: m.reading.passages.map((p) => ({
        title: p.title,
        passage: p.passage,
        questions: p.questions.map((q) => ({ q: q.q, options: [...q.options], answer: q.answer })),
      })),
      listeningSections: m.listening.sections.map((s) => ({
        title: s.title,
        transcript: s.transcript,
        questions: s.questions.map((q) => ({ q: q.q, accepted: [...q.accepted] })),
      })),
    });
  }

  function resetMockForm() {
    setMockForm(emptyMockForm);
    setEditingMockId(null);
  }

  async function submitMockTest() {
    if (!mockForm.id.trim() || !mockForm.title.trim()) {
      toast.error("ID and title are required");
      return;
    }
    const payload: MockTestSet = {
      id: mockForm.id.trim(),
      order: mockForm.order,
      title: mockForm.title.trim(),
      reading: { passages: mockForm.readingPassages },
      listening: { sections: mockForm.listeningSections },
      writing: mockForm.writing,
      speaking: mockForm.speaking,
    };
    if (editingMockId) {
      await addMockTest(payload);
      toast.success("Mock test updated");
    } else {
      await addMockTest(payload);
      toast.success("Mock test added");
    }
    resetMockForm();
    queryClient.invalidateQueries({ queryKey: ["mock-tests"] });
  }

  // Reading passage helpers
  function addReadingPassage() {
    setMockForm({
      ...mockForm,
      readingPassages: [...mockForm.readingPassages, { title: "", passage: "", questions: [] }],
    });
  }
  function updateReadingPassage(
    i: number,
    data: Partial<(typeof mockForm.readingPassages)[number]>,
  ) {
    const next = [...mockForm.readingPassages];
    next[i] = { ...next[i], ...data } as (typeof mockForm.readingPassages)[number];
    setMockForm({ ...mockForm, readingPassages: next });
  }
  function removeReadingPassage(i: number) {
    setMockForm({
      ...mockForm,
      readingPassages: mockForm.readingPassages.filter((_, idx) => idx !== i),
    });
  }
  function addReadingQuestion(pi: number) {
    const next = [...mockForm.readingPassages];
    next[pi]!.questions.push({ q: "", options: ["", "", "", ""], answer: 0 });
    setMockForm({ ...mockForm, readingPassages: next });
  }
  function updateReadingQuestion(
    pi: number,
    qi: number,
    data: Partial<(typeof mockForm.readingPassages)[number]["questions"][number]>,
  ) {
    const next = [...mockForm.readingPassages];
    next[pi]!.questions[qi] = {
      ...next[pi]!.questions[qi]!,
      ...data,
    } as (typeof mockForm.readingPassages)[number]["questions"][number];
    setMockForm({ ...mockForm, readingPassages: next });
  }
  function removeReadingQuestion(pi: number, qi: number) {
    const next = [...mockForm.readingPassages];
    next[pi]!.questions = next[pi]!.questions.filter((_, idx) => idx !== qi);
    setMockForm({ ...mockForm, readingPassages: next });
  }

  // Listening section helpers
  function addListeningSection() {
    setMockForm({
      ...mockForm,
      listeningSections: [
        ...mockForm.listeningSections,
        { title: "", transcript: "", questions: [] },
      ],
    });
  }
  function updateListeningSection(
    i: number,
    data: Partial<(typeof mockForm.listeningSections)[number]>,
  ) {
    const next = [...mockForm.listeningSections];
    next[i] = { ...next[i], ...data } as (typeof mockForm.listeningSections)[number];
    setMockForm({ ...mockForm, listeningSections: next });
  }
  function removeListeningSection(i: number) {
    setMockForm({
      ...mockForm,
      listeningSections: mockForm.listeningSections.filter((_, idx) => idx !== i),
    });
  }
  function addListeningQuestion(si: number) {
    const next = [...mockForm.listeningSections];
    next[si]!.questions.push({ q: "", accepted: [""] });
    setMockForm({ ...mockForm, listeningSections: next });
  }
  function updateListeningQuestion(
    si: number,
    qi: number,
    data: Partial<(typeof mockForm.listeningSections)[number]["questions"][number]>,
  ) {
    const next = [...mockForm.listeningSections];
    next[si]!.questions[qi] = {
      ...next[si]!.questions[qi]!,
      ...data,
    } as (typeof mockForm.listeningSections)[number]["questions"][number];
    setMockForm({ ...mockForm, listeningSections: next });
  }
  function removeListeningQuestion(si: number, qi: number) {
    const next = [...mockForm.listeningSections];
    next[si]!.questions = next[si]!.questions.filter((_, idx) => idx !== qi);
    setMockForm({ ...mockForm, listeningSections: next });
  }

  // Speaking helpers
  function addSpeakingQuestion(part: 1 | 2 | 3) {
    setMockForm({
      ...mockForm,
      speaking: [
        ...mockForm.speaking,
        {
          part,
          prompt: "",
          prepSeconds: part === 2 ? 60 : 0,
          answerSeconds: part === 2 ? 120 : part === 3 ? 40 : 30,
        },
      ],
    });
  }
  function updateSpeakingQuestion(i: number, data: Partial<(typeof mockForm.speaking)[number]>) {
    const next = [...mockForm.speaking];
    next[i] = { ...next[i], ...data } as (typeof mockForm.speaking)[number];
    setMockForm({ ...mockForm, speaking: next });
  }
  function removeSpeakingQuestion(i: number) {
    setMockForm({ ...mockForm, speaking: mockForm.speaking.filter((_, idx) => idx !== i) });
  }

  async function removeMockTest(id: string) {
    await deleteMockTest(id);
    queryClient.invalidateQueries({ queryKey: ["mock-tests"] });
    toast.success("Mock test deleted");
  }

  // Community state
  const { data: communityThreads = [], isLoading: communityLoading } = useQuery({
    queryKey: ["admin-community-threads"],
    queryFn: listCommunityThreads,
  });
  const [communityTab, setCommunityTab] = useState<"all" | ThreadCategory>("all");
  const [communityReplyText, setCommunityReplyText] = useState("");
  const [selectedCommunityThread, setSelectedCommunityThread] = useState<CommunityThread | null>(
    null,
  );

  const filteredCommunityThreads =
    communityTab === "all"
      ? communityThreads
      : communityThreads.filter((t) => t.category === communityTab);

  async function deleteCommunityThread(id: string) {
    if (!confirm("Delete this thread permanently?")) return;
    try {
      await deleteCommunityThreadFromDb(id);
      if (selectedCommunityThread?.id === id) setSelectedCommunityThread(null);
      queryClient.invalidateQueries({ queryKey: ["admin-community-threads"] });
      toast.success("Thread deleted");
    } catch {
      toast.error("Failed to delete thread.");
    }
  }

  async function deleteCommunityReply(threadId: string, replyId: string) {
    if (!confirm("Delete this reply permanently?")) return;
    try {
      await deleteCommunityReplyFromDb(threadId, replyId);
      queryClient.invalidateQueries({ queryKey: ["admin-community-threads"] });
      toast.success("Reply deleted");
    } catch {
      toast.error("Failed to delete reply.");
    }
  }

  async function handleCommunityReply() {
    if (!selectedCommunityThread || !communityReplyText.trim()) return;
    try {
      await addCommunityReply(selectedCommunityThread.id, {
        author: "Admin",
        authorEmail: ADMIN_EMAIL,
        content: communityReplyText.trim(),
      });
      setCommunityReplyText("");
      queryClient.invalidateQueries({ queryKey: ["admin-community-threads"] });
      toast.success("Reply posted");
    } catch {
      toast.error("Failed to post reply.");
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
    <div className="flex min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-slate-200/70 bg-white md:flex">
        <AdminSidebar
          tab={tab}
          onSelect={setTab}
          onSignOut={async () => {
            await signOut();
            navigate({ to: "/", replace: true });
          }}
        />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-brand-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-[280px] bg-white shadow-lift transition-transform duration-300 md:hidden",
          menuOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Mobile menu"
      >
        <AdminSidebar
          tab={tab}
          onSelect={(next) => {
            setTab(next);
            setMenuOpen(false);
          }}
          onSignOut={async () => {
            setMenuOpen(false);
            await signOut();
            navigate({ to: "/", replace: true });
          }}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/70 bg-white/85 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <Link to="/" className="flex items-center gap-2 md:hidden">
            <Logo compact />
          </Link>
          <span className="hidden shrink-0 items-center rounded-full bg-brand-700 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-brand sm:inline-flex">
            Admin Panel
          </span>
          <span className="hidden text-[10px] font-black uppercase tracking-widest text-ink-faint md:inline-flex">
            / {tabs.find((t) => t.id === tab)?.label}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                await signOut();
                navigate({ to: "/", replace: true });
              }}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>

        <div className="min-w-0 flex-1">
          <main className="mx-auto w-full max-w-6xl animate-fade-up px-4 py-6 sm:px-6 sm:py-8">
          {tab === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Students", value: users.length },
                  { label: "Resources", value: resources.length },
                  { label: "Mock attempts", value: results.length },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="animate-fade-up rounded-3xl border border-line bg-white p-6 shadow-soft"
                  >
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-ink-faint">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-black tracking-tighter text-ink">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="animate-fade-up rounded-3xl border border-line bg-white p-6 shadow-soft [animation-delay:60ms]">
                  <h2 className="text-sm font-black uppercase tracking-tight text-ink">
                    Students by level
                  </h2>
                  <p className="mt-1 text-xs font-medium text-ink-soft">
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

                <div className="animate-fade-up rounded-3xl border border-line bg-white p-6 shadow-soft [animation-delay:100ms]">
                  <h2 className="text-sm font-black uppercase tracking-tight text-ink">
                    Average band by skill
                  </h2>
                  <p className="mt-1 text-xs font-medium text-ink-soft">
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
            <section className="animate-fade-up overflow-hidden rounded-4xl border border-line bg-white shadow-soft">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-black uppercase tracking-tight text-ink">Students</h2>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint">
                  {users.length} registered
                </p>
              </div>
              {users.length === 0 && (
                <p className="p-8 text-center text-sm text-muted-foreground">
                  No students registered yet.
                </p>
              )}
              <div className="divide-y divide-slate-100">
                {users.map((student) => (
                  <div
                    key={student.uid}
                    className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50/60"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-[12px] font-black uppercase text-brand-700">
                      {student.name
                        .trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join("") || "?"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">{student.name}</p>
                      <p className="truncate text-xs font-medium text-ink-soft">{student.email}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
                      {student.level}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
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
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "resources" && (
            <section className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
              <div className="rounded-4xl border border-line bg-white p-6 shadow-soft">
                <SectionTitle
                  icon={Globe}
                  title={editingResourceId ? "Edit resource" : "Add a resource"}
                  subtitle="Share links or upload files students can open and study from."
                />
                <div className="mt-5 space-y-4">
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
                      onChange={(e) =>
                        setResourceForm({ ...resourceForm, description: e.target.value })
                      }
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
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            type: e.target.value as ResourceDoc["type"],
                          })
                        }
                        className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                      >
                        {RESOURCE_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="r-skill">Skill</Label>
                      <select
                        id="r-skill"
                        value={resourceForm.skill}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            skill: e.target.value as ResourceDoc["skill"],
                          })
                        }
                        className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                      >
                        {RESOURCE_SKILLS.map((s) => (
                          <option key={s} value={s}>
                            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
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
                      onChange={(e) =>
                        setResourceForm({ ...resourceForm, thumbnail: e.target.value })
                      }
                      className="mt-1.5"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="r-free"
                      type="checkbox"
                      checked={resourceForm.isFree}
                      onChange={(e) =>
                        setResourceForm({ ...resourceForm, isFree: e.target.checked })
                      }
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
                      {uploadingResource
                        ? "Uploading..."
                        : editingResourceId
                          ? "Save changes"
                          : "Add resource"}
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
                  <p className="p-8 text-center text-sm text-muted-foreground">No resources yet.</p>
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
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold">
                          {item.type}
                        </span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold">
                          {item.skill}
                        </span>
                        {item.isFree && (
                          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                            Free
                          </span>
                        )}
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

          {tab === "learning-path" && (
            <section className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
              <div className="rounded-4xl border border-line bg-white p-6 shadow-soft">
                <SectionTitle
                  icon={RouteIcon}
                  title={editingLearningStepId ? "Edit step" : "Add a learning step"}
                  subtitle="Steps appear as modules on the student Learning Path page."
                />
                <div className="mt-5 space-y-4">
                  <div>
                    <Label htmlFor="lp-title">Title</Label>
                    <Input
                      id="lp-title"
                      value={learningStepForm.title}
                      maxLength={120}
                      onChange={(e) =>
                        setLearningStepForm({ ...learningStepForm, title: e.target.value })
                      }
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lp-desc">Description</Label>
                    <Textarea
                      id="lp-desc"
                      value={learningStepForm.description}
                      maxLength={400}
                      rows={3}
                      onChange={(e) =>
                        setLearningStepForm({ ...learningStepForm, description: e.target.value })
                      }
                      className="mt-1.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="lp-lessons">Lessons</Label>
                      <Input
                        id="lp-lessons"
                        type="number"
                        min={1}
                        value={learningStepForm.lessons}
                        onChange={(e) =>
                          setLearningStepForm({
                            ...learningStepForm,
                            lessons: Number(e.target.value),
                          })
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lp-minutes">Minutes</Label>
                      <Input
                        id="lp-minutes"
                        type="number"
                        min={1}
                        value={learningStepForm.minutes}
                        onChange={(e) =>
                          setLearningStepForm({
                            ...learningStepForm,
                            minutes: Number(e.target.value),
                          })
                        }
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Skills / tags</Label>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {TECH_KEYS.map((key) => {
                        const tech = TECH[key];
                        if (!tech) return null;
                        const active = learningStepForm.tech.includes(key);
                        const Icon = tech.icon;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => toggleLearningStepTech(key)}
                            className={cn(
                              "flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
                              active
                                ? "bg-brand-700 text-white shadow-brand"
                                : "bg-secondary text-secondary-foreground hover:bg-brand-50",
                            )}
                          >
                            <Icon
                              className="h-3.5 w-3.5"
                              style={{ color: active ? "#fff" : tech.color }}
                            />
                            {tech.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="lp-finish"
                      type="checkbox"
                      checked={learningStepForm.finish}
                      onChange={(e) =>
                        setLearningStepForm({ ...learningStepForm, finish: e.target.checked })
                      }
                      className="h-4 w-4 rounded"
                    />
                    <Label htmlFor="lp-finish">Finish milestone (gold crown)</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="hero"
                      size="pill"
                      className="flex-1"
                      onClick={submitLearningStep}
                    >
                      {editingLearningStepId ? "Save changes" : "Add step"}
                    </Button>
                    {editingLearningStepId && (
                      <Button variant="ghost" size="pill" onClick={resetLearningStepForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl bg-card shadow-card">
                {learningSteps.length === 0 && (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    No steps yet. Add the first module.
                  </p>
                )}
                {learningSteps.map((item, index) => (
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
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold">
                          {item.lessons} lessons
                        </span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold">
                          {item.minutes} min
                        </span>
                        {item.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold"
                          >
                            {t}
                          </span>
                        ))}
                        {item.finish && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            Finish
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={index === 0}
                        onClick={async () => {
                          await moveLearningStep(item.id, "up");
                          queryClient.invalidateQueries({ queryKey: ["learning-steps"] });
                        }}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={index === learningSteps.length - 1}
                        onClick={async () => {
                          await moveLearningStep(item.id, "down");
                          queryClient.invalidateQueries({ queryKey: ["learning-steps"] });
                        }}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => editLearningStep(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          await deleteLearningStep(item.id);
                          queryClient.invalidateQueries({ queryKey: ["learning-steps"] });
                          toast.success("Step deleted");
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
              <div className="rounded-4xl border border-line bg-white p-6 shadow-soft">
                <SectionTitle
                  icon={ClipboardList}
                  title={editingQuestionId ? "Edit question" : "Add a placement question"}
                  subtitle="Write the question, add 4 options and mark the correct answer."
                />
                <div className="mt-5 space-y-4">
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
                      deleteMockResult(result.id, result.userId)
                        .then(() => {
                          queryClient.invalidateQueries({ queryKey: ["user-profile"] });
                        })
                        .catch(() => {
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

          {tab === "vocabulary" && (
            <section className="mt-6 space-y-6">
              <div className="rounded-3xl bg-card p-6 shadow-card">
                <h2 className="text-base font-bold text-foreground">
                  {editingVocabId ? "Edit Vocabulary Word" : "Add Vocabulary Word"}
                </h2>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Word</Label>
                      <Input
                        className="mt-1.5"
                        value={vocabForm.word}
                        onChange={(e) => setVocabForm({ ...vocabForm, word: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Synonym</Label>
                      <Input
                        className="mt-1.5"
                        value={vocabForm.synonym}
                        onChange={(e) => setVocabForm({ ...vocabForm, synonym: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Definition</Label>
                    <Textarea
                      className="mt-1.5"
                      rows={2}
                      value={vocabForm.definition}
                      onChange={(e) => setVocabForm({ ...vocabForm, definition: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Example sentence</Label>
                    <Textarea
                      className="mt-1.5"
                      rows={2}
                      value={vocabForm.example}
                      onChange={(e) => setVocabForm({ ...vocabForm, example: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Antonym</Label>
                      <Input
                        className="mt-1.5"
                        value={vocabForm.antonym}
                        onChange={(e) => setVocabForm({ ...vocabForm, antonym: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Topic</Label>
                      <Select
                        value={vocabForm.topic}
                        onValueChange={(v) =>
                          setVocabForm({ ...vocabForm, topic: v as VocabWordDoc["topic"] })
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "education",
                            "environment",
                            "technology",
                            "health",
                            "society",
                            "economy",
                            "crime",
                            "transport",
                            "media",
                            "government",
                            "work",
                            "family",
                          ].map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Difficulty</Label>
                      <Select
                        value={vocabForm.difficulty}
                        onValueChange={(v) =>
                          setVocabForm({
                            ...vocabForm,
                            difficulty: v as VocabWordDoc["difficulty"],
                          })
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>IELTS Frequency</Label>
                    <Select
                      value={vocabForm.ieltsFrequency}
                      onValueChange={(v) =>
                        setVocabForm({
                          ...vocabForm,
                          ieltsFrequency: v as VocabWordDoc["ieltsFrequency"],
                        })
                      }
                    >
                      <SelectTrigger className="mt-1.5 w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="hero" size="pill" className="flex-1" onClick={submitVocabWord}>
                      {editingVocabId ? "Save changes" : "Add word"}
                    </Button>
                    {editingVocabId && (
                      <Button variant="ghost" size="pill" onClick={resetVocabForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl bg-card shadow-card">
                {vocabWords.length === 0 && (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    No vocabulary words yet.
                  </p>
                )}
                {vocabWords.map((w) => (
                  <div key={w.id} className="border-b border-border p-4 last:border-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground">{w.word}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{w.definition}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                            {w.topic}
                          </span>
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                            {w.difficulty}
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[11px] font-medium",
                              w.ieltsFrequency === "high"
                                ? "bg-success/15 text-success"
                                : w.ieltsFrequency === "medium"
                                  ? "bg-warning/15 text-warning"
                                  : "bg-muted text-muted-foreground",
                            )}
                          >
                            {w.ieltsFrequency} freq
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" size="sm" onClick={() => editVocabWord(w)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeVocabWord(w.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "model-answers" && (
            <section className="mt-6 space-y-6">
              <div className="rounded-3xl bg-card p-6 shadow-card">
                <h2 className="text-base font-bold text-foreground">
                  {editingModelAnswerId ? "Edit Model Answer" : "Add Model Answer"}
                </h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      className="mt-1.5"
                      value={modelAnswerForm.title}
                      onChange={(e) =>
                        setModelAnswerForm({ ...modelAnswerForm, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Skill</Label>
                      <Select
                        value={modelAnswerForm.skill}
                        onValueChange={(v) =>
                          setModelAnswerForm({
                            ...modelAnswerForm,
                            skill: v as ModelAnswerDoc["skill"],
                          })
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="writing">Writing</SelectItem>
                          <SelectItem value="speaking">Speaking</SelectItem>
                          <SelectItem value="reading">Reading</SelectItem>
                          <SelectItem value="listening">Listening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Band</Label>
                      <Select
                        value={String(modelAnswerForm.band)}
                        onValueChange={(v) =>
                          setModelAnswerForm({ ...modelAnswerForm, band: Number(v) })
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((b) => (
                            <SelectItem key={b} value={String(b)}>
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        className="mt-1.5"
                        placeholder="e.g. education"
                        value={modelAnswerForm.category}
                        onChange={(e) =>
                          setModelAnswerForm({ ...modelAnswerForm, category: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Prompt</Label>
                    <Textarea
                      className="mt-1.5"
                      rows={3}
                      value={modelAnswerForm.prompt}
                      onChange={(e) =>
                        setModelAnswerForm({ ...modelAnswerForm, prompt: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Model Answer</Label>
                    <Textarea
                      className="mt-1.5"
                      rows={6}
                      value={modelAnswerForm.answer}
                      onChange={(e) =>
                        setModelAnswerForm({ ...modelAnswerForm, answer: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Tips (one per line)</Label>
                    <Textarea
                      className="mt-1.5"
                      rows={3}
                      value={modelAnswerForm.tips.join("\n")}
                      onChange={(e) =>
                        setModelAnswerForm({ ...modelAnswerForm, tips: e.target.value.split("\n") })
                      }
                    />
                  </div>

                  {/* Criteria */}
                  <div>
                    <div className="flex items-center justify-between">
                      <Label>Scoring Criteria</Label>
                      <Button
                        variant="soft"
                        size="sm"
                        onClick={() =>
                          setModelAnswerForm({
                            ...modelAnswerForm,
                            criteria: [
                              ...modelAnswerForm.criteria,
                              { label: "", band: 7, comment: "" },
                            ],
                          })
                        }
                      >
                        + Criterion
                      </Button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {modelAnswerForm.criteria.map((c, i) => {
                        const next = [...modelAnswerForm.criteria];
                        return (
                          <div
                            key={i}
                            className="flex items-start gap-2 rounded-xl border border-border p-3"
                          >
                            <div className="flex-1 space-y-1.5">
                              <Input
                                placeholder="Label (e.g. Task Response)"
                                value={c.label}
                                onChange={(e) => {
                                  next[i] = { ...next[i]!, label: e.target.value };
                                  setModelAnswerForm({ ...modelAnswerForm, criteria: next });
                                }}
                              />
                              <div className="flex gap-2">
                                <Input
                                  className="w-20"
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  max="9"
                                  value={c.band}
                                  onChange={(e) => {
                                    next[i] = { ...next[i]!, band: Number(e.target.value) };
                                    setModelAnswerForm({ ...modelAnswerForm, criteria: next });
                                  }}
                                />
                                <Input
                                  className="flex-1"
                                  placeholder="Comment"
                                  value={c.comment}
                                  onChange={(e) => {
                                    next[i] = { ...next[i]!, comment: e.target.value };
                                    setModelAnswerForm({ ...modelAnswerForm, criteria: next });
                                  }}
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setModelAnswerForm({
                                  ...modelAnswerForm,
                                  criteria: modelAnswerForm.criteria.filter((_, idx) => idx !== i),
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="hero"
                      size="pill"
                      className="flex-1"
                      onClick={submitModelAnswer}
                    >
                      {editingModelAnswerId ? "Save changes" : "Add answer"}
                    </Button>
                    {editingModelAnswerId && (
                      <Button variant="ghost" size="pill" onClick={resetModelAnswerForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl bg-card shadow-card">
                {modelAnswers.length === 0 && (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    No model answers yet.
                  </p>
                )}
                {modelAnswers.map((a) => (
                  <div key={a.id} className="border-b border-border p-4 last:border-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground">{a.title}</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                            {a.skill}
                          </span>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                            Band {a.band}
                          </span>
                          {a.category && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                              {a.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" size="sm" onClick={() => editModelAnswer(a)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeModelAnswer(a.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "requirements" && (
            <section className="mt-6 space-y-6">
              {/* Country Requirements */}
              <div className="rounded-3xl bg-card p-6 shadow-card">
                <h2 className="text-base font-bold text-foreground">
                  {editingCountryReqId ? "Edit Country Requirement" : "Add Country Requirement"}
                </h2>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Country</Label>
                      <Input
                        className="mt-1.5"
                        value={countryReqForm.country}
                        onChange={(e) =>
                          setCountryReqForm({ ...countryReqForm, country: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Flag emoji</Label>
                      <Input
                        className="mt-1.5"
                        value={countryReqForm.flag}
                        onChange={(e) =>
                          setCountryReqForm({ ...countryReqForm, flag: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Purpose</Label>
                      <Input
                        className="mt-1.5"
                        value={countryReqForm.purpose}
                        onChange={(e) =>
                          setCountryReqForm({ ...countryReqForm, purpose: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Overall Band</Label>
                      <Input
                        className="mt-1.5"
                        type="number"
                        step="0.5"
                        min="0"
                        max="9"
                        value={countryReqForm.overallBand}
                        onChange={(e) =>
                          setCountryReqForm({
                            ...countryReqForm,
                            overallBand: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Min per skill</Label>
                      <Input
                        className="mt-1.5"
                        type="number"
                        step="0.5"
                        min="0"
                        max="9"
                        value={countryReqForm.minPerSkill}
                        onChange={(e) =>
                          setCountryReqForm({
                            ...countryReqForm,
                            minPerSkill: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      className="mt-1.5"
                      rows={2}
                      value={countryReqForm.notes}
                      onChange={(e) =>
                        setCountryReqForm({ ...countryReqForm, notes: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="hero"
                      size="pill"
                      className="flex-1"
                      onClick={submitCountryReq}
                    >
                      {editingCountryReqId ? "Save changes" : "Add requirement"}
                    </Button>
                    {editingCountryReqId && (
                      <Button variant="ghost" size="pill" onClick={resetCountryReqForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl bg-card shadow-card">
                {countryReqs.length === 0 && (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    No country requirements yet.
                  </p>
                )}
                {countryReqs.map((r) => (
                  <div key={r.id} className="border-b border-border p-4 last:border-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground">
                          {r.flag} {r.country} — {r.purpose}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Overall: {r.overallBand} / Min skill: {r.minPerSkill}
                        </p>
                        {r.notes && <p className="mt-1 text-xs text-muted-foreground">{r.notes}</p>}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" size="sm" onClick={() => editCountryReq(r)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeCountryReq(r.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* University Requirements */}
              <div className="rounded-3xl bg-card p-6 shadow-card">
                <h2 className="text-base font-bold text-foreground">
                  {editingUniReqId ? "Edit University Requirement" : "Add University Requirement"}
                </h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label>University</Label>
                    <Input
                      className="mt-1.5"
                      value={uniReqForm.university}
                      onChange={(e) => setUniReqForm({ ...uniReqForm, university: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Country</Label>
                      <Input
                        className="mt-1.5"
                        value={uniReqForm.country}
                        onChange={(e) => setUniReqForm({ ...uniReqForm, country: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Program</Label>
                      <Input
                        className="mt-1.5"
                        value={uniReqForm.program}
                        onChange={(e) => setUniReqForm({ ...uniReqForm, program: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Overall Band</Label>
                      <Input
                        className="mt-1.5"
                        type="number"
                        step="0.5"
                        min="0"
                        max="9"
                        value={uniReqForm.overallBand}
                        onChange={(e) =>
                          setUniReqForm({ ...uniReqForm, overallBand: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <Label>Min Writing</Label>
                      <Input
                        className="mt-1.5"
                        type="number"
                        step="0.5"
                        min="0"
                        max="9"
                        value={uniReqForm.minWriting}
                        onChange={(e) =>
                          setUniReqForm({ ...uniReqForm, minWriting: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <Label>Min Speaking</Label>
                      <Input
                        className="mt-1.5"
                        type="number"
                        step="0.5"
                        min="0"
                        max="9"
                        value={uniReqForm.minSpeaking}
                        onChange={(e) =>
                          setUniReqForm({ ...uniReqForm, minSpeaking: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>URL</Label>
                    <Input
                      className="mt-1.5"
                      value={uniReqForm.url}
                      onChange={(e) => setUniReqForm({ ...uniReqForm, url: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="hero" size="pill" className="flex-1" onClick={submitUniReq}>
                      {editingUniReqId ? "Save changes" : "Add requirement"}
                    </Button>
                    {editingUniReqId && (
                      <Button variant="ghost" size="pill" onClick={resetUniReqForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl bg-card shadow-card">
                {uniReqs.length === 0 && (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    No university requirements yet.
                  </p>
                )}
                {uniReqs.map((r) => (
                  <div key={r.id} className="border-b border-border p-4 last:border-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground">{r.university}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {r.country} — {r.program} — Overall: {r.overallBand}, Writing:{" "}
                          {r.minWriting}, Speaking: {r.minSpeaking}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" size="sm" onClick={() => editUniReq(r)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeUniReq(r.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "mock-tests" && (
            <section className="mt-6 space-y-6">
              <div className="rounded-3xl bg-card p-6 shadow-card">
                <h2 className="text-base font-bold text-foreground">
                  {editingMockId ? "Edit Mock Test" : "Add Mock Test"}
                </h2>
                <div className="mt-4 space-y-4">
                  {/* Basic info */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Mock ID</Label>
                      <Input
                        className="mt-1.5"
                        placeholder="mock-11"
                        value={mockForm.id}
                        onChange={(e) => setMockForm({ ...mockForm, id: e.target.value })}
                        disabled={!!editingMockId}
                      />
                    </div>
                    <div>
                      <Label>Order</Label>
                      <Input
                        className="mt-1.5"
                        type="number"
                        min="1"
                        value={mockForm.order}
                        onChange={(e) =>
                          setMockForm({ ...mockForm, order: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        className="mt-1.5"
                        placeholder="Mock Test 11"
                        value={mockForm.title}
                        onChange={(e) => setMockForm({ ...mockForm, title: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Writing */}
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Writing</h3>
                    <div className="mt-2 space-y-2">
                      <div>
                        <Label>Task 1 (Graph/Table description)</Label>
                        <Textarea
                          className="mt-1.5"
                          rows={2}
                          value={mockForm.writing.task1}
                          onChange={(e) =>
                            setMockForm({
                              ...mockForm,
                              writing: { ...mockForm.writing, task1: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Task 2 (Essay)</Label>
                        <Textarea
                          className="mt-1.5"
                          rows={2}
                          value={mockForm.writing.task2}
                          onChange={(e) =>
                            setMockForm({
                              ...mockForm,
                              writing: { ...mockForm.writing, task2: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Speaking */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground">
                        Speaking ({mockForm.speaking.length} questions)
                      </h3>
                      <div className="flex gap-1">
                        <Button variant="soft" size="sm" onClick={() => addSpeakingQuestion(1)}>
                          + Part 1
                        </Button>
                        <Button variant="soft" size="sm" onClick={() => addSpeakingQuestion(2)}>
                          + Part 2
                        </Button>
                        <Button variant="soft" size="sm" onClick={() => addSpeakingQuestion(3)}>
                          + Part 3
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 space-y-2">
                      {mockForm.speaking.map((sq, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 rounded-xl border border-border p-3"
                        >
                          <span className="mt-1 shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold">
                            P{sq.part}
                          </span>
                          <div className="flex-1 space-y-1.5">
                            <Input
                              placeholder="Prompt"
                              value={sq.prompt}
                              onChange={(e) =>
                                updateSpeakingQuestion(i, { prompt: e.target.value })
                              }
                            />
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <Label className="text-[11px]">Prep (s)</Label>
                                <Input
                                  type="number"
                                  value={sq.prepSeconds}
                                  onChange={(e) =>
                                    updateSpeakingQuestion(i, {
                                      prepSeconds: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div className="flex-1">
                                <Label className="text-[11px]">Answer (s)</Label>
                                <Input
                                  type="number"
                                  value={sq.answerSeconds}
                                  onChange={(e) =>
                                    updateSpeakingQuestion(i, {
                                      answerSeconds: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSpeakingQuestion(i)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reading */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground">
                        Reading ({mockForm.readingPassages.length} passages)
                      </h3>
                      <Button variant="soft" size="sm" onClick={addReadingPassage}>
                        + Passage
                      </Button>
                    </div>
                    <div className="mt-2 space-y-3">
                      {mockForm.readingPassages.map((passage, pi) => (
                        <div key={pi} className="rounded-xl border border-border p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Passage title"
                              value={passage.title}
                              onChange={(e) => updateReadingPassage(pi, { title: e.target.value })}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeReadingPassage(pi)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <Textarea
                            placeholder="Passage text..."
                            rows={3}
                            value={passage.passage}
                            onChange={(e) => updateReadingPassage(pi, { passage: e.target.value })}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground">
                              MC Questions ({passage.questions.length})
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addReadingQuestion(pi)}
                            >
                              + Question
                            </Button>
                          </div>
                          {passage.questions.map((q, qi) => (
                            <div key={qi} className="ml-3 space-y-1 rounded-lg bg-secondary/50 p-2">
                              <div className="flex items-center gap-1">
                                <Input
                                  placeholder={`Question ${qi + 1}`}
                                  value={q.q}
                                  onChange={(e) =>
                                    updateReadingQuestion(pi, qi, { q: e.target.value })
                                  }
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeReadingQuestion(pi, qi)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              {q.options.map((opt, oi) => (
                                <div key={oi} className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => updateReadingQuestion(pi, qi, { answer: oi })}
                                    className={cn(
                                      "flex h-6 w-6 shrink-0 items-center justify-center rounded border text-[10px] font-bold",
                                      q.answer === oi
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border text-muted-foreground",
                                    )}
                                  >
                                    {String.fromCharCode(65 + oi)}
                                  </button>
                                  <Input
                                    className="text-xs"
                                    placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                                    value={opt}
                                    onChange={(e) => {
                                      const next = [...q.options];
                                      next[oi] = e.target.value;
                                      updateReadingQuestion(pi, qi, { options: next });
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Listening */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground">
                        Listening ({mockForm.listeningSections.length} sections)
                      </h3>
                      <Button variant="soft" size="sm" onClick={addListeningSection}>
                        + Section
                      </Button>
                    </div>
                    <div className="mt-2 space-y-3">
                      {mockForm.listeningSections.map((section, si) => (
                        <div key={si} className="rounded-xl border border-border p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Section title"
                              value={section.title}
                              onChange={(e) =>
                                updateListeningSection(si, { title: e.target.value })
                              }
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeListeningSection(si)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <Textarea
                            placeholder="Transcript..."
                            rows={3}
                            value={section.transcript}
                            onChange={(e) =>
                              updateListeningSection(si, { transcript: e.target.value })
                            }
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground">
                              Fill Questions ({section.questions.length})
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addListeningQuestion(si)}
                            >
                              + Question
                            </Button>
                          </div>
                          {section.questions.map((q, qi) => (
                            <div
                              key={qi}
                              className="ml-3 flex items-center gap-1 rounded-lg bg-secondary/50 p-2"
                            >
                              <Input
                                className="flex-1 text-xs"
                                placeholder="Question (use ___ for blank)"
                                value={q.q}
                                onChange={(e) =>
                                  updateListeningQuestion(si, qi, { q: e.target.value })
                                }
                              />
                              <Input
                                className="w-32 text-xs"
                                placeholder="Accepted (,)"
                                value={q.accepted.join(",")}
                                onChange={(e) =>
                                  updateListeningQuestion(si, qi, {
                                    accepted: e.target.value.split(",").map((s) => s.trim()),
                                  })
                                }
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeListeningQuestion(si, qi)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="hero" size="pill" className="flex-1" onClick={submitMockTest}>
                      {editingMockId ? "Save changes" : "Add Mock Test"}
                    </Button>
                    {editingMockId && (
                      <Button variant="ghost" size="pill" onClick={resetMockForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* List */}
              <div className="overflow-hidden rounded-3xl bg-card shadow-card">
                {mockTests.length === 0 && (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    No mock tests yet.
                  </p>
                )}
                {mockTests.map((m) => (
                  <div key={m.id} className="border-b border-border p-4 last:border-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground">
                          #{m.order} — {m.title}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                          <span>{m.reading.passages.length} passages</span>
                          <span>•</span>
                          <span>{m.listening.sections.length} sections</span>
                          <span>•</span>
                          <span>{m.speaking.length} speaking Qs</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" size="sm" onClick={() => editMockTest(m)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeMockTest(m.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "community" && (
            <section className="mt-6 space-y-4">
              {selectedCommunityThread ? (
                <>
                  <Button
                    variant="ghost"
                    size="pill"
                    onClick={() => setSelectedCommunityThread(null)}
                  >
                    ← Back to threads
                  </Button>
                  <div className="rounded-3xl bg-card p-6 shadow-card">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {selectedCommunityThread.category}
                      </Badge>
                      <span className="text-sm font-bold text-foreground">
                        {selectedCommunityThread.author}
                      </span>
                      {selectedCommunityThread.authorEmail === ADMIN_EMAIL && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                          <Shield className="h-2.5 w-2.5" /> Admin
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-lg font-extrabold text-foreground">
                      {selectedCommunityThread.title}
                    </h2>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                      {selectedCommunityThread.content}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" /> {selectedCommunityThread.likes}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />{" "}
                        {selectedCommunityThread.replies.length} replies
                      </span>
                      <button
                        onClick={() => deleteCommunityThread(selectedCommunityThread.id)}
                        className="flex items-center gap-1 text-sm text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" /> Delete thread
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-foreground">
                    Replies ({selectedCommunityThread.replies.length})
                  </h3>
                  {selectedCommunityThread.replies.map((reply) => (
                    <div key={reply.id} className="rounded-2xl bg-card p-4 shadow-card">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{reply.author}</span>
                        {reply.authorEmail === ADMIN_EMAIL && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                            <Shield className="h-2.5 w-2.5" /> Admin
                          </span>
                        )}
                        <button
                          onClick={() => deleteCommunityReply(selectedCommunityThread.id, reply.id)}
                          className="ml-auto text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-foreground">{reply.content}</p>
                    </div>
                  ))}

                  <div className="rounded-2xl bg-card p-4 shadow-card">
                    <textarea
                      value={communityReplyText}
                      onChange={(e) => setCommunityReplyText(e.target.value)}
                      placeholder="Write a reply as Admin..."
                      rows={3}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none"
                    />
                    <div className="mt-2 flex justify-end">
                      <Button
                        onClick={handleCommunityReply}
                        disabled={!communityReplyText.trim()}
                        variant="hero"
                        size="pill"
                      >
                        <Send className="mr-2 h-4 w-4" /> Reply as Admin
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {(["all", "tips", "question", "experience", "resource"] as const).map((tab) => (
                      <Button
                        key={tab}
                        variant={communityTab === tab ? "hero" : "soft"}
                        size="pill"
                        onClick={() => setCommunityTab(tab)}
                      >
                        {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </Button>
                    ))}
                  </div>

                  <div className="overflow-hidden rounded-3xl bg-card shadow-card">
                    {communityLoading && (
                      <p className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading threads...
                      </p>
                    )}
                    {!communityLoading && filteredCommunityThreads.length === 0 && (
                      <p className="p-8 text-center text-sm text-muted-foreground">
                        No threads yet.
                      </p>
                    )}
                    {filteredCommunityThreads.map((thread) => (
                      <div key={thread.id} className="border-b border-border p-4 last:border-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="capitalize text-[10px]">
                                {thread.category}
                              </Badge>
                              <span className="text-sm font-bold text-foreground">
                                {thread.author}
                              </span>
                              {thread.authorEmail === ADMIN_EMAIL && (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                                  <Shield className="h-2.5 w-2.5" /> Admin
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm font-semibold text-foreground">
                              {thread.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                              {thread.content}
                            </p>
                            <div className="mt-1.5 flex gap-3 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" /> {thread.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" /> {thread.replies.length}
                              </span>
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCommunityThread(thread)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCommunityThread(thread.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {tab === "seed" && <SeedSection queryClient={queryClient} />}
          {tab === "shadowing" && <ShadowingAdminSection queryClient={queryClient} />}
        </main>
        </div>
      </div>
    </div>
  );
}

function timestampToSeconds(ts: string): number | null {
  const match = ts.trim().match(/^(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})$/);
  if (match) {
    const h = Number(match[1]!);
    const m = Number(match[2]!);
    const s = Number(match[3]!);
    const ms = Number(match[4]!.padEnd(3, "0"));
    return h * 3600 + m * 60 + s + ms / 1000;
  }
  const short = ts.trim().match(/^(\d{1,2}):(\d{2})[,.](\d{1,3})$/);
  if (short) {
    const m = Number(short[1]!);
    const s = Number(short[2]!);
    const ms = Number(short[3]!.padEnd(3, "0"));
    return m * 60 + s + ms / 1000;
  }
  return null;
}

function parseSrt(text: string): ShadowingSegment[] {
  const out: ShadowingSegment[] = [];
  for (const block of text.split(/\n{2,}/)) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const timeLine = lines.find((l) => l.includes("-->"));
    if (!timeLine) continue;
    const [fromRaw, toRaw] = timeLine.split("-->").map((p) => p.trim());
    const start = timestampToSeconds(fromRaw ?? "");
    const end = timestampToSeconds(toRaw ?? "");
    if (start === null || end === null || end <= start) continue;
    const text = lines
      .slice(lines.indexOf(timeLine) + 1)
      .join(" ")
      .replace(/<[^>]*>/g, "")
      .trim();
    if (!text) continue;
    out.push({ start, end, text });
  }
  return out;
}

function plainTextToSegments(text: string): ShadowingSegment[] {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/<[^>]*>/g, "").trim())
    .filter(Boolean);
  let cursor = 0;
  const out: ShadowingSegment[] = [];
  for (const line of lines) {
    const words = line.split(/\s+/).length || 1;
    const duration = Math.max(1.2, words / 2.5);
    out.push({ start: cursor, end: cursor + duration, text: line });
    cursor += duration + 0.4;
  }
  return out;
}

function ShadowingAdminSection({
  queryClient,
}: {
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  const { data: clips = [] } = useQuery({
    queryKey: ["shadowing-clips"],
    queryFn: listShadowingClips,
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    sourceType: "youtube" as "youtube" | "file",
    url: "",
    thumbnail: "",
  });
  const [segments, setSegments] = useState<ShadowingSegment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [subtitlesMode, setSubtitlesMode] = useState<"srt" | "plain">("srt");
  const [subtitlesText, setSubtitlesText] = useState("");
  const [parsing, setParsing] = useState(false);

  function resetForm() {
    setForm({ title: "", description: "", sourceType: "youtube", url: "", thumbnail: "" });
    setSegments([]);
    setEditingId(null);
    setFile(null);
    setSubtitlesText("");
  }

  function editClip(clip: ShadowingClip) {
    setEditingId(clip.id);
    setForm({
      title: clip.title,
      description: clip.description,
      sourceType: clip.sourceType,
      url: clip.url,
      thumbnail: clip.thumbnail,
    });
    setSegments(clip.segments.map((s) => ({ ...s })));
  }

  async function fetchYouTubeSubtitles() {
    if (!extractYouTubeVideoId(form.url)) {
      toast.error("Paste a valid YouTube URL first (watch, youtu.be, shorts...).");
      return;
    }
    setFetching(true);
    try {
      const res = await extractYouTubeTranscript({ data: { url: form.url } });
      setForm((prev) => ({
        ...prev,
        sourceType: "youtube",
        url: `https://www.youtube.com/watch?v=${res.videoId}`,
        title: prev.title.trim() || res.title,
        thumbnail: prev.thumbnail || res.thumbnail,
      }));
      setSegments(res.segments);
      toast.success(`Extracted ${res.segments.length} phrases from the subtitles.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not fetch subtitles for this video.");
    } finally {
      setFetching(false);
    }
  }

  async function handleFileUpload(f: File | null) {
    if (!f) return;
    setUploading(true);
    try {
      const url = await uploadShadowingFile(f);
      setForm((prev) => ({ ...prev, sourceType: "file", url }));
      setFile(f);
      toast.success("File uploaded. Now add its subtitles below.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "File upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function parseSubtitles() {
    if (!subtitlesText.trim()) {
      toast.error("Paste subtitle content first.");
      return;
    }
    setParsing(true);
    try {
      const parsed =
        subtitlesMode === "srt" ? parseSrt(subtitlesText) : plainTextToSegments(subtitlesText);
      if (parsed.length === 0) {
        toast.error("Nothing could be parsed. Check the format (SRT or one phrase per line).");
        return;
      }
      setSegments(parsed);
      toast.success(`${parsed.length} phrases imported. You can adjust them below.`);
    } finally {
      setParsing(false);
    }
  }

  function updateSegment(index: number, patch: Partial<ShadowingSegment>) {
    setSegments((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  async function submit() {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!form.url.trim()) {
      toast.error("Provide a YouTube link or upload a file.");
      return;
    }
    if (segments.length === 0) {
      toast.error("Add at least one subtitle phrase for the clip.");
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      sourceType: form.sourceType,
      url: form.url.trim(),
      thumbnail: form.thumbnail.trim(),
      segments: segments
        .filter((s) => s.text.trim())
        .map((s) => ({ start: s.start, end: s.end, text: s.text.trim() })),
    };
    try {
      if (editingId) {
        await updateShadowingClip(editingId, payload);
        toast.success("Shadowing clip updated.");
      } else {
        await addShadowingClip(payload);
        toast.success("Shadowing clip added.");
      }
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["shadowing-clips"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save the clip.");
    }
  }

  async function removeClip(id: string) {
    await deleteShadowingClip(id);
    if (editingId === id) resetForm();
    queryClient.invalidateQueries({ queryKey: ["shadowing-clips"] });
    toast.success("Shadowing clip deleted.");
  }

  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
      <div className="space-y-6">
        <div className="rounded-3xl bg-card p-6 shadow-card">
          <h2 className="text-base font-bold text-foreground">
            {editingId ? "Edit shadowing clip" : "Add a shadowing clip"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Clips are used in Practice → Shadowing. Students listen to the original, repeat each
            phrase, then get AI feedback.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                className="mt-1.5"
                value={form.title}
                maxLength={120}
                placeholder="e.g. TED talk: The power of vulnerability"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Source</Label>
              <div className="mt-1.5 flex gap-2">
                <Button
                  type="button"
                  variant={form.sourceType === "youtube" ? "hero" : "soft"}
                  size="pill"
                  className="flex-1"
                  onClick={() => setForm({ ...form, sourceType: "youtube" })}
                >
                  <Youtube className="mr-2 h-4 w-4" /> YouTube
                </Button>
                <Button
                  type="button"
                  variant={form.sourceType === "file" ? "hero" : "soft"}
                  size="pill"
                  className="flex-1"
                  onClick={() => setForm({ ...form, sourceType: "file" })}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload file
                </Button>
              </div>
            </div>

            {form.sourceType === "youtube" ? (
              <div>
                <Label>YouTube URL</Label>
                <Input
                  className="mt-1.5"
                  value={form.url}
                  placeholder="https://www.youtube.com/watch?v=..."
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                />
                <Button
                  type="button"
                  variant="soft"
                  size="pill"
                  className="mt-2 w-full"
                  onClick={fetchYouTubeSubtitles}
                  disabled={fetching}
                >
                  {fetching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching subtitles...
                    </>
                  ) : (
                    <>
                      <Captions className="mr-2 h-4 w-4" /> Fetch subtitles automatically
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div>
                <Label>Video / audio file</Label>
                <Input
                  className="mt-1.5"
                  type="file"
                  accept="audio/*,video/*,.mp3,.mp4,.m4a,.webm,.ogg,.wav"
                  disabled={uploading}
                  onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {uploading
                    ? "Uploading..."
                    : file
                      ? `Uploaded: ${file.name}`
                      : "Uploaded media is hosted on Cloudflare R2."}
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-border p-3.5">
              <Label>Subtitles / transcript</Label>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Defines the phrases students repeat one by one.
              </p>
              <div className="mt-2 flex gap-1.5">
                <Button
                  type="button"
                  variant={subtitlesMode === "srt" ? "hero" : "soft"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setSubtitlesMode("srt")}
                >
                  SRT file
                </Button>
                <Button
                  type="button"
                  variant={subtitlesMode === "plain" ? "hero" : "soft"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setSubtitlesMode("plain")}
                >
                  Plain text
                </Button>
              </div>
              <Textarea
                className="mt-2 font-mono text-xs"
                rows={3}
                placeholder={
                  subtitlesMode === "srt"
                    ? "1\n00:00:00,500 --> 00:00:04,000\nHello everyone, welcome..."
                    : "One phrase per line for each subtitle.\nThe second phrase goes here."
                }
                value={subtitlesText}
                onChange={(e) => setSubtitlesText(e.target.value)}
              />
              <Button
                type="button"
                variant="soft"
                size="sm"
                className="mt-2 w-full"
                onClick={parseSubtitles}
                disabled={parsing}
              >
                {parsing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Parsing...
                  </>
                ) : (
                  <>
                    <Captions className="mr-2 h-4 w-4" /> Generate phrases
                  </>
                )}
              </Button>
            </div>

            <div>
              <Label>Thumbnail URL (optional)</Label>
              <Input
                className="mt-1.5"
                value={form.thumbnail}
                placeholder="https://..."
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
              />
            </div>

            {segments.length > 0 && (
              <div className="rounded-2xl border border-border p-3.5">
                <div className="flex items-center justify-between">
                  <Label>Phrases ({segments.length})</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSegments([])}>
                    Clear
                  </Button>
                </div>
                <div className="mt-2 max-h-80 space-y-2 overflow-y-auto">
                  {segments.map((seg, i) => (
                    <div key={i} className="rounded-xl border border-border p-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
                          {i + 1}
                        </span>
                        <Input
                          className="w-20 shrink-0 text-xs"
                          type="number"
                          step="0.1"
                          min="0"
                          aria-label="Start seconds"
                          value={seg.start}
                          onChange={(e) => updateSegment(i, { start: Number(e.target.value) })}
                        />
                        <span className="text-xs text-muted-foreground">–</span>
                        <Input
                          className="w-20 shrink-0 text-xs"
                          type="number"
                          step="0.1"
                          min="0"
                          aria-label="End seconds"
                          value={seg.end}
                          onChange={(e) => updateSegment(i, { end: Number(e.target.value) })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-auto h-8 w-8 shrink-0 p-0"
                          onClick={() => setSegments((prev) => prev.filter((_, idx) => idx !== i))}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                      <Input
                        className="mt-2 w-full text-xs"
                        placeholder="Phrase text"
                        value={seg.text}
                        onChange={(e) => updateSegment(i, { text: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="hero" size="pill" className="flex-1" onClick={submit}>
                {editingId ? "Save changes" : "Add clip"}
              </Button>
              {editingId && (
                <Button variant="ghost" size="pill" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-card shadow-card">
        {clips.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No shadowing clips yet. Add your first one on the left.
          </p>
        )}
        {clips.map((clip) => (
          <div key={clip.id} className="border-b border-border p-4 last:border-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      clip.sourceType === "youtube"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {clip.sourceType === "youtube" ? (
                      <Youtube className="h-4 w-4" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </span>
                  <p className="truncate text-sm font-bold text-foreground">{clip.title}</p>
                </div>
                {clip.description && (
                  <p className="mt-1 truncate text-xs text-muted-foreground">{clip.description}</p>
                )}
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {clip.segments.length} phrases ·{" "}
                  {clip.segments.length > 0
                    ? `${Math.max(...clip.segments.map((s) => s.end))}s duration`
                    : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="sm" onClick={() => editClip(clip)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeClip(clip.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SeedSection({ queryClient }: { queryClient: ReturnType<typeof useQueryClient> }) {
  const [seeding, setSeeding] = useState(false);
  const [results, setResults] = useState<SeedProgress[] | null>(null);

  async function handleSeed() {
    if (
      !confirm(
        "This will write all static data to Firestore. Collections that already have data will be skipped. Continue?",
      )
    )
      return;
    setSeeding(true);
    setResults(null);
    try {
      const res = await seedAllDataToFirestore();
      setResults(res);
      queryClient.invalidateQueries();
      toast.success("Seed completed!");
    } catch (e) {
      toast.error(String(e));
    } finally {
      setSeeding(false);
    }
  }

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-3xl bg-card p-6 shadow-card">
        <h2 className="text-lg font-extrabold text-foreground mb-2">
          Seed Firestore with Demo Data
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          This writes all static data (vocabulary, mock tests, resources, model answers, etc.) to
          Firestore. Collections that already have data will be skipped — this won't overwrite
          anything.
        </p>

        <Button onClick={handleSeed} disabled={seeding} variant="hero" size="lg">
          {seeding ? (
            <>
              <Database className="mr-2 h-5 w-5 animate-spin" /> Seeding...
            </>
          ) : (
            <>
              <Database className="mr-2 h-5 w-5" /> Seed All Data to Firestore
            </>
          )}
        </Button>
      </div>

      {results && (
        <div className="rounded-3xl bg-card p-6 shadow-card">
          <h3 className="font-bold text-foreground mb-4">Seed Results</h3>
          <div className="space-y-2">
            {results.map((r) => (
              <div
                key={r.collection}
                className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {r.status === "done" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-semibold text-foreground">{r.collection}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-foreground">{r.count} items</span>
                  {r.error && <p className="text-xs text-destructive">{r.error}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
