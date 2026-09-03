import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/Logo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { levelDescription, levelFromScore } from "@/shared/data/placement";
import { listPlacementQuestions } from "@/lib/db";
import { cn } from "@/shared/lib/utils";

export const Route = createFileRoute("/test")({
  head: () => ({
    meta: [
      { title: "Placement Test — IEA" },
      {
        name: "description",
        content:
          "Answer 20 questions and get your English level instantly, from Beginner to Advanced.",
      },
      { property: "og:title", content: "Placement Test — IEA" },
      {
        property: "og:description",
        content: "A quick 20-question test that defines your English level before you register.",
      },
    ],
  }),
  component: PlacementTest,
});

function PlacementTest() {
  const navigate = useNavigate();
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["placement-questions"],
    queryFn: listPlacementQuestions,
  });
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const total = questions.length;
  const question = questions[index];
  const answeredCount = answers.filter((answer) => answer !== undefined).length;
  const unansweredCount = total - answeredCount;
  const score = answers.reduce(
    (acc, answer, i) => acc + (answer === questions[i]?.answer ? 1 : 0),
    0,
  );

  function choose(option: number) {
    const next = [...answers];
    next[index] = option;
    setAnswers(next);
  }

  function goNext() {
    if (index + 1 < total) setIndex(index + 1);
  }

  function submitTest() {
    if (answeredCount < total) {
      setConfirmOpen(true);
      return;
    }
    setFinished(true);
  }

  function confirmSubmit() {
    setConfirmOpen(false);
    setFinished(true);
  }

  function restart() {
    setAnswers([]);
    setIndex(0);
    setFinished(false);
  }

  if (isLoading || !question) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-soft px-5">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading the placement test…" : "No questions are available yet."}
        </p>
      </main>
    );
  }

  if (finished) {
    const level = levelFromScore(score);
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-soft px-5 py-6">
        <div className="w-full max-w-xs rounded-3xl bg-card p-5 text-center shadow-soft">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
            <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
          </span>
          <h1 className="mt-3 text-lg font-extrabold text-foreground">Test completed</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            You answered {score} of {total} questions correctly.
          </p>

          <div className="mt-3 rounded-2xl bg-secondary p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Your level
            </p>
            <p className="mt-2 text-2xl font-extrabold text-gradient-primary">{level}</p>
            <p className="mt-2 text-xs text-secondary-foreground">{levelDescription[level]}</p>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Button
              variant="hero"
              size="pill"
              onClick={() => navigate({ to: "/register", search: { level, score } })}
            >
              Continue to registration <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="pill" onClick={restart}>
              <RotateCcw className="h-4 w-4" /> Retake the test
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-soft px-5 py-5">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="inline-block">
          <Logo />
        </Link>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_250px] lg:items-start">
          <div className="rounded-3xl bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>
                Question {index + 1} of {total}
              </span>
              <span>{Math.round(((index + 1) / total) * 100)}%</span>
            </div>
            <Progress value={((index + 1) / total) * 100} className="mt-2 h-1.5" />

            <h1 className="mt-5 text-base font-bold leading-snug text-foreground sm:text-lg">
              {question.q}
            </h1>

            <div className="mt-4 space-y-2.5">
              {question.options.map((option, i) => {
                const selected = answers[index] === i;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => choose(i)}
                    className={cn(
                      "w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all",
                      selected
                        ? "border-primary bg-secondary text-primary shadow-card"
                        : "border-border bg-background text-foreground hover:border-primary/40",
                    )}
                  >
                    <span className="mr-3 font-bold">{String.fromCharCode(65 + i)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                size="pill"
                disabled={index === 0}
                onClick={() => setIndex(index - 1)}
              >
                Back
              </Button>
              <Button variant="outline" size="pill" disabled={index + 1 >= total} onClick={goNext}>
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <aside className="rounded-3xl bg-card p-4 shadow-soft lg:sticky lg:top-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Questions
            </p>
            <div className="mt-3 grid grid-cols-5 gap-1">
              {questions.map((_, i) => {
                const isAnswered = answers[i] !== undefined;
                const isCurrent = i === index;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to question ${i + 1}`}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded text-xs font-bold transition-all",
                      isCurrent
                        ? "bg-primary text-primary-foreground shadow-card"
                        : isAnswered
                          ? "bg-secondary text-secondary-foreground"
                          : "border border-border text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-primary" />
                <span className="text-xs">Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-secondary" />
                <span className="text-xs">Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded border border-border" />
                <span className="text-xs">Not answered</span>
              </div>
            </div>

            <p className="mt-4 text-xs font-bold text-foreground">
              {answeredCount}/{total} answered
            </p>

            <Button variant="hero" size="pill" className="mt-3 w-full" onClick={submitTest}>
              Submit test
            </Button>
          </aside>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" /> Test not finished
            </AlertDialogTitle>
            <AlertDialogDescription>
              You still have {unansweredCount} unanswered question
              {unansweredCount === 1 ? "" : "s"}. Unanswered questions are counted as incorrect.
              Submit anyway?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep answering</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit}>Submit anyway</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
