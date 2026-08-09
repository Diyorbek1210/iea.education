import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Volume2, Square, Loader2, Headphones, BookOpen, PenLine, Mic } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SpeakingRecorder } from "@/components/mocktest/SpeakingRecorder";
import { useSpeechSynthesis } from "@/components/mocktest/useSpeechSynthesis";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  estimateWritten,
  listeningBand,
  mockTests,
  readingBand,
  type FillQuestion,
  type McQuestion,
} from "@/data/mockTest";
import { scoreMockPerformance } from "@/lib/aiScoring";
import { useAuth } from "@/lib/auth";
import { addMockResult, markMockTestCompleted, recordActivity } from "@/lib/db";
import type { AiFeedback, AiSkillFeedback } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mock-test_/$mockId")({
  head: () => ({
    meta: [
      { title: "IELTS Mock Test — IEA" },
      {
        name: "description",
        content:
          "Take a full IELTS mock covering Listening, Reading, Writing and Speaking, and get an estimated band score.",
      },
    ],
  }),
  component: MockTestRunPage,
});

type Stage = "intro" | "reading" | "listening" | "writing" | "speaking" | "result";

function McSection({
  questions,
  answers,
  onAnswer,
}: {
  questions: McQuestion[];
  answers: number[];
  onAnswer: (index: number, option: number) => void;
}) {
  return (
    <div className="space-y-6">
      {questions.map((question, qi) => (
        <div key={question.q} className="rounded-2xl bg-secondary/60 p-5">
          <p className="text-sm font-bold text-foreground">
            {qi + 1}. {question.q}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {question.options.map((option, oi) => (
              <button
                key={option}
                type="button"
                onClick={() => onAnswer(qi, oi)}
                className={cn(
                  "rounded-xl border-2 px-4 py-2.5 text-left text-sm transition-all",
                  answers[qi] === oi
                    ? "border-primary bg-card font-semibold text-primary"
                    : "border-transparent bg-card text-foreground hover:border-primary/40",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FillSection({
  questions,
  answers,
  onAnswer,
}: {
  questions: FillQuestion[];
  answers: string[];
  onAnswer: (index: number, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      {questions.map((question, qi) => (
        <div key={question.q} className="rounded-2xl bg-secondary/60 p-5">
          <p className="text-sm font-bold text-foreground">
            {qi + 1}. {question.q}
          </p>
          <Input
            value={answers[qi] ?? ""}
            onChange={(e) => onAnswer(qi, e.target.value)}
            placeholder="Type your answer…"
            className="mt-3 max-w-xs bg-card"
          />
        </div>
      ))}
    </div>
  );
}

/** Loose comparison for typed answers: ignores case, punctuation, currency signs and extra spaces. */
function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .replace(/[£$€]/g, "")
    .replace(/[.,!?;:'"()]/g, "")
    .replace(/[-–]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Official IELTS band descriptor, so the number reads as a level, not just a score. */
function bandMeaning(band: number): string {
  if (band >= 9) return "Expert user";
  if (band >= 8) return "Very good user";
  if (band >= 7) return "Good user";
  if (band >= 6) return "Competent user";
  if (band >= 5) return "Modest user";
  if (band >= 4) return "Limited user";
  if (band >= 3) return "Extremely limited user";
  if (band >= 2) return "Intermittent user";
  return "Non-user";
}

/** Cambridge IELTS to CEFR alignment (approximate). */
function bandCefr(band: number): string {
  if (band >= 8.5) return "C2";
  if (band >= 7) return "C1";
  if (band >= 5.5) return "B2";
  if (band >= 4) return "B1";
  return "A2 or below";
}

/** The detailed examiner breakdown for one skill (inside the collapsible block). */
function SkillFeedbackDetail({
  feedback,
  pronunciationNote,
}: {
  feedback: AiSkillFeedback;
  pronunciationNote?: boolean;
}) {
  if (feedback.source === "heuristic") {
    return (
      <p className="text-xs text-muted-foreground">
        Detailed AI feedback is unavailable, so this band is a rough estimate from length and
        vocabulary only.
      </p>
    );
  }
  return (
    <>
      <div className="space-y-4">
        {feedback.criteria.map((criterion) => (
          <div key={criterion.label}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-xs font-bold text-foreground">{criterion.label}</p>
              <p className="text-xs font-extrabold text-foreground">{criterion.band.toFixed(1)}</p>
            </div>
            <Progress value={(criterion.band / 9) * 100} className="mt-1.5 h-1.5" />
            <p className="mt-1.5 text-xs text-muted-foreground">{criterion.comment}</p>
          </div>
        ))}
      </div>
      {feedback.summary && <p className="mt-4 text-sm text-foreground">{feedback.summary}</p>}
      {feedback.tips.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          {feedback.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      )}
      {pronunciationNote && (
        <p className="mt-4 rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
          Note: pronunciation is not included in this score, because only the transcript of your
          speech was evaluated, not the audio itself.
        </p>
      )}
    </>
  );
}

function MockTestRunPage() {
  const { mockId } = Route.useParams();
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { speak, stop: stopSpeech, isSpeaking, supported: ttsSupported } = useSpeechSynthesis();

  const mockSet = mockTests.find((m) => m.id === mockId);
  const mockIndex = mockSet ? mockTests.findIndex((m) => m.id === mockId) : -1;
  const previousMock = mockIndex > 0 ? mockTests[mockIndex - 1] : null;
  const nextMock = mockIndex >= 0 ? mockTests[mockIndex + 1] : undefined;

  const [stage, setStage] = useState<Stage>("intro");

  const [readingPassageIndex, setReadingPassageIndex] = useState(0);
  const [readingRevealed, setReadingRevealed] = useState(false);
  const [readingAnswers, setReadingAnswers] = useState<number[][]>(
    () => mockSet?.reading.passages.map(() => []) ?? [],
  );

  const [listeningSectionIndex, setListeningSectionIndex] = useState(0);
  const [listeningAnswers, setListeningAnswers] = useState<string[][]>(
    () => mockSet?.listening.sections.map(() => []) ?? [],
  );

  const [writingTask, setWritingTask] = useState<1 | 2>(1);
  const [writing1, setWriting1] = useState("");
  const [writing2, setWriting2] = useState("");
  const [speakingIndex, setSpeakingIndex] = useState(0);
  const [speakingTranscripts, setSpeakingTranscripts] = useState<string[]>([]);
  const [scores, setScores] = useState({
    listening: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
    overall: 0,
  });
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<AiFeedback | null>(null);
  const [rawCounts, setRawCounts] = useState({ listeningCorrect: 0, readingCorrect: 0 });
  const [saving, setSaving] = useState(false);
  // True once this run finishes, so the completion guard below doesn't bounce
  // the user off their own result page when the profile refreshes.
  const justFinishedRef = useRef(false);

  // Stop any playing TTS audio when leaving this page.
  useEffect(() => () => stopSpeech(), [stopSpeech]);

  useEffect(() => {
    if (!user) return;
    if (!mockSet) {
      navigate({ to: "/mock-test" });
      return;
    }
    if (justFinishedRef.current) return;
    if (user.completedMockTests?.includes(mockSet.id)) {
      toast.error("You've already completed this mock test.");
      navigate({ to: "/mock-test" });
      return;
    }
    if (previousMock && !user.completedMockTests?.includes(previousMock.id)) {
      toast.error("Complete the previous mock tests first.");
      navigate({ to: "/mock-test" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, mockSet, previousMock]);

  if (!mockSet) return null;

  const readingPassage = mockSet.reading.passages[readingPassageIndex]!;
  const listeningSection = mockSet.listening.sections[listeningSectionIndex]!;

  async function finish() {
    if (!mockSet) return;
    justFinishedRef.current = true;
    const listeningCorrect = mockSet.listening.sections.reduce(
      (sum, section, si) =>
        sum +
        section.questions.filter((q, qi) => {
          const given = listeningAnswers[si]?.[qi]?.trim();
          return given
            ? q.accepted.some((a) => normalizeAnswer(a) === normalizeAnswer(given))
            : false;
        }).length,
      0,
    );
    const readingCorrect = mockSet.reading.passages.reduce(
      (sum, passage, pi) =>
        sum + passage.questions.filter((q, qi) => readingAnswers[pi]?.[qi] === q.answer).length,
      0,
    );
    const l = listeningBand(listeningCorrect);
    const r = readingBand(readingCorrect);

    setStage("result");
    setEvaluating(true);

    // AC-5: fewer than 10 words of speech is never sent for AI scoring.
    const joinedTranscripts = speakingTranscripts.join(" ");
    const includeSpeaking = countWords(joinedTranscripts) >= 10;

    let aiWriting: AiSkillFeedback | null = null;
    let aiSpeaking: AiSkillFeedback | null = null;
    try {
      const res = await scoreMockPerformance({
        data: {
          task1Prompt: mockSet.writing.task1,
          task1Text: writing1,
          task2Prompt: mockSet.writing.task2,
          task2Text: writing2,
          speakingQuestions: mockSet.speaking.map((q) => q.prompt),
          speakingTranscripts: includeSpeaking ? speakingTranscripts : [],
        },
      });
      aiWriting = res.writing ?? null;
      aiSpeaking = includeSpeaking ? (res.speaking ?? null) : null;
    } catch {
      // Per skill silent fallback below (AC-4): a broken AI path never blocks the result.
    }

    // Task 1 counts for 1/3 and Task 2 for 2/3, like the real IELTS marking.
    const wHeuristic =
      Math.round(
        (estimateWritten(writing1, 150) / 3 + (estimateWritten(writing2, 250) * 2) / 3) * 2,
      ) / 2;
    const sHeuristic = estimateWritten(joinedTranscripts, 150);

    const w = aiWriting?.band ?? wHeuristic;
    const s = aiSpeaking?.band ?? sHeuristic;
    const overall = Math.round(((l + r + w + s) / 4) * 2) / 2;
    const next = { listening: l, reading: r, writing: w, speaking: s, overall };

    const fb: AiFeedback = {
      writing: aiWriting ?? {
        source: "heuristic",
        band: wHeuristic,
        criteria: [],
        summary: "",
        tips: [],
      },
      speaking: aiSpeaking ?? {
        source: "heuristic",
        band: sHeuristic,
        criteria: [],
        summary: "",
        tips: [],
      },
    };
    setFeedback(fb);
    setRawCounts({ listeningCorrect, readingCorrect });
    setScores(next);
    setEvaluating(false);

    if (!user) return;
    setSaving(true);
    try {
      await addMockResult({
        userId: user.uid,
        userName: user.name,
        date: new Date().toISOString(),
        mockTestId: mockSet.id,
        ...next,
        writingTexts: { task1: writing1, task2: writing2 },
        speakingTranscripts,
        feedback: fb,
      });
      await markMockTestCompleted(user.uid, mockSet.id);
      const optimistic = { ...user, mockResults: [...(user.mockResults ?? []), "pending"] };
      const { xpGained, newBadges } = await recordActivity(optimistic, "mockTest");
      await refresh();
      queryClient.invalidateQueries({ queryKey: ["mock-results"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`Result saved · +${xpGained} XP`);
      newBadges.forEach((b) => toast(`🏅 New badge: ${b.name}`));
    } catch {
      toast.error("Could not save your result");
    } finally {
      setSaving(false);
    }
  }

  function handleSpeakingDone(transcript: string) {
    const updated = [...speakingTranscripts, transcript];
    setSpeakingTranscripts(updated);
    if (speakingIndex + 1 >= mockSet!.speaking.length) {
      void finish();
    } else {
      setSpeakingIndex((i) => i + 1);
    }
  }

  function setReadingAnswer(passageIndex: number, questionIndex: number, option: number) {
    const next = readingAnswers.map((a) => [...a]);
    next[passageIndex] = next[passageIndex] ?? [];
    next[passageIndex]![questionIndex] = option;
    setReadingAnswers(next);
  }

  function setListeningAnswer(sectionIndex: number, questionIndex: number, value: string) {
    const next = listeningAnswers.map((a) => [...a]);
    next[sectionIndex] = next[sectionIndex] ?? [];
    next[sectionIndex]![questionIndex] = value;
    setListeningAnswers(next);
  }

  function continueReading() {
    if (readingPassageIndex + 1 < mockSet!.reading.passages.length) {
      setReadingPassageIndex((i) => i + 1);
      setReadingRevealed(false);
    } else {
      setStage("listening");
    }
  }

  function continueListening() {
    stopSpeech();
    if (listeningSectionIndex + 1 < mockSet!.listening.sections.length) {
      setListeningSectionIndex((i) => i + 1);
    } else {
      setStage("writing");
    }
  }

  const sectionOrder: Stage[] = ["reading", "listening", "writing", "speaking"];
  const stepIndex = sectionOrder.indexOf(stage);

  return (
    <DashboardShell title={mockSet.title} subtitle="Reading · Listening · Writing · Speaking">
      <div className="mx-auto max-w-3xl">
        {stepIndex >= 0 && <Progress value={((stepIndex + 1) / 4) * 100} className="mb-6 h-2" />}

        {stage === "intro" && (
          <section className="rounded-3xl bg-card p-8 text-center shadow-card">
            <h2 className="text-2xl font-extrabold text-foreground">{mockSet.title}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Four sections, just like the real IELTS exam. Reading: 3 passages, 40 questions — read
              each passage, then answer. Listening: 4 sections, 40 questions — you'll hear the audio
              and type your answers into the gaps. Writing: two compulsory tasks — a Task 1 report
              (150+ words) and a Task 2 essay (250+ words). Speaking: three parts, spoken aloud and
              recorded through your microphone.
            </p>
            <Button
              variant="hero"
              size="pill-lg"
              className="mt-6"
              onClick={() => setStage("reading")}
            >
              Start mock test
            </Button>
          </section>
        )}

        {stage === "reading" && (
          <section className="rounded-3xl bg-card p-6 shadow-card sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-foreground">Reading</h2>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                Passage {readingPassageIndex + 1} of {mockSet.reading.passages.length}
              </span>
            </div>
            <p className="mt-2 text-sm font-bold text-foreground">{readingPassage.title}</p>
            <div className="mt-4 rounded-2xl bg-secondary/60 p-5 text-sm leading-relaxed text-foreground">
              {readingPassage.passage}
            </div>
            {!readingRevealed ? (
              <Button
                variant="hero"
                size="pill"
                className="mt-6 w-full"
                onClick={() => setReadingRevealed(true)}
              >
                I've finished reading — continue to questions
              </Button>
            ) : (
              <>
                <div className="mt-6">
                  <McSection
                    questions={readingPassage.questions}
                    answers={readingAnswers[readingPassageIndex] ?? []}
                    onAnswer={(i, o) => setReadingAnswer(readingPassageIndex, i, o)}
                  />
                </div>
                <Button
                  variant="hero"
                  size="pill"
                  className="mt-6 w-full"
                  onClick={continueReading}
                >
                  {readingPassageIndex + 1 < mockSet.reading.passages.length
                    ? "Continue to next passage"
                    : "Continue to Listening"}
                </Button>
              </>
            )}
          </section>
        )}

        {stage === "listening" && (
          <section className="rounded-3xl bg-card p-6 shadow-card sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-foreground">Listening</h2>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                Section {listeningSectionIndex + 1} of {mockSet.listening.sections.length}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{listeningSection.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Play the audio and listen carefully — the text is not shown, just like the real test.
              Type ONE word or number into each gap, as on the real answer sheet.
            </p>
            <div className="mt-4 flex justify-center">
              <Button
                type="button"
                variant="hero"
                size="pill-lg"
                disabled={!ttsSupported}
                onClick={() => (isSpeaking ? stopSpeech() : speak(listeningSection.transcript))}
              >
                {isSpeaking ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                {isSpeaking ? "Stop" : "Play audio"}
              </Button>
            </div>
            {!ttsSupported && (
              <p className="mt-2 text-center text-xs text-destructive">
                Audio playback isn't supported in this browser.
              </p>
            )}
            <div className="mt-6">
              <FillSection
                questions={listeningSection.questions}
                answers={listeningAnswers[listeningSectionIndex] ?? []}
                onAnswer={(i, v) => setListeningAnswer(listeningSectionIndex, i, v)}
              />
            </div>
            <Button variant="hero" size="pill" className="mt-6 w-full" onClick={continueListening}>
              {listeningSectionIndex + 1 < mockSet.listening.sections.length
                ? "Continue to next section"
                : "Continue to Writing"}
            </Button>
          </section>
        )}

        {stage === "writing" && writingTask === 1 && (
          <section className="rounded-3xl bg-card p-6 shadow-card sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-foreground">Writing Task 1</h2>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                Task 1 of 2 · min 150 words
              </span>
            </div>
            <p className="mt-3 whitespace-pre-line rounded-2xl bg-secondary p-4 text-sm leading-relaxed text-secondary-foreground">
              {mockSet.writing.task1}
            </p>
            <Textarea
              value={writing1}
              onChange={(e) => setWriting1(e.target.value)}
              rows={12}
              maxLength={4500}
              placeholder="Summarise the information by selecting and reporting the main features…"
              className="mt-4"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {countWords(writing1)} / 150 words minimum
            </p>
            <Button
              variant="hero"
              size="pill"
              className="mt-4 w-full"
              onClick={() => setWritingTask(2)}
            >
              Continue to Task 2
            </Button>
            {countWords(writing1) < 150 && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                You are below the 150-word minimum — the examiner will reduce your band for it, just
                like the real exam, but you may continue whenever you are ready.
              </p>
            )}
          </section>
        )}

        {stage === "writing" && writingTask === 2 && (
          <section className="rounded-3xl bg-card p-6 shadow-card sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-foreground">Writing Task 2</h2>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                Task 2 of 2 · min 250 words
              </span>
            </div>
            <p className="mt-3 rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
              {mockSet.writing.task2}
            </p>
            <Textarea
              value={writing2}
              onChange={(e) => setWriting2(e.target.value)}
              rows={12}
              maxLength={6000}
              placeholder="Write your essay here…"
              className="mt-4"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {countWords(writing2)} / 250 words minimum
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant="soft"
                size="pill"
                className="flex-1"
                onClick={() => setWritingTask(1)}
              >
                Back to Task 1
              </Button>
              <Button
                variant="hero"
                size="pill"
                className="flex-1"
                onClick={() => {
                  stopSpeech();
                  setStage("speaking");
                }}
              >
                Continue to Speaking
              </Button>
            </div>
            {countWords(writing2) < 250 && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                You are below the 250-word minimum — the examiner will reduce your band for it, just
                like the real exam (Task 2 is worth two-thirds of your writing score).
              </p>
            )}
          </section>
        )}

        {stage === "speaking" && (
          <>
            <p className="mb-4 text-center text-xs font-semibold text-muted-foreground">
              Speaking question {speakingIndex + 1} of {mockSet.speaking.length}
            </p>
            <SpeakingRecorder
              key={speakingIndex}
              question={mockSet.speaking[speakingIndex]!}
              onDone={handleSpeakingDone}
            />
          </>
        )}

        {stage === "result" && evaluating && (
          <section className="rounded-3xl bg-card p-8 text-center shadow-soft">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <h2 className="mt-4 text-xl font-extrabold text-foreground">
              Evaluating your writing and speaking…
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Our examiner AI is scoring your answers against the official IELTS criteria. This
              usually takes a few seconds.
            </p>
          </section>
        )}

        {stage === "result" && !evaluating && (
          <div className="space-y-4">
            {/* 1. Umumiy natija */}
            <section className="rounded-3xl bg-card p-8 text-center shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Overall band
              </p>
              <p className="mt-2 text-6xl font-extrabold text-gradient-primary">
                {scores.overall.toFixed(1)}
              </p>
              <p className="mt-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                {bandMeaning(scores.overall)} · {bandCefr(scores.overall)}
              </p>
              {feedback && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {feedback.writing.source === "ai" || feedback.speaking?.source === "ai"
                    ? "Writing and Speaking were evaluated by AI against the official IELTS criteria."
                    : "Bands estimated locally — detailed AI feedback is unavailable right now."}
                </p>
              )}
            </section>

            {/* 2. Bo'lim ballari */}
            <section className="rounded-3xl bg-card p-6 shadow-card sm:p-8">
              <h3 className="text-sm font-extrabold text-foreground">Section scores</h3>
              <div className="mt-4 space-y-4">
                {(
                  [
                    {
                      key: "listening",
                      label: "Listening",
                      icon: Headphones,
                      subline: `${rawCounts.listeningCorrect}/40 correct`,
                    },
                    {
                      key: "reading",
                      label: "Reading",
                      icon: BookOpen,
                      subline: `${rawCounts.readingCorrect}/40 correct`,
                    },
                    {
                      key: "writing",
                      label: "Writing",
                      icon: PenLine,
                      subline:
                        feedback?.writing.source === "ai" ? "Evaluated by AI" : "Estimated locally",
                    },
                    {
                      key: "speaking",
                      label: "Speaking",
                      icon: Mic,
                      subline:
                        feedback?.speaking?.source === "ai"
                          ? "Evaluated by AI (transcript)"
                          : "Estimated locally",
                    },
                  ] as const
                ).map((row) => (
                  <div key={row.key} className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <row.icon className="h-5 w-5 text-foreground" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-bold text-foreground">{row.label}</p>
                        <p className="text-sm font-extrabold text-foreground">
                          {scores[row.key].toFixed(1)}
                        </p>
                      </div>
                      <Progress value={(scores[row.key] / 9) * 100} className="mt-1.5 h-1.5" />
                      <p className="mt-1 text-xs text-muted-foreground">{row.subline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Batafsil ekzaminator bahosi */}
            {feedback && (
              <section className="rounded-3xl bg-card p-6 shadow-card sm:p-8">
                <h3 className="text-sm font-extrabold text-foreground">
                  Detailed examiner feedback
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Open a section to see how each official criterion was scored.
                </p>
                <Accordion type="single" collapsible className="mt-3">
                  <AccordionItem
                    value="writing"
                    className="rounded-2xl border-none bg-secondary/60"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <span className="flex flex-1 items-center justify-between pr-2">
                        <span className="flex items-center gap-2 text-sm font-extrabold text-foreground">
                          <PenLine className="h-4 w-4 text-primary" /> Writing
                        </span>
                        <span className="rounded-full bg-card px-3 py-1 text-xs font-bold text-foreground">
                          {feedback.writing.band.toFixed(1)}
                          {feedback.writing.source === "ai" ? " · AI" : " · est."}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <SkillFeedbackDetail feedback={feedback.writing} />
                    </AccordionContent>
                  </AccordionItem>
                  {feedback.speaking && (
                    <AccordionItem
                      value="speaking"
                      className="mt-3 rounded-2xl border-none bg-secondary/60"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <span className="flex flex-1 items-center justify-between pr-2">
                          <span className="flex items-center gap-2 text-sm font-extrabold text-foreground">
                            <Mic className="h-4 w-4 text-primary" /> Speaking
                          </span>
                          <span className="rounded-full bg-card px-3 py-1 text-xs font-bold text-foreground">
                            {feedback.speaking.band.toFixed(1)}
                            {feedback.speaking.source === "ai" ? " · AI" : " · est."}
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        <SkillFeedbackDetail feedback={feedback.speaking} pronunciationNote />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </section>
            )}

            {/* 4. Keyingi qadam */}
            <section className="rounded-3xl bg-card p-6 text-center shadow-card sm:p-8">
              {saving ? (
                <p className="text-sm text-muted-foreground">Saving your result…</p>
              ) : (
                <>
                  <p className="text-sm font-semibold text-foreground">
                    {nextMock
                      ? `${nextMock.title} is now unlocked!`
                      : "You've completed all 10 mock tests! 🎉"}
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    {nextMock && (
                      <Button
                        variant="hero"
                        size="pill"
                        onClick={() =>
                          navigate({ to: "/mock-test/$mockId", params: { mockId: nextMock.id } })
                        }
                      >
                        Start {nextMock.title}
                      </Button>
                    )}
                    <Button
                      variant="soft"
                      size="pill"
                      onClick={() => navigate({ to: "/mock-test" })}
                    >
                      Back to mock tests
                    </Button>
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
