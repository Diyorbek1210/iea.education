import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { levelDescription, levelFromScore, placementQuestions } from "@/data/placement";
import { cn } from "@/lib/utils";

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
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const question = placementQuestions[index]!;
  const total = placementQuestions.length;
  const score = answers.reduce(
    (acc, answer, i) => acc + (answer === placementQuestions[i]!.answer ? 1 : 0),
    0,
  );

  function choose(option: number) {
    const next = [...answers];
    next[index] = option;
    setAnswers(next);
  }

  function goNext() {
    if (index + 1 < total) setIndex(index + 1);
    else setFinished(true);
  }

  function restart() {
    setAnswers([]);
    setIndex(0);
    setFinished(false);
  }

  if (finished) {
    const level = levelFromScore(score);
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-soft px-5 py-16">
        <div className="w-full max-w-lg rounded-4xl bg-card p-8 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary">
            <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
          </span>
          <h1 className="mt-6 text-2xl font-extrabold text-foreground">Test completed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You answered {score} of {total} questions correctly.
          </p>

          <div className="mt-6 rounded-3xl bg-secondary p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Your level
            </p>
            <p className="mt-2 text-3xl font-extrabold text-gradient-primary">{level}</p>
            <p className="mt-3 text-sm text-secondary-foreground">{levelDescription[level]}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              variant="hero"
              size="pill-lg"
              onClick={() =>
                navigate({ to: "/register", search: { level, score } })
              }
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
    <main className="min-h-screen bg-gradient-soft px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="inline-block">
          <Logo />
        </Link>

        <div className="mt-8 rounded-4xl bg-card p-8 shadow-soft">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>
              Question {index + 1} of {total}
            </span>
            <span>{Math.round(((index + 1) / total) * 100)}%</span>
          </div>
          <Progress value={((index + 1) / total) * 100} className="mt-3 h-2" />

          <h1 className="mt-8 text-xl font-bold leading-snug text-foreground sm:text-2xl">
            {question.q}
          </h1>

          <div className="mt-6 space-y-3">
            {question.options.map((option, i) => {
              const selected = answers[index] === i;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => choose(i)}
                  className={cn(
                    "w-full rounded-2xl border-2 px-5 py-4 text-left text-sm font-medium transition-all",
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

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="pill"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              Back
            </Button>
            <Button
              variant="hero"
              size="pill"
              disabled={answers[index] === undefined}
              onClick={goNext}
            >
              {index + 1 === total ? "Finish test" : "Next question"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
