import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useCallback } from "react";
import {
  BookOpen,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Brain,
  Zap,
  Shuffle,
  Trophy,
  Target,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VOCABULARY, VOCAB_TOPICS, type VocabWord, type VocabTopic } from "@/data/vocabulary";
import {
  getSrsCard,
  updateSrsCard,
  getWordsForReview,
  getSrsStats,
} from "@/lib/spacedRepetition";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vocabulary")({
  head: () => ({
    meta: [
      { title: "Vocabulary — IEA" },
      { name: "description", content: "Build your IELTS vocabulary with spaced repetition flashcards." },
    ],
  }),
  component: VocabularyPage,
});

type ReviewMode = "recognition" | "production" | "mixed";

function VocabularyPage() {
  const [mode, setMode] = useState<"browse" | "review">("browse");
  const [reviewMode, setReviewMode] = useState<ReviewMode>("mixed");
  const [selectedTopic, setSelectedTopic] = useState<VocabTopic | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  const filteredWords = useMemo(() => {
    let words = [...VOCABULARY];
    if (selectedTopic !== "all") words = words.filter((w) => w.topic === selectedTopic);
    if (selectedDifficulty !== "all") words = words.filter((w) => w.difficulty === selectedDifficulty);
    return words;
  }, [selectedTopic, selectedDifficulty]);

  const reviewWords = useMemo(
    () => getWordsForReview(filteredWords, reviewMode),
    [filteredWords, reviewMode],
  );

  const stats = useMemo(() => getSrsStats(), [sessionTotal]);

  const currentWord = reviewWords[currentIndex];

  const handleRate = useCallback(
    (quality: 0 | 1 | 2 | 3) => {
      if (!currentWord) return;
      updateSrsCard(currentWord.word, quality);
      setSessionTotal((t) => t + 1);
      if (quality >= 2) setSessionCorrect((c) => c + 1);
      setIsFlipped(false);
      setCurrentIndex((i) => (i + 1 >= reviewWords.length ? 0 : i + 1));
    },
    [currentWord, reviewWords.length],
  );

  const startReview = () => {
    setMode("review");
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCorrect(0);
    setSessionTotal(0);
  };

  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;

  return (
    <DashboardShell title="Vocabulary Builder" subtitle="Spaced repetition flashcards for IELTS">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Total Words</p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">{stats.total || VOCABULARY.length}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Due for Review</p>
            <p className="mt-1 text-2xl font-extrabold text-primary">{stats.due}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Mastered</p>
            <p className="mt-1 text-2xl font-extrabold text-success">{stats.mastered}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Accuracy</p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">{stats.accuracy}%</p>
          </div>
        </div>

        {mode === "browse" ? (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value as VocabTopic | "all")}
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"
              >
                <option value="all">All Topics</option>
                {VOCAB_TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Review Mode Selection & Start */}
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <h3 className="text-lg font-extrabold text-foreground">Start Review Session</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredWords.length} words available • Choose your review mode
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {([
                  { id: "recognition" as ReviewMode, label: "Recognition", icon: Brain, desc: "Choose correct definition" },
                  { id: "production" as ReviewMode, label: "Production", icon: Zap, desc: "Type the word from memory" },
                  { id: "mixed" as ReviewMode, label: "Mixed", icon: Shuffle, desc: "Random mix of both" },
                ]).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setReviewMode(m.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all",
                      reviewMode === m.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <m.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-bold text-foreground">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <Button onClick={startReview} className="mt-4" variant="hero" size="pill">
                <BookOpen className="mr-2 h-4 w-4" /> Start Review ({reviewWords.length} words)
              </Button>
            </div>

            {/* Word List */}
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <h3 className="text-lg font-extrabold text-foreground">Word List</h3>
              <div className="mt-4 space-y-3">
                {filteredWords.slice(0, 50).map((word) => {
                  const srs = getSrsCard(word.word);
                  const mastery = Math.min(100, (srs.repetitions / 5) * 100);
                  return (
                    <div
                      key={word.word}
                      className="flex items-center gap-4 rounded-2xl border border-border p-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-foreground">{word.word}</p>
                        <p className="text-sm text-muted-foreground">{word.definition}</p>
                        <div className="mt-1 flex gap-2">
                          <Badge variant="secondary" className="text-[10px]">{word.topic}</Badge>
                          <Badge variant="secondary" className="text-[10px]">{word.difficulty}</Badge>
                          {word.ieltsFrequency === "high" && (
                            <Badge className="bg-primary/10 text-primary text-[10px]">IELTS High</Badge>
                          )}
                        </div>
                      </div>
                      <div className="w-20">
                        <Progress value={mastery} className="h-1.5" />
                        <p className="mt-1 text-center text-[10px] text-muted-foreground">
                          {srs.repetitions >= 5 ? "Mastered" : `Level ${srs.repetitions}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* Review Mode */
          <div className="mx-auto max-w-lg space-y-6">
            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <Progress
                value={reviewWords.length > 0 ? ((currentIndex + 1) / reviewWords.length) * 100 : 0}
                className="h-2 flex-1"
              />
              <span className="text-xs font-semibold text-muted-foreground">
                {currentIndex + 1}/{reviewWords.length}
              </span>
            </div>

            {/* Session stats */}
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-success font-semibold">✓ {sessionCorrect}</span>
              <span className="text-muted-foreground font-semibold">✗ {sessionTotal - sessionCorrect}</span>
              <span className="font-semibold text-foreground">{accuracy}%</span>
            </div>

            {/* Flashcard */}
            {currentWord && (
              <div
                className="relative cursor-pointer rounded-3xl bg-card p-8 shadow-card min-h-[280px] flex items-center justify-center transition-all duration-300"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {!isFlipped ? (
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-foreground">{currentWord.word}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Click to reveal definition</p>
                    <div className="mt-3 flex justify-center gap-2">
                      <Badge variant="secondary">{currentWord.topic}</Badge>
                      <Badge variant="secondary">{currentWord.difficulty}</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <p className="text-xl font-extrabold text-foreground">{currentWord.word}</p>
                    <p className="text-foreground">{currentWord.definition}</p>
                    <p className="text-sm italic text-muted-foreground">"{currentWord.example}"</p>
                    <div className="flex justify-center gap-4 text-sm">
                      <span><strong>Synonym:</strong> {currentWord.synonym}</span>
                      <span><strong>Antonym:</strong> {currentWord.antonym}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rating buttons */}
            {isFlipped && currentWord && (
              <div className="grid grid-cols-4 gap-3">
                <Button
                  variant="destructive"
                  onClick={() => handleRate(0)}
                  className="flex flex-col items-center py-4"
                >
                  <span className="text-lg font-bold">Again</span>
                  <span className="text-[10px] opacity-70">Don't know</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRate(1)}
                  className="flex flex-col items-center py-4"
                >
                  <span className="text-lg font-bold">Hard</span>
                  <span className="text-[10px] opacity-70">Sort of know</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRate(2)}
                  className="flex flex-col items-center py-4"
                >
                  <span className="text-lg font-bold">Good</span>
                  <span className="text-[10px] opacity-70">Remember it</span>
                </Button>
                <Button
                  variant="hero"
                  onClick={() => handleRate(3)}
                  className="flex flex-col items-center py-4"
                >
                  <span className="text-lg font-bold">Easy</span>
                  <span className="text-[10px] opacity-70">No hesitation</span>
                </Button>
              </div>
            )}

            <div className="flex justify-center">
              <Button variant="ghost" onClick={() => setMode("browse")}>
                <RotateCcw className="mr-2 h-4 w-4" /> Back to Browse
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
