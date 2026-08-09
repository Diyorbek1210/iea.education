import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Flame, RotateCcw, Timer, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { gameWords, scrambleWords, vocabularyQuiz } from "@/data/games";
import { cn } from "@/lib/utils";

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

/* --------------------------- Timed vocabulary quiz --------------------------- */

export function TimedQuizGame({
  onComplete,
}: {
  onComplete?: (score: number, max: number) => void;
}) {
  const [items, setItems] = useState(() => shuffle(vocabularyQuiz).slice(0, 8));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [running, setRunning] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const reportedRef = useRef(false);

  function reportComplete(finalScore: number) {
    if (reportedRef.current) return;
    reportedRef.current = true;
    onComplete?.(finalScore, items.length);
  }

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      reportComplete(score);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reportComplete/score read via closure, re-created every render like running/timeLeft already do
  }, [running, timeLeft]);

  const finished = !running && (timeLeft <= 0 || index >= items.length);
  const current = items[index];

  function start() {
    setItems(shuffle(vocabularyQuiz).slice(0, 8));
    setIndex(0);
    setScore(0);
    setTimeLeft(45);
    setPicked(null);
    setRunning(true);
    reportedRef.current = false;
  }

  function answer(option: number) {
    if (!current || picked !== null) return;
    setPicked(option);
    const nextScore = option === current.answer ? score + 1 : score;
    if (option === current.answer) setScore(nextScore);
    setTimeout(() => {
      setPicked(null);
      if (index + 1 >= items.length) {
        setRunning(false);
        setIndex(items.length);
        reportComplete(nextScore);
      } else {
        setIndex((i) => i + 1);
      }
    }, 500);
  }

  return (
    <div className="rounded-3xl bg-card p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <Flame className="h-4 w-4 text-primary" /> Timed Vocabulary Rush
        </h2>
        <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
          <Timer className="h-3 w-3" /> {timeLeft}s
        </span>
      </div>

      {!running && !finished && (
        <>
          <p className="mt-3 text-sm text-muted-foreground">
            8 questions, 45 seconds. How many can you get right before the clock runs out?
          </p>
          <Button variant="hero" size="pill" className="mt-5" onClick={start}>
            Start challenge
          </Button>
        </>
      )}

      {running && current && (
        <>
          <Progress value={(index / items.length) * 100} className="mt-4 h-1.5" />
          <p className="mt-5 text-lg font-bold text-foreground">{current.q}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {current.options.map((option, i) => (
              <button
                key={option}
                type="button"
                onClick={() => answer(i)}
                className={cn(
                  "rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition-all",
                  picked === null
                    ? "border-border bg-background hover:border-primary/50"
                    : i === current.answer
                      ? "border-success bg-success/10 text-success"
                      : picked === i
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-border bg-background opacity-60",
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs font-semibold text-muted-foreground">Score: {score}</p>
        </>
      )}

      {finished && (
        <div className="mt-5 rounded-2xl bg-secondary p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Final score</p>
          <p className="text-3xl font-extrabold text-secondary-foreground">
            {score}/{items.length}
          </p>
          <Button variant="hero" size="pill" className="mt-4" onClick={start}>
            <RotateCcw className="h-4 w-4" /> Play again
          </Button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Word hangman ------------------------------- */

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export function HangmanGame({ onComplete }: { onComplete?: (score: number, max: number) => void }) {
  const [target, setTarget] = useState(
    () => gameWords[Math.floor(Math.random() * gameWords.length)]!,
  );
  const [guessed, setGuessed] = useState<string[]>([]);
  const reportedRef = useRef(false);

  const wrong = guessed.filter((letter) => !target.word.includes(letter));
  const lives = 6 - wrong.length;
  const won = target.word.split("").every((letter) => guessed.includes(letter));
  const lost = lives <= 0;

  useEffect(() => {
    if (!won && !lost) return;
    if (reportedRef.current) return;
    reportedRef.current = true;
    onComplete?.(won ? 1 : 0, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- guarded by reportedRef, safe to skip re-run on onComplete identity change
  }, [won, lost]);

  function reset() {
    setTarget(gameWords[Math.floor(Math.random() * gameWords.length)]!);
    setGuessed([]);
    reportedRef.current = false;
  }

  return (
    <div className="rounded-3xl bg-card p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Word Rescue (Hangman)</h2>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
          Lives: {Math.max(lives, 0)}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Hint: {target.hint}</p>

      <p className="mt-6 text-center font-mono text-2xl font-extrabold tracking-[0.35em] text-foreground">
        {target.word
          .split("")
          .map((letter) => (guessed.includes(letter) || lost ? letter : "_"))
          .join(" ")}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-1.5">
        {ALPHABET.map((letter) => {
          const used = guessed.includes(letter);
          return (
            <button
              key={letter}
              type="button"
              disabled={used || won || lost}
              onClick={() => setGuessed((g) => [...g, letter])}
              className={cn(
                "h-8 w-8 rounded-lg text-xs font-bold uppercase transition-colors",
                used
                  ? target.word.includes(letter)
                    ? "bg-success text-success-foreground"
                    : "bg-destructive/15 text-destructive"
                  : "bg-secondary text-secondary-foreground hover:bg-accent disabled:opacity-40",
              )}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {(won || lost) && (
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-secondary px-5 py-4">
          <p className="flex items-center gap-2 text-sm font-bold text-secondary-foreground">
            {won ? (
              <>
                <Check className="h-4 w-4 text-success" /> You saved the word!
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-destructive" /> It was “{target.word}”
              </>
            )}
          </p>
          <Button variant="hero" size="pill" onClick={reset}>
            New word
          </Button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Word scramble ------------------------------ */

export function ScrambleGame({
  onComplete,
}: {
  onComplete?: (score: number, max: number) => void;
}) {
  const [word, setWord] = useState(
    () => scrambleWords[Math.floor(Math.random() * scrambleWords.length)]!,
  );
  const [value, setValue] = useState("");
  const [streak, setStreak] = useState(0);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const scrambled = useMemo(() => shuffle(word.split("")).join(""), [word]);

  function check() {
    if (value.trim().toLowerCase() === word) {
      setStatus("correct");
      setStreak((s) => s + 1);
      onComplete?.(1, 1);
      setTimeout(() => {
        setWord(scrambleWords[Math.floor(Math.random() * scrambleWords.length)]!);
        setValue("");
        setStatus("idle");
      }, 700);
    } else {
      setStatus("wrong");
      setStreak(0);
    }
  }

  return (
    <div className="rounded-3xl bg-card p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Unscramble the Word</h2>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
          Streak: {streak}
        </span>
      </div>

      <p className="mt-6 text-center font-mono text-3xl font-extrabold uppercase tracking-[0.3em] text-gradient-primary">
        {scrambled}
      </p>

      <div className="mt-6 flex gap-2">
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setStatus("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="Type the correct word"
          maxLength={30}
          className={cn(
            status === "wrong" && "border-destructive",
            status === "correct" && "border-success",
          )}
        />
        <Button variant="hero" size="pill" onClick={check}>
          Check
        </Button>
      </div>

      {status === "wrong" && (
        <p className="mt-2 text-xs font-semibold text-destructive">Not quite — try again.</p>
      )}
      {status === "correct" && (
        <p className="mt-2 text-xs font-semibold text-success">Correct! Next word coming…</p>
      )}
    </div>
  );
}
