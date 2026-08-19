import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  MicOff,
  Clock,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Shuffle,
  Target,
  Send,
  Lightbulb,
  ChevronDown,
  Loader2,
  Square,
} from "lucide-react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ESSAY_TOPICS,
  ESSAY_TYPES,
  getRandomTopic,
  type EssayType,
  type EssayTopic,
} from "@/data/essayTopics";
import { WRITING_TASK2_RUBRIC, ESSAY_CHECKLIST } from "@/data/essayRubric";
import { useAuth } from "@/lib/auth";
import { addWritingSubmission } from "@/lib/db";
import { cn } from "@/lib/utils";
import {
  generateListeningQuestions,
  generateSpeakingQuestions,
  scoreWritingEssay,
  scoreSpeakingAnswer,
  type GeneratedListeningQuestion,
  type GeneratedSpeakingQuestion,
  type WritingScoreResult,
  type SpeakingScoreResult,
} from "@/lib/aiTaskPractice";

export const Route = createFileRoute("/task-practice")({
  head: () => ({
    meta: [
      { title: "Task Practice — IEA" },
      { name: "description", content: "Practice individual IELTS sections and question types." },
    ],
  }),
  component: TaskPracticePage,
});

type SkillCategory = "listening" | "reading" | "writing" | "speaking";

interface TaskSectionMeta {
  id: string;
  skill: "listening" | "reading" | "speaking";
  title: string;
  description: string;
  questionTypes: string[];
  estimatedTime: number;
  difficulty: "easy" | "medium" | "hard";
}

interface ReadingQuestion {
  id: string;
  text: string;
  options?: string[];
  answer: string | number;
  explanation: string;
}

const READING_SECTIONS: (TaskSectionMeta & { questions: ReadingQuestion[] })[] = [
  {
    id: "r-true-false",
    skill: "reading",
    title: "True / False / Not Given",
    description: "Determine if statements are True, False, or Not Given based on the passage.",
    questionTypes: ["True/False/Not Given"],
    estimatedTime: 15,
    difficulty: "medium",
    questions: [
      { id: "1", text: "The company was founded in 1995.", answer: "True", explanation: "The passage states 'Established in 1995, the company has grown...'." },
      { id: "2", text: "The company has over 10,000 employees.", answer: "False", explanation: "The passage states the company has 'approximately 8,500 employees worldwide'." },
      { id: "3", text: "The CEO previously worked at Google.", answer: "Not Given", explanation: "The passage does not mention the CEO's previous employment." },
    ],
  },
  {
    id: "r-summary",
    skill: "reading",
    title: "Summary Completion",
    description: "Complete a summary using words from the reading passage.",
    questionTypes: ["Summary Completion"],
    estimatedTime: 15,
    difficulty: "medium",
    questions: [
      { id: "1", text: "The ocean covers approximately ___% of the Earth's surface.", answer: "71", explanation: "The passage states 'the oceans cover approximately seventy-one percent of the Earth's surface'." },
      { id: "2", text: "The deepest point in the ocean is the ___ Trench.", answer: "Mariana", explanation: "The passage mentions 'the Mariana Trench in the Pacific Ocean'." },
    ],
  },
];

const LISTENING_CONFIGS: TaskSectionMeta[] = [
  { id: "l-note-complete", skill: "listening", title: "Note Completion", description: "Fill in the missing information from a conversation.", questionTypes: ["Note Completion"], estimatedTime: 10, difficulty: "easy" },
  { id: "l-multiple-choice", skill: "listening", title: "Multiple Choice", description: "Choose the correct answer from three options.", questionTypes: ["Multiple Choice"], estimatedTime: 15, difficulty: "medium" },
];

const SPEAKING_CONFIGS: TaskSectionMeta[] = [
  { id: "s-part1", skill: "speaking", title: "Speaking Part 1 — Interview", description: "Answer personal questions about familiar topics.", questionTypes: ["Personal Questions"], estimatedTime: 5, difficulty: "easy" },
  { id: "s-part2", skill: "speaking", title: "Speaking Part 2 — Cue Card", description: "Describe a topic for 1-2 minutes after 1 minute preparation.", questionTypes: ["Monologue"], estimatedTime: 3, difficulty: "medium" },
];

const SKILL_ICONS: Record<SkillCategory, typeof BookOpen> = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenLine,
  speaking: Mic,
};

const SKILL_COLORS: Record<SkillCategory, string> = {
  listening: "text-blue-500",
  reading: "text-green-500",
  writing: "text-orange-500",
  speaking: "text-purple-500",
};

function TaskPracticePage() {
  const { user } = useAuth();
  const [selectedSkill, setSelectedSkill] = useState<SkillCategory | "all">("all");

  // Listening state
  const [listeningSection, setListeningSection] = useState<TaskSectionMeta | null>(null);
  const [listeningQuestions, setListeningQuestions] = useState<GeneratedListeningQuestion[]>([]);
  const [listeningLoading, setListeningLoading] = useState(false);
  const [listeningAnswers, setListeningAnswers] = useState<Record<string, string>>({});
  const [listeningResult, setListeningResult] = useState(false);

  // Reading state (hardcoded)
  const [readingSection, setReadingSection] = useState<(TaskSectionMeta & { questions: ReadingQuestion[] }) | null>(null);
  const [readingAnswers, setReadingAnswers] = useState<Record<string, string>>({});
  const [readingResult, setReadingResult] = useState(false);

  // Speaking state
  const [speakingSection, setSpeakingSection] = useState<TaskSectionMeta | null>(null);
  const [speakingQuestions, setSpeakingQuestions] = useState<GeneratedSpeakingQuestion[]>([]);
  const [speakingLoading, setSpeakingLoading] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(0);
  const [speakingTranscripts, setSpeakingTranscripts] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [speakingScore, setSpeakingScore] = useState<SpeakingScoreResult | null>(null);
  const [speakingScoring, setSpeakingScoring] = useState(false);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");
  const stoppedByUserRef = useRef(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Writing state
  const [selectedType, setSelectedType] = useState<EssayType | "all">("all");
  const [currentTopic, setCurrentTopic] = useState<EssayTopic | null>(null);
  const [essayText, setEssayText] = useState("");
  const [showRubric, setShowRubric] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<WritingScoreResult | null>(null);
  const [writingTimeLeft, setWritingTimeLeft] = useState(0);
  const [isWritingTimerRunning, setIsWritingTimerRunning] = useState(false);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => { recognitionRef.current?.abort(); };
  }, []);

  // Timer
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { setIsTimerRunning(false); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(id);
  }, [isTimerRunning, timeLeft > 0]);

  // Writing timer
  useEffect(() => {
    if (!isWritingTimerRunning || writingTimeLeft <= 0) return;
    const id = setInterval(() => {
      setWritingTimeLeft((t) => { if (t <= 1) { setIsWritingTimerRunning(false); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(id);
  }, [isWritingTimerRunning, writingTimeLeft > 0]);

  // ── Listening helpers ──
  const startListening = async (config: TaskSectionMeta) => {
    setListeningSection(config);
    setListeningLoading(true);
    setListeningQuestions([]);
    setListeningAnswers({});
    setListeningResult(false);
    setTimeLeft(config.estimatedTime * 60);
    setIsTimerRunning(true);
    try {
      const res = await generateListeningQuestions({ data: { type: config.title, difficulty: config.difficulty } });
      setListeningQuestions(res.questions);
    } catch {
      toast.error("Failed to generate listening questions. Try again.");
      setListeningSection(null);
    } finally {
      setListeningLoading(false);
    }
  };

  const listeningScore = listeningQuestions.filter((q) => {
    const ua = listeningAnswers[q.id];
    if (!ua) return false;
    return ua.toLowerCase().trim() === q.answer.toLowerCase().trim();
  }).length;

  // ── Reading helpers ──
  const startReading = (section: TaskSectionMeta & { questions: ReadingQuestion[] }) => {
    setReadingSection(section);
    setReadingAnswers({});
    setReadingResult(false);
    setTimeLeft(section.estimatedTime * 60);
    setIsTimerRunning(true);
  };

  const readingScore = readingSection
    ? readingSection.questions.filter((q) => {
        const ua = readingAnswers[q.id];
        if (typeof q.answer === "number") return Number(ua) === q.answer;
        return ua?.toLowerCase().trim() === String(q.answer).toLowerCase().trim();
      }).length
    : 0;

  // ── Speaking helpers ──
  const startSpeaking = async (config: TaskSectionMeta) => {
    setSpeakingSection(config);
    setSpeakingLoading(true);
    setSpeakingQuestions([]);
    setSpeakingTranscripts([]);
    setSpeakingIdx(0);
    setSpeakingScore(null);
    try {
      const part = config.id === "s-part1" ? "Part 1" : "Part 2";
      const res = await generateSpeakingQuestions({ data: { part } });
      setSpeakingQuestions(res.questions);
    } catch {
      toast.error("Failed to generate speaking questions. Try again.");
      setSpeakingSection(null);
    } finally {
      setSpeakingLoading(false);
    }
  };

  const getSpeechRecognitionCtor = useCallback(() => {
    const w = window as any;
    const Ctor = w["SpeechRecognition"] ?? w["webkitSpeechRecognition"];
    if (typeof Ctor !== "function") return undefined;
    return Ctor as new () => {
      lang: string; continuous: boolean; interimResults: boolean;
      onresult: ((event: { results: SpeechRecognitionResultList }) => void) | null;
      onerror: ((event: unknown) => void) | null;
      onend: (() => void) | null;
      start: () => void; stop: () => void;
    };
  }, []);

  const startSpeakingRecording = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) { toast.error("Speech recognition not supported."); return; }
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} }

    stoppedByUserRef.current = false;
    const recognition = new Ctor();
    recognitionRef.current = recognition;
    transcriptRef.current = "";
    setInterimText("");

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: { results: SpeechRecognitionResultList }) => {
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]!;
        if (result.isFinal) {
          transcriptRef.current += result[0]!.transcript + " ";
        } else {
          interim += result[0]!.transcript;
        }
      }
      setInterimText(interim);
    };

    recognition.onerror = () => {};
    recognition.onend = () => {
      recognitionRef.current = null;
      const final = transcriptRef.current.trim();
      if (stoppedByUserRef.current || final) {
        setIsRecording(false);
        if (final) {
          setSpeakingTranscripts((prev) => [...prev, final]);
          setInterimText("");
        }
      } else {
        try {
          const retry = new Ctor();
          recognitionRef.current = retry;
          retry.lang = "en-US"; retry.continuous = false; retry.interimResults = true;
          retry.onresult = recognition.onresult;
          retry.onerror = recognition.onerror;
          retry.onend = recognition.onend;
          retry.start();
        } catch { setIsRecording(false); }
      }
    };

    recognition.start();
    setIsRecording(true);
    setInterimText("");
  }, [getSpeechRecognitionCtor]);

  const stopSpeakingRecording = useCallback(() => {
    stoppedByUserRef.current = true;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsRecording(false);
  }, []);

  const nextSpeakingQuestion = useCallback(() => {
    if (speakingIdx < speakingQuestions.length - 1) {
      setSpeakingIdx((i) => i + 1);
      setInterimText("");
    }
  }, [speakingIdx, speakingQuestions.length]);

  const scoreSpeaking = useCallback(async () => {
    if (!speakingQuestions.length) return;
    setSpeakingScoring(true);
    try {
      const q = speakingQuestions[speakingIdx];
      if (!q) { toast.error("No question selected."); setSpeakingScoring(false); return; }
      const transcript = speakingTranscripts[speakingIdx] ?? "";
      if (!transcript.trim()) {
        toast.error("Record an answer first.");
        setSpeakingScoring(false);
        return;
      }
      const res = await scoreSpeakingAnswer({ data: { question: q.text, transcript } });
      setSpeakingScore(res);
    } catch {
      toast.error("AI scoring failed. Try again.");
    } finally {
      setSpeakingScoring(false);
    }
  }, [speakingQuestions, speakingIdx, speakingTranscripts]);

  // ── Writing helpers ──
  const filteredTopics = useMemo(
    () => selectedType === "all" ? ESSAY_TOPICS : ESSAY_TOPICS.filter((t) => t.type === selectedType),
    [selectedType],
  );
  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;

  const generateRandom = () => {
    const topic = getRandomTopic(selectedType === "all" ? undefined : selectedType);
    setCurrentTopic(topic);
    setEssayText("");
    setWritingTimeLeft(topic.suggestedTime * 60);
    setIsWritingTimerRunning(false);
  };

  const toggleChecklistItem = (id: string) => {
    setCheckedItems((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const handleSubmitEssay = async () => {
    if (!user || !currentTopic || !essayText.trim()) return;
    if (wordCount < 50) { toast.error("Write at least 50 words before submitting"); return; }
    setIsSubmitting(true);
    try {
      await addWritingSubmission({ userId: user.uid, topicId: currentTopic.id, text: essayText, wordCount, submittedAt: new Date().toISOString() });
      const res = await scoreWritingEssay({ data: { prompt: currentTopic.prompt, essay: essayText } });
      setFeedback(res);
      setSubmitted(true);
      setIsWritingTimerRunning(false);
      toast.success("Essay submitted and scored!");
    } catch {
      toast.error("Failed to submit essay. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetWriting = () => { setCurrentTopic(null); setEssayText(""); setSubmitted(false); setFeedback(null); setCheckedItems(new Set()); };

  // ── Cleanup functions ──
  const goBack = () => {
    setListeningSection(null); setReadingSection(null); setSpeakingSection(null);
    setIsTimerRunning(false); setListeningQuestions([]); setSpeakingQuestions([]);
    setSpeakingScore(null); setSpeakingTranscripts([]);
  };

  return (
    <DashboardShell title="Task Practice" subtitle="Practice individual IELTS sections">
      <div className="space-y-6">
        {/* ── Skill Selection ── */}
        {!listeningSection && !readingSection && !speakingSection && selectedSkill !== "writing" && (
          <>
            <div className="flex flex-wrap gap-2">
              <Button variant={selectedSkill === "all" ? "hero" : "soft"} size="pill" onClick={() => setSelectedSkill("all")}>
                All Skills
              </Button>
              {(["listening", "reading", "writing", "speaking"] as SkillCategory[]).map((skill) => {
                const Icon = SKILL_ICONS[skill];
                return (
                  <Button key={skill} variant={selectedSkill === skill ? "hero" : "soft"} size="pill" onClick={() => setSelectedSkill(skill)}>
                    <Icon className="mr-1 h-4 w-4" /> {skill.charAt(0).toUpperCase() + skill.slice(1)}
                  </Button>
                );
              })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {selectedSkill === "all" || selectedSkill === "listening" ? (
                LISTENING_CONFIGS.map((config) => (
                  <button key={config.id} onClick={() => startListening(config)} className="rounded-3xl bg-card p-5 text-left shadow-card transition-all hover:shadow-soft">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-blue-500"><Headphones className="h-5 w-5" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground">{config.title}</p>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {config.questionTypes.map((qt) => (<Badge key={qt} variant="secondary" className="text-[10px]">{qt}</Badge>))}
                          <Badge variant="secondary" className="text-[10px]"><Clock className="mr-1 h-3 w-3" /> {config.estimatedTime}min</Badge>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))
              ) : null}

              {(selectedSkill === "all" || selectedSkill === "reading") && READING_SECTIONS.map((section) => (
                <button key={section.id} onClick={() => startReading(section)} className="rounded-3xl bg-card p-5 text-left shadow-card transition-all hover:shadow-soft">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-green-500"><BookOpen className="h-5 w-5" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground">{section.title}</p>
                      <p className="text-xs text-muted-foreground">{section.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {section.questionTypes.map((qt) => (<Badge key={qt} variant="secondary" className="text-[10px]">{qt}</Badge>))}
                        <Badge variant="secondary" className="text-[10px]"><Clock className="mr-1 h-3 w-3" /> {section.estimatedTime}min</Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}

              {(selectedSkill === "all" || selectedSkill === "speaking") && SPEAKING_CONFIGS.map((config) => (
                <button key={config.id} onClick={() => startSpeaking(config)} className="rounded-3xl bg-card p-5 text-left shadow-card transition-all hover:shadow-soft">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-purple-500"><Mic className="h-5 w-5" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground">{config.title}</p>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {config.questionTypes.map((qt) => (<Badge key={qt} variant="secondary" className="text-[10px]">{qt}</Badge>))}
                        <Badge variant="secondary" className="text-[10px]"><Clock className="mr-1 h-3 w-3" /> {config.estimatedTime}min</Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Listening Active ── */}
        {listeningSection && (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">{listeningSection.title}</h3>
                <p className="text-xs text-muted-foreground">{listeningQuestions.length || "..."} questions • {listeningSection.estimatedTime} min</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn("flex items-center gap-2 rounded-2xl px-4 py-2", timeLeft < 300 ? "bg-destructive/10 text-destructive" : "bg-secondary text-foreground")}>
                  <Clock className="h-4 w-4" />
                  <span className="font-mono text-sm font-bold">{Math.floor(timeLeft / 60).toString().padStart(2, "0")}:{(timeLeft % 60).toString().padStart(2, "0")}</span>
                </div>
                <Button variant="ghost" size="pill" onClick={() => setIsTimerRunning(!isTimerRunning)}>{isTimerRunning ? "Pause" : "Resume"}</Button>
                <Button variant="ghost" size="pill" onClick={goBack}>Back</Button>
              </div>
            </div>

            {listeningLoading ? (
              <div className="flex flex-col items-center gap-4 py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Generating listening questions...</p>
              </div>
            ) : (
              <>
                <Progress value={listeningQuestions.length ? 100 : 0} className="h-2" />
                {listeningQuestions.map((q, idx) => (
                  <div key={q.id} className="rounded-3xl bg-card p-6 shadow-card">
                    <p className="text-xs font-semibold text-muted-foreground">Question {idx + 1}</p>
                    <p className="mt-2 whitespace-pre-line text-sm font-semibold text-foreground">{q.text}</p>
                    {q.options ? (
                      <div className="mt-4 space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <button key={optIdx} onClick={() => setListeningAnswers((p) => ({ ...p, [q.id]: opt }))} className={cn("w-full rounded-xl border-2 p-3 text-left text-sm transition-all", listeningAnswers[q.id] === opt ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50", listeningResult && opt === q.answer && "border-success bg-success/10 text-success", listeningResult && listeningAnswers[q.id] === opt && opt !== q.answer && "border-destructive bg-destructive/10 text-destructive")}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input type="text" placeholder="Type your answer..." value={listeningAnswers[q.id] ?? ""} onChange={(e) => setListeningAnswers((p) => ({ ...p, [q.id]: e.target.value }))} disabled={listeningResult} className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
                    )}
                    {listeningResult && (
                      <div className={cn("mt-3 rounded-xl p-3 text-sm", (listeningAnswers[q.id] ?? "").toLowerCase().trim() === q.answer.toLowerCase().trim() ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                        <div className="flex items-center gap-2 mb-1">
                          {(listeningAnswers[q.id] ?? "").toLowerCase().trim() === q.answer.toLowerCase().trim() ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          <span className="font-bold">Correct answer: {q.answer}</span>
                        </div>
                        <p className="text-muted-foreground">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex justify-center gap-3">
                  {!listeningResult ? (
                    <Button onClick={() => setListeningResult(true)} variant="hero" size="pill">Check Answers ({listeningScore}/{listeningQuestions.length})</Button>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 rounded-2xl bg-card px-6 py-3 shadow-card">
                        <span className="text-sm font-bold text-foreground">{listeningScore}/{listeningQuestions.length}</span>
                        <span className="text-xs text-muted-foreground">correct</span>
                      </div>
                      <Button onClick={() => { setListeningSection(null); setListeningQuestions([]); }} variant="soft" size="pill"><RotateCcw className="mr-2 h-4 w-4" /> Try Again</Button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Reading Active ── */}
        {readingSection && (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">{readingSection.title}</h3>
                <p className="text-xs text-muted-foreground">{readingSection.questions.length} questions • {readingSection.estimatedTime} min</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn("flex items-center gap-2 rounded-2xl px-4 py-2", timeLeft < 300 ? "bg-destructive/10 text-destructive" : "bg-secondary text-foreground")}>
                  <Clock className="h-4 w-4" />
                  <span className="font-mono text-sm font-bold">{Math.floor(timeLeft / 60).toString().padStart(2, "0")}:{(timeLeft % 60).toString().padStart(2, "0")}</span>
                </div>
                <Button variant="ghost" size="pill" onClick={() => setIsTimerRunning(!isTimerRunning)}>{isTimerRunning ? "Pause" : "Resume"}</Button>
                <Button variant="ghost" size="pill" onClick={goBack}>Back</Button>
              </div>
            </div>
            <Progress value={((1) / readingSection.questions.length) * 100} className="h-2" />
            {readingSection.questions.map((q, idx) => (
              <div key={q.id} className="rounded-3xl bg-card p-6 shadow-card">
                <p className="text-xs font-semibold text-muted-foreground">Question {idx + 1}</p>
                <p className="mt-2 whitespace-pre-line text-sm font-semibold text-foreground">{q.text}</p>
                {q.options ? (
                  <div className="mt-4 space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <button key={optIdx} onClick={() => setReadingAnswers((p) => ({ ...p, [q.id]: String(optIdx) }))} className={cn("w-full rounded-xl border-2 p-3 text-left text-sm transition-all", readingAnswers[q.id] === String(optIdx) ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50", readingResult && String(optIdx) === String(q.answer) && "border-success bg-success/10 text-success", readingResult && readingAnswers[q.id] === String(optIdx) && String(optIdx) !== String(q.answer) && "border-destructive bg-destructive/10 text-destructive")}>
                          {opt}
                        </button>
                      ))}
                  </div>
                ) : (
                  <input type="text" placeholder="Type your answer..." value={readingAnswers[q.id] ?? ""} onChange={(e) => setReadingAnswers((p) => ({ ...p, [q.id]: e.target.value }))} disabled={readingResult} className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
                )}
                {readingResult && (
                  <div className={cn("mt-3 rounded-xl p-3 text-sm", (readingAnswers[q.id] ?? "").toLowerCase().trim() === String(q.answer).toLowerCase().trim() ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                    <div className="flex items-center gap-2 mb-1">
                      {(readingAnswers[q.id] ?? "").toLowerCase().trim() === String(q.answer).toLowerCase().trim() ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      <span className="font-bold">Correct answer: {q.answer}</span>
                    </div>
                    <p className="text-muted-foreground">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-center gap-3">
              {!readingResult ? (
                <Button onClick={() => setReadingResult(true)} variant="hero" size="pill">Check Answers ({readingScore}/{readingSection.questions.length})</Button>
              ) : (
                <>
                  <div className="flex items-center gap-2 rounded-2xl bg-card px-6 py-3 shadow-card">
                    <span className="text-sm font-bold text-foreground">{readingScore}/{readingSection.questions.length}</span>
                    <span className="text-xs text-muted-foreground">correct</span>
                  </div>
                  <Button onClick={() => { setReadingSection(null); }} variant="soft" size="pill"><RotateCcw className="mr-2 h-4 w-4" /> Try Again</Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Speaking Active ── */}
        {speakingSection && (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">{speakingSection.title}</h3>
                <p className="text-xs text-muted-foreground">{speakingQuestions.length ? `${speakingIdx + 1} of ${speakingQuestions.length}` : "Loading..."}</p>
              </div>
              <Button variant="ghost" size="pill" onClick={goBack}>Back</Button>
            </div>

            {speakingLoading ? (
              <div className="flex flex-col items-center gap-4 py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Generating speaking questions...</p>
              </div>
            ) : speakingQuestions.length > 0 && speakingQuestions[speakingIdx] && !speakingScore ? (
              <>
                <div className="rounded-3xl bg-card p-6 shadow-card">
                  <p className="text-xs font-semibold text-muted-foreground">Question {speakingIdx + 1} of {speakingQuestions.length}</p>
                  <p className="mt-2 whitespace-pre-line text-sm font-semibold text-foreground">{speakingQuestions[speakingIdx]!.text}</p>
                  <div className="mt-3 rounded-xl bg-secondary p-3">
                    <p className="text-xs text-muted-foreground"><Lightbulb className="mr-1 inline h-3 w-3" /> {speakingQuestions[speakingIdx]!.tips}</p>
                  </div>
                </div>

                {interimText && (
                  <div className="rounded-xl bg-secondary/50 p-3">
                    <p className="text-sm text-muted-foreground italic">{interimText}...</p>
                  </div>
                )}

                <div className="flex flex-col items-center gap-3">
                  <Button variant={isRecording ? "destructive" : "hero"} size="lg" className="h-16 w-16 rounded-full shadow-lg" onClick={isRecording ? stopSpeakingRecording : startSpeakingRecording} disabled={speakingScoring}>
                    {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </Button>
                  <p className="text-xs text-muted-foreground">{isRecording ? "Tap to stop" : "Tap to speak"}</p>
                </div>

                {speakingTranscripts[speakingIdx] && (
                  <div className="rounded-xl bg-secondary p-4">
                    <p className="text-xs text-muted-foreground">You said:</p>
                    <p className="text-sm font-semibold text-foreground">"{speakingTranscripts[speakingIdx]}"</p>
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  {speakingTranscripts[speakingIdx] && (
                    <Button onClick={scoreSpeaking} variant="hero" size="pill" disabled={speakingScoring}>
                      {speakingScoring ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scoring...</> : <><Target className="mr-2 h-4 w-4" /> Score Answer</>}
                    </Button>
                  )}
                  {speakingIdx < speakingQuestions.length - 1 && (
                    <Button onClick={nextSpeakingQuestion} variant="soft" size="pill">Next Question →</Button>
                  )}
                </div>
              </>
            ) : speakingScore ? (
              <div className="rounded-3xl bg-card p-6 shadow-card">
                <h3 className="text-sm font-bold text-foreground">AI Score</h3>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-xl font-extrabold text-primary-foreground">{speakingScore.band}</div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Band Score</p>
                    <p className="text-xs text-muted-foreground">AI-evaluated</p>
                  </div>
                </div>
                {speakingScore.criteria.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {speakingScore.criteria.map((c) => (
                      <div key={c.label} className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">{c.label}:</span>
                        <Badge className="bg-primary/10 text-primary">{c.band}</Badge>
                        <span className="text-xs text-muted-foreground">{c.comment}</span>
                      </div>
                    ))}
                  </div>
                )}
                {speakingScore.summary && <p className="mt-3 text-sm text-foreground">{speakingScore.summary}</p>}
                {speakingScore.tips.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {speakingScore.tips.map((tip, i) => (
                      <p key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{tip}
                      </p>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex justify-center">
                  <Button onClick={goBack} variant="soft" size="pill"><RotateCcw className="mr-2 h-4 w-4" /> Try Another</Button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ── Writing Practice ── */}
        {selectedSkill === "writing" && !listeningSection && !readingSection && !speakingSection && (
          <WritingPractice
            user={user}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            filteredTopics={filteredTopics}
            currentTopic={currentTopic}
            setCurrentTopic={setCurrentTopic}
            essayText={essayText}
            setEssayText={setEssayText}
            wordCount={wordCount}
            writingTimeLeft={writingTimeLeft}
            setWritingTimeLeft={setWritingTimeLeft}
            isWritingTimerRunning={isWritingTimerRunning}
            setIsWritingTimerRunning={setIsWritingTimerRunning}
            showRubric={showRubric}
            setShowRubric={setShowRubric}
            showChecklist={showChecklist}
            setShowChecklist={setShowChecklist}
            checkedItems={checkedItems}
            toggleChecklistItem={toggleChecklistItem}
            isSubmitting={isSubmitting}
            submitted={submitted}
            setSubmitted={setSubmitted}
            feedback={feedback}
            handleSubmitEssay={handleSubmitEssay}
            generateRandom={generateRandom}
            resetWriting={resetWriting}
            onBack={() => setSelectedSkill("all")}
          />
        )}
      </div>
    </DashboardShell>
  );
}

/* ═══════════════════════════════════════════════════════
   Writing Practice Sub-component
   ═══════════════════════════════════════════════════════ */
function WritingPractice({
  user, selectedType, setSelectedType, filteredTopics, currentTopic, setCurrentTopic,
  essayText, setEssayText, wordCount, writingTimeLeft, setWritingTimeLeft,
  isWritingTimerRunning, setIsWritingTimerRunning, showRubric, setShowRubric,
  showChecklist, setShowChecklist, checkedItems, toggleChecklistItem,
  isSubmitting, submitted, setSubmitted, feedback, handleSubmitEssay, generateRandom, resetWriting, onBack,
}: {
  user: ReturnType<typeof useAuth>["user"];
  selectedType: EssayType | "all";
  setSelectedType: (v: EssayType | "all") => void;
  filteredTopics: EssayTopic[];
  currentTopic: EssayTopic | null;
  setCurrentTopic: (t: EssayTopic | null) => void;
  essayText: string;
  setEssayText: (v: string) => void;
  wordCount: number;
  writingTimeLeft: number;
  setWritingTimeLeft: (v: number) => void;
  isWritingTimerRunning: boolean;
  setIsWritingTimerRunning: (v: boolean) => void;
  showRubric: boolean;
  setShowRubric: (v: boolean) => void;
  showChecklist: boolean;
  setShowChecklist: (v: boolean) => void;
  checkedItems: Set<string>;
  toggleChecklistItem: (id: string) => void;
  isSubmitting: boolean;
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
  feedback: WritingScoreResult | null;
  handleSubmitEssay: () => void;
  generateRandom: () => void;
  resetWriting: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="pill" onClick={onBack}>← Back to Skills</Button>
      <div className="flex flex-wrap items-center gap-3">
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value as EssayType | "all")} className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground">
          <option value="all">All Essay Types</option>
          {ESSAY_TYPES.map((t) => (<option key={t.id} value={t.id}>{t.label}</option>))}
        </select>
        <Button onClick={generateRandom} variant="hero" size="pill"><Shuffle className="mr-2 h-4 w-4" /> Random Topic</Button>
      </div>

      {!currentTopic && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTopics.slice(0, 12).map((topic) => (
            <button key={topic.id} onClick={() => { setCurrentTopic(topic); setEssayText(""); setWritingTimeLeft(topic.suggestedTime * 60); }} className="rounded-3xl bg-card p-4 text-left shadow-card transition-all hover:shadow-soft">
              <Badge variant="secondary" className="text-[10px] capitalize">{topic.type.replace(/_/g, " ")}</Badge>
              <p className="mt-2 font-bold text-foreground">{topic.title}</p>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{topic.prompt}</p>
              <div className="mt-2 flex gap-2">
                <Badge variant="secondary" className="text-[10px]">{topic.suggestedTime}min</Badge>
                <Badge variant="secondary" className="text-[10px]">{topic.minWords}+ words</Badge>
              </div>
            </button>
          ))}
        </div>
      )}

      {currentTopic && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex gap-2">
                  <Badge className="bg-primary/10 text-primary capitalize">{currentTopic.type.replace(/_/g, " ")}</Badge>
                  <Badge variant="secondary">{currentTopic.category}</Badge>
                  <Badge variant="secondary">{currentTopic.difficulty}</Badge>
                </div>
                <h3 className="mt-2 text-sm font-bold text-foreground">{currentTopic.title}</h3>
                <p className="mt-2 text-sm text-foreground">{currentTopic.prompt}</p>
                <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                  <span><Clock className="mr-1 inline h-3 w-3" /> {currentTopic.suggestedTime} minutes</span>
                  <span><Target className="mr-1 inline h-3 w-3" /> {currentTopic.minWords}+ words</span>
                </div>
              </div>
              <Button variant="ghost" size="pill" onClick={resetWriting}><RotateCcw className="mr-1 h-4 w-4" /> New Topic</Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={cn("flex items-center gap-2 rounded-2xl px-4 py-2", writingTimeLeft < 300 ? "bg-destructive/10 text-destructive" : "bg-card text-foreground")}>
              <Clock className="h-4 w-4" />
              <span className="font-mono text-sm font-bold">{Math.floor(writingTimeLeft / 60).toString().padStart(2, "0")}:{(writingTimeLeft % 60).toString().padStart(2, "0")}</span>
            </div>
            <Button variant="soft" size="pill" onClick={() => setIsWritingTimerRunning(!isWritingTimerRunning)}>{isWritingTimerRunning ? "Pause" : "Start Timer"}</Button>
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-card">
            <textarea value={essayText} onChange={(e) => setEssayText(e.target.value)} placeholder="Write your essay here..." rows={20} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed resize-none" />
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{wordCount} words</span>
              <span className={cn(wordCount >= currentTopic.minWords ? "text-success" : "text-destructive")}>
                {wordCount >= currentTopic.minWords ? `Meets ${currentTopic.minWords}-word minimum` : `Need ${currentTopic.minWords - wordCount} more words`}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button onClick={handleSubmitEssay} disabled={isSubmitting || submitted || wordCount < 50} variant="hero" size="pill">
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scoring with AI...</> : submitted ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Submitted</> : <><Send className="mr-2 h-4 w-4" /> Submit & Score</>}
              </Button>
              {submitted && <Button onClick={() => { setSubmitted(false); setEssayText(""); }} variant="soft" size="pill">Write Another</Button>}
            </div>
          </div>

          {submitted && feedback && (
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <h3 className="text-sm font-bold text-foreground">AI Score</h3>
              {feedback.band > 0 && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-xl font-extrabold text-primary-foreground">{feedback.band}</div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Band Score</p>
                    <p className="text-xs text-muted-foreground">AI-evaluated by IELTS criteria</p>
                  </div>
                </div>
              )}
              {feedback.criteria.length > 0 && (
                <div className="mt-4 space-y-2">
                  {feedback.criteria.map((c) => (
                    <div key={c.label} className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{c.label}:</span>
                      <Badge className="bg-primary/10 text-primary">{c.band}</Badge>
                      <span className="text-xs text-muted-foreground">{c.comment}</span>
                    </div>
                  ))}
                </div>
              )}
              {feedback.summary && <p className="mt-3 text-sm text-foreground">{feedback.summary}</p>}
              {feedback.tips.length > 0 && (
                <div className="mt-3 space-y-1">
                  {feedback.tips.map((tip, i) => (
                    <p key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{tip}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="rounded-3xl bg-card p-6 shadow-card">
            <button onClick={() => setShowChecklist(!showChecklist)} className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Essay Checklist</h3>
                <span className="text-xs text-muted-foreground">({checkedItems.size}/{ESSAY_CHECKLIST.reduce((s, c) => s + c.items.length, 0)} checked)</span>
              </div>
              <ChevronDown className={cn("h-5 w-5 transition-transform", showChecklist && "rotate-180")} />
            </button>
            {showChecklist && (
              <div className="mt-4 space-y-4">
                {ESSAY_CHECKLIST.map((section) => (
                  <div key={section.id}>
                    <p className="text-sm font-bold text-foreground mb-2">{section.label}</p>
                    <div className="space-y-1">
                      {section.items.map((item, idx) => {
                        const itemId = `${section.id}-${idx}`;
                        return (
                          <label key={itemId} className="flex items-start gap-2 cursor-pointer rounded-xl p-2 hover:bg-secondary/50">
                            <input type="checkbox" checked={checkedItems.has(itemId)} onChange={() => toggleChecklistItem(itemId)} className="mt-1 h-4 w-4 rounded" />
                            <span className={cn("text-sm", checkedItems.has(itemId) ? "text-muted-foreground line-through" : "text-foreground")}>{item}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-card">
            <button onClick={() => setShowRubric(!showRubric)} className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">IELTS Scoring Rubric</h3>
              </div>
              <ChevronDown className={cn("h-5 w-5 transition-transform", showRubric && "rotate-180")} />
            </button>
            {showRubric && (
              <div className="mt-4 space-y-4">
                {WRITING_TASK2_RUBRIC.map((criterion) => (
                  <div key={criterion.criterion}>
                    <p className="text-sm font-bold text-foreground">{criterion.criterion} ({criterion.shortName})</p>
                    <div className="mt-2 space-y-2">
                      {criterion.bands.map((band) => (
                        <div key={band.band} className="rounded-xl border border-border p-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary/10 text-primary">Band {band.band}</Badge>
                            <span className="text-xs font-semibold text-foreground">{band.description}</span>
                          </div>
                          <ul className="mt-1 space-y-1">
                            {band.descriptors.map((d, i) => (
                              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />{d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
