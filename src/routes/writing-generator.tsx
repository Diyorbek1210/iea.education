import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Shuffle,
  PenLine,
  Clock,
  Target,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ESSAY_TOPICS,
  ESSAY_TYPES,
  getRandomTopic,
  type EssayType,
  type EssayTopic,
} from "@/data/essayTopics";
import { WRITING_TASK2_RUBRIC, ESSAY_CHECKLIST } from "@/data/essayRubric";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/writing-generator")({
  head: () => ({
    meta: [
      { title: "Writing Practice — IEA" },
      { name: "description", content: "Generate IELTS essay topics and practice writing." },
    ],
  }),
  component: WritingGeneratorPage,
});

function WritingGeneratorPage() {
  const [selectedType, setSelectedType] = useState<EssayType | "all">("all");
  const [currentTopic, setCurrentTopic] = useState<EssayTopic | null>(null);
  const [essayText, setEssayText] = useState("");
  const [showRubric, setShowRubric] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const filteredTopics = useMemo(
    () => selectedType === "all" ? ESSAY_TOPICS : ESSAY_TOPICS.filter((t) => t.type === selectedType),
    [selectedType],
  );

  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;

  const generateRandom = () => {
    const topic = getRandomTopic(selectedType === "all" ? undefined : selectedType);
    setCurrentTopic(topic);
    setEssayText("");
    setTimeLeft(topic.suggestedTime * 60);
    setIsTimerRunning(false);
  };

  const toggleChecklistItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const checklistProgress = useMemo(() => {
    const total = ESSAY_CHECKLIST.reduce((sum, section) => sum + section.items.length, 0);
    return total > 0 ? (checkedItems.size / total) * 100 : 0;
  }, [checkedItems]);

  return (
    <DashboardShell title="Writing Practice" subtitle="Generate IELTS essay topics and practice">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as EssayType | "all")}
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"
          >
            <option value="all">All Essay Types</option>
            {ESSAY_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <Button onClick={generateRandom} variant="hero" size="pill">
            <Shuffle className="mr-2 h-4 w-4" /> Random Topic
          </Button>
        </div>

        {/* Topic Browser */}
        {!currentTopic && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTopics.slice(0, 12).map((topic) => (
              <button
                key={topic.id}
                onClick={() => { setCurrentTopic(topic); setEssayText(""); setTimeLeft(topic.suggestedTime * 60); }}
                className="rounded-3xl bg-card p-4 text-left shadow-card transition-all hover:shadow-soft"
              >
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

        {/* Active Topic */}
        {currentTopic && (
          <div className="space-y-4">
            {/* Topic Header */}
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex gap-2">
                    <Badge className="bg-primary/10 text-primary capitalize">{currentTopic.type.replace(/_/g, " ")}</Badge>
                    <Badge variant="secondary">{currentTopic.category}</Badge>
                    <Badge variant="secondary">{currentTopic.difficulty}</Badge>
                  </div>
                  <h3 className="mt-2 text-lg font-extrabold text-foreground">{currentTopic.title}</h3>
                  <p className="mt-2 text-foreground">{currentTopic.prompt}</p>
                  <div className="mt-3 flex gap-3 text-sm text-muted-foreground">
                    <span><Clock className="mr-1 inline h-3 w-3" /> {currentTopic.suggestedTime} minutes</span>
                    <span><Target className="mr-1 inline h-3 w-3" /> {currentTopic.minWords}+ words</span>
                  </div>
                </div>
                <Button variant="ghost" size="pill" onClick={() => { setCurrentTopic(null); setEssayText(""); }}>
                  <RotateCcw className="mr-1 h-4 w-4" /> New Topic
                </Button>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex items-center gap-2 rounded-2xl px-4 py-2",
                timeLeft < 300 ? "bg-destructive/10 text-destructive" : "bg-card text-foreground",
              )}>
                <Clock className="h-4 w-4" />
                <span className="font-mono text-lg font-extrabold">
                  {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:{(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <Button
                variant="soft"
                size="pill"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
              >
                {isTimerRunning ? "Pause" : "Start Timer"}
              </Button>
            </div>

            {/* Writing Area */}
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <textarea
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="Write your essay here..."
                rows={20}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed resize-none"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{wordCount} words</span>
                <span className={cn(
                  wordCount >= currentTopic.minWords ? "text-success" : "text-destructive",
                )}>
                  {wordCount >= currentTopic.minWords
                    ? `✓ Meets ${currentTopic.minWords}-word minimum`
                    : `Need ${currentTopic.minWords - wordCount} more words`}
                </span>
              </div>
            </div>

            {/* Checklist */}
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <button
                onClick={() => setShowChecklist(!showChecklist)}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-extrabold text-foreground">Essay Checklist</h3>
                  <span className="text-sm text-muted-foreground">
                    ({checkedItems.size}/{ESSAY_CHECKLIST.reduce((s, c) => s + c.items.length, 0)} checked)
                  </span>
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
                            <label
                              key={itemId}
                              className="flex items-start gap-2 cursor-pointer rounded-xl p-2 hover:bg-secondary/50"
                            >
                              <input
                                type="checkbox"
                                checked={checkedItems.has(itemId)}
                                onChange={() => toggleChecklistItem(itemId)}
                                className="mt-1 h-4 w-4 rounded"
                              />
                              <span className={cn(
                                "text-sm",
                                checkedItems.has(itemId) ? "text-muted-foreground line-through" : "text-foreground",
                              )}>
                                {item}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rubric Reference */}
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <button
                onClick={() => setShowRubric(!showRubric)}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-extrabold text-foreground">IELTS Scoring Rubric</h3>
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
                                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                                  {d}
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
    </DashboardShell>
  );
}
