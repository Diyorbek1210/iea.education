import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback, useEffect } from "react";
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
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VOCABULARY, VOCAB_TOPICS, type VocabWord, type VocabTopic } from "@/data/vocabulary";
import { listVocabulary } from "@/lib/db";
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
  const { data: dbWords } = useQuery({ queryKey: ["vocabulary"], queryFn: listVocabulary });
  const allWords: VocabWord[] = dbWords?.length ? dbWords : VOCABULARY;

  const [mode, setMode] = useState<"browse" | "review">("browse");
  const [reviewMode, setReviewMode] = useState<ReviewMode>("mixed");
  const [selectedTopic, setSelectedTopic] = useState<VocabTopic | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [mcqOptions, setMcqOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [mixedSubMode, setMixedSubMode] = useState<"recognition" | "production">("recognition");

  const filteredWords = useMemo(() => {
    let words = [...allWords];
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

  const generateMcqOptions = useCallback((correct: VocabWord) => {
    const others = VOCABULARY.filter((w) => w.word !== correct.word);
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...shuffled.map((w) => w.definition), correct.definition];
    return options.sort(() => Math.random() - 0.5);
  }, []);

  const effectiveMode = useMemo(() => {
    if (reviewMode === "mixed") return mixedSubMode;
    return reviewMode;
  }, [reviewMode, mixedSubMode]);

  useEffect(() => {
    if (currentWord && effectiveMode === "recognition") {
      setMcqOptions(generateMcqOptions(currentWord));
      setSelectedOption(null);
      setShowAnswer(false);
    }
  }, [currentIndex, effectiveMode, currentWord, generateMcqOptions]);

  const handleRate = useCallback(
    (quality: 0 | 1 | 2 | 3) => {
      if (!currentWord) return;
      updateSrsCard(currentWord.word, quality);
      setSessionTotal((t) => t + 1);
      if (quality >= 2) setSessionCorrect((c) => c + 1);
      setIsFlipped(false);
      setUserInput("");
      setShowAnswer(false);
      setSelectedOption(null);
      if (reviewMode === "mixed") {
        setMixedSubMode((prev) => (prev === "recognition" ? "production" : "recognition"));
      }
      setCurrentIndex((i) => (i + 1 >= reviewWords.length ? 0 : i + 1));
    },
    [currentWord, reviewMode, reviewWords.length],
  );

  const checkProductionAnswer = () => {
    setShowAnswer(true);
    const isCorrect = userInput.toLowerCase().trim() === currentWord?.word.toLowerCase().trim();
    if (isCorrect) {
      setSessionCorrect((c) => c + 1);
    }
    setSessionTotal((t) => t + 1);
    updateSrsCard(currentWord!.word, isCorrect ? 3 : 0);
  };

  const handleMcqSelect = (option: string) => {
    if (showAnswer) return;
    setSelectedOption(option);
    setShowAnswer(true);
    const isCorrect = option === currentWord?.definition;
    if (isCorrect) {
      setSessionCorrect((c) => c + 1);
    }
    setSessionTotal((t) => t + 1);
    updateSrsCard(currentWord!.word, isCorrect ? 3 : 0);
  };

  const startReview = () => {
    setMode("review");
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCorrect(0);
    setSessionTotal(0);
    setUserInput("");
    setShowAnswer(false);
    setSelectedOption(null);
    if (reviewMode === "mixed") {
      setMixedSubMode(Math.random() > 0.5 ? "recognition" : "production");
    }
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

            {/* Mode indicator */}
            <div className="flex justify-center">
              <Badge variant="secondary" className="gap-1">
                {effectiveMode === "recognition" ? <Brain className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                {effectiveMode === "recognition" ? "Recognition" : "Production"} Mode
              </Badge>
            </div>

            {/* Recognition Mode: MCQ */}
            {currentWord && effectiveMode === "recognition" && (
              <div className="space-y-4">
                <div className="rounded-3xl bg-card p-8 shadow-card text-center">
                  <p className="text-3xl font-extrabold text-foreground">{currentWord.word}</p>
                  <div className="mt-3 flex justify-center gap-2">
                    <Badge variant="secondary">{currentWord.topic}</Badge>
                    <Badge variant="secondary">{currentWord.difficulty}</Badge>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Choose the correct definition:</p>
                </div>
                <div className="space-y-2">
                  {mcqOptions.map((option, idx) => {
                    const isCorrect = option === currentWord.definition;
                    const isSelected = selectedOption === option;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleMcqSelect(option)}
                        disabled={showAnswer}
                        className={cn(
                          "w-full rounded-2xl border-2 p-4 text-left text-sm transition-all",
                          !showAnswer && isSelected && "border-primary bg-primary/5 text-primary",
                          !showAnswer && !isSelected && "border-border hover:border-primary/50",
                          showAnswer && isCorrect && "border-success bg-success/10 text-success",
                          showAnswer && isSelected && !isCorrect && "border-destructive bg-destructive/10 text-destructive",
                          showAnswer && !isCorrect && !isSelected && "border-border opacity-50",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {showAnswer && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                          {showAnswer && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0" />}
                          <span>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {showAnswer && (
                  <div className="rounded-2xl bg-card p-4 shadow-card space-y-2">
                    <p className="text-sm text-foreground"><strong>Example:</strong> "{currentWord.example}"</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span><strong>Synonym:</strong> {currentWord.synonym}</span>
                      <span><strong>Antonym:</strong> {currentWord.antonym}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="destructive" size="pill" onClick={() => handleRate(0)}>Again</Button>
                      <Button variant="outline" size="pill" onClick={() => handleRate(1)}>Hard</Button>
                      <Button variant="outline" size="pill" onClick={() => handleRate(2)}>Good</Button>
                      <Button variant="hero" size="pill" onClick={() => handleRate(3)}>Easy</Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Production Mode: Type the word */}
            {currentWord && effectiveMode === "production" && (
              <div className="space-y-4">
                <div className="rounded-3xl bg-card p-8 shadow-card text-center">
                  <p className="text-sm text-muted-foreground mb-2">Type the word that matches this definition:</p>
                  <p className="text-xl font-bold text-foreground">{currentWord.definition}</p>
                  <div className="mt-3 flex justify-center gap-2">
                    <Badge variant="secondary">{currentWord.topic}</Badge>
                    <Badge variant="secondary">{currentWord.difficulty}</Badge>
                  </div>
                </div>
                {!showAnswer ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && userInput.trim()) checkProductionAnswer();
                      }}
                      placeholder="Type the word..."
                      autoFocus
                      className="w-full rounded-2xl border-2 border-border bg-card px-5 py-4 text-center text-lg font-semibold text-foreground focus:border-primary focus:outline-none"
                    />
                    <Button
                      onClick={checkProductionAnswer}
                      disabled={!userInput.trim()}
                      variant="hero"
                      size="pill"
                      className="w-full"
                    >
                      Check Answer
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className={cn(
                      "rounded-2xl p-4 text-center",
                      userInput.toLowerCase().trim() === currentWord.word.toLowerCase().trim()
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive",
                    )}>
                      {userInput.toLowerCase().trim() === currentWord.word.toLowerCase().trim() ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-bold">Correct!</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-2">
                            <XCircle className="h-5 w-5" />
                            <span className="font-bold">Not quite</span>
                          </div>
                          <p className="text-sm">The answer is: <strong>{currentWord.word}</strong></p>
                        </div>
                      )}
                    </div>
                    <div className="rounded-2xl bg-card p-4 shadow-card space-y-2">
                      <p className="text-sm text-foreground"><strong>Example:</strong> "{currentWord.example}"</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span><strong>Synonym:</strong> {currentWord.synonym}</span>
                        <span><strong>Antonym:</strong> {currentWord.antonym}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="destructive" size="pill" onClick={() => handleRate(0)}>Again</Button>
                        <Button variant="outline" size="pill" onClick={() => handleRate(1)}>Hard</Button>
                        <Button variant="outline" size="pill" onClick={() => handleRate(2)}>Good</Button>
                        <Button variant="hero" size="pill" onClick={() => handleRate(3)}>Easy</Button>
                      </div>
                    </div>
                  </div>
                )}
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
