import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  bandFromCorrect,
  estimateWritten,
  listeningQuestions,
  readingQuestions,
  speakingPrompt,
  writingPrompt,
  type McQuestion,
} from "@/data/mockTest";
import { useAuth } from "@/lib/auth";
import { addMockResult } from "@/lib/db";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mock-test")({
  head: () => ({
    meta: [
      { title: "IELTS Mock Test — IEA" },
      {
        name: "description",
        content:
          "Take a full IELTS mock covering Listening, Reading, Writing and Speaking, and get an estimated band score.",
      },
      { property: "og:title", content: "IELTS Mock Test — IEA" },
      { property: "og:description", content: "Four skills, one estimated overall band score." },
    ],
  }),
  component: MockTestPage,
});

type Stage = "intro" | "listening" | "reading" | "writing" | "speaking" | "result";

const stageOrder: Stage[] = ["listening", "reading", "writing", "speaking"];

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

function MockTestPage() {
  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const [stage, setStage] = useState<Stage>("intro");
  const [listening, setListening] = useState<number[]>([]);
  const [reading, setReading] = useState<number[]>([]);
  const [writing, setWriting] = useState("");
  const [speaking, setSpeaking] = useState("");
  const [scores, setScores] = useState({
    listening: 0,
    reading: 0,
    writing: 0,
    speaking: 0,
    overall: 0,
  });
  const [saving, setSaving] = useState(false);

  async function finish() {
    const l = bandFromCorrect(
      listening.filter((a, i) => a === listeningQuestions[i]!.answer).length,
      listeningQuestions.length,
    );
    const r = bandFromCorrect(
      reading.filter((a, i) => a === readingQuestions[i]!.answer).length,
      readingQuestions.length,
    );
    const w = estimateWritten(writing, 250);
    const s = estimateWritten(speaking, 180);
    const overall = Math.round(((l + r + w + s) / 4) * 2) / 2;
    const next = { listening: l, reading: r, writing: w, speaking: s, overall };
    setScores(next);
    setStage("result");

    if (!user) return;
    setSaving(true);
    try {
      await addMockResult({
        userId: user.uid,
        userName: user.name,
        date: new Date().toISOString(),
        ...next,
      });
      await refresh();
      queryClient.invalidateQueries({ queryKey: ["mock-results"] });
      toast.success("Result saved to the leaderboard");
    } catch {
      toast.error("Could not save your result");
    } finally {
      setSaving(false);
    }
  }

  const stepIndex = stageOrder.indexOf(stage);

  return (
    <DashboardShell title="IELTS Mock Test" subtitle="Listening · Reading · Writing · Speaking">
      <div className="mx-auto max-w-3xl">
        {stage !== "intro" && stage !== "result" && (
          <Progress value={((stepIndex + 1) / 4) * 100} className="mb-6 h-2" />
        )}

        {stage === "intro" && (
          <section className="rounded-3xl bg-card p-8 text-center shadow-card">
            <h2 className="text-2xl font-extrabold text-foreground">Ready for your mock?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Four short sections estimate your band score. Listening and Reading are multiple
              choice; Writing and Speaking are typed responses scored on length and vocabulary
              range.
            </p>
            <Button
              variant="hero"
              size="pill-lg"
              className="mt-6"
              onClick={() => setStage("listening")}
            >
              Start mock test
            </Button>
          </section>
        )}

        {stage === "listening" && (
          <section className="rounded-3xl bg-card p-6 shadow-card sm:p-8">
            <h2 className="text-lg font-extrabold text-foreground">Section 1 — Listening</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Read each transcript line and choose the best answer.
            </p>
            <div className="mt-6">
              <McSection
                questions={listeningQuestions}
                answers={listening}
                onAnswer={(i, o) => {
                  const next = [...listening];
                  next[i] = o;
                  setListening(next);
                }}
              />
            </div>
            <Button
              variant="hero"
              size="pill"
              className="mt-6 w-full"
              onClick={() => setStage("reading")}
            >
              Continue to Reading
            </Button>
          </section>
        )}

        {stage === "reading" && (
          <section className="rounded-3xl bg-card p-6 shadow-card sm:p-8">
            <h2 className="text-lg font-extrabold text-foreground">Section 2 — Reading</h2>
            <div className="mt-6">
              <McSection
                questions={readingQuestions}
                answers={reading}
                onAnswer={(i, o) => {
                  const next = [...reading];
                  next[i] = o;
                  setReading(next);
                }}
              />
            </div>
            <Button
              variant="hero"
              size="pill"
              className="mt-6 w-full"
              onClick={() => setStage("writing")}
            >
              Continue to Writing
            </Button>
          </section>
        )}

        {stage === "writing" && (
          <section className="rounded-3xl bg-card p-6 shadow-card sm:p-8">
            <h2 className="text-lg font-extrabold text-foreground">Section 3 — Writing Task 2</h2>
            <p className="mt-3 rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
              {writingPrompt}
            </p>
            <Textarea
              value={writing}
              onChange={(e) => setWriting(e.target.value)}
              rows={12}
              maxLength={6000}
              placeholder="Write your essay here…"
              className="mt-4"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {writing.trim().split(/\s+/).filter(Boolean).length} words
            </p>
            <Button
              variant="hero"
              size="pill"
              className="mt-4 w-full"
              onClick={() => setStage("speaking")}
            >
              Continue to Speaking
            </Button>
          </section>
        )}

        {stage === "speaking" && (
          <section className="rounded-3xl bg-card p-6 shadow-card sm:p-8">
            <h2 className="text-lg font-extrabold text-foreground">Section 4 — Speaking</h2>
            <p className="mt-3 rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
              {speakingPrompt}
            </p>
            <Textarea
              value={speaking}
              onChange={(e) => setSpeaking(e.target.value)}
              rows={10}
              maxLength={4000}
              placeholder="Type what you would say…"
              className="mt-4"
            />
            <Button
              variant="hero"
              size="pill"
              className="mt-4 w-full"
              disabled={saving}
              onClick={finish}
            >
              {saving ? "Scoring…" : "Finish and see my band"}
            </Button>
          </section>
        )}

        {stage === "result" && (
          <section className="rounded-3xl bg-card p-8 text-center shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Estimated overall band
            </p>
            <p className="mt-2 text-6xl font-extrabold text-gradient-primary">
              {scores.overall.toFixed(1)}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(["listening", "reading", "writing", "speaking"] as const).map((skill) => (
                <div key={skill} className="rounded-2xl bg-secondary p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {skill}
                  </p>
                  <p className="text-2xl font-extrabold text-secondary-foreground">
                    {scores[skill].toFixed(1)}
                  </p>
                </div>
              ))}
            </div>

            <Button
              variant="soft"
              size="pill"
              className="mt-8"
              onClick={() => {
                setStage("intro");
                setListening([]);
                setReading([]);
                setWriting("");
                setSpeaking("");
              }}
            >
              Take it again
            </Button>
          </section>
        )}
      </div>
    </DashboardShell>
  );
}
