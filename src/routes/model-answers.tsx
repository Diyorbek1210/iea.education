import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BookOpen, Headphones, Star, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MODEL_ANSWERS, getAnswersByCategory, getAnswersBySkill, type ModelAnswer } from "@/data/modelAnswers";
import { listModelAnswers } from "@/lib/db";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/model-answers")({
  head: () => ({
    meta: [
      { title: "Model Answers — IEA" },
      { name: "description", content: "Band-scored essays, speaking samples, and reading/listening guides with explanations." },
    ],
  }),
  component: ModelAnswersPage,
});

function ModelAnswersPage() {
  const { data: dbAnswers } = useQuery({ queryKey: ["model-answers"], queryFn: listModelAnswers });
  const allAnswers: ModelAnswer[] = dbAnswers?.length ? dbAnswers : MODEL_ANSWERS;

  const [skillFilter, setSkillFilter] = useState<"all" | "writing" | "speaking" | "reading" | "listening">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const answers = skillFilter === "all"
    ? allAnswers
    : allAnswers.filter((a) => a.skill === skillFilter);

  return (
    <DashboardShell title="Model Answers" subtitle="Band-scored essays, speaking samples, and reading/listening guides">
      <div className="space-y-6">
        {/* Skill Filter */}
        <div className="flex flex-wrap gap-2">
          {(["all", "writing", "speaking", "reading", "listening"] as const).map((skill) => (
            <Button
              key={skill}
              variant={skillFilter === skill ? "hero" : "soft"}
              size="pill"
              onClick={() => setSkillFilter(skill)}
            >
              {skill === "reading" && <BookOpen className="mr-1 h-4 w-4" />}
              {skill === "listening" && <Headphones className="mr-1 h-4 w-4" />}
              {skill.charAt(0).toUpperCase() + skill.slice(1)}
            </Button>
          ))}
        </div>

        {/* Answers */}
        <div className="space-y-4">
          {answers.map((answer) => (
            <div key={answer.id} className="rounded-3xl bg-card shadow-card overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === answer.id ? null : answer.id)}
                className="w-full p-5 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={cn(
                        answer.skill === "writing" ? "bg-orange-500/10 text-orange-500" :
                        answer.skill === "speaking" ? "bg-purple-500/10 text-purple-500" :
                        answer.skill === "reading" ? "bg-green-500/10 text-green-500" :
                        "bg-blue-500/10 text-blue-500",
                      )}>
                        {answer.skill}
                      </Badge>
                      <Badge className="bg-primary/10 text-primary">
                        <Star className="mr-1 h-3 w-3" /> Band {answer.band}
                      </Badge>
                      <Badge variant="secondary">{answer.category}</Badge>
                    </div>
                    <h3 className="mt-2 text-lg font-extrabold text-foreground">{answer.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{answer.prompt}</p>
                  </div>
                  {expandedId === answer.id ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                </div>
              </button>

              {expandedId === answer.id && (
                <div className="border-t border-border p-5 space-y-6">
                  {/* Prompt */}
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Question</p>
                    <p className="rounded-xl bg-secondary p-4 text-sm text-foreground">{answer.prompt}</p>
                  </div>

                  {/* Answer */}
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Model Answer</p>
                    <div className="rounded-xl bg-secondary p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {answer.answer}
                    </div>
                  </div>

                  {/* Criteria Scores */}
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Band Score Breakdown</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {answer.criteria.map((c) => (
                        <div key={c.label} className="rounded-xl border border-border p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-foreground">{c.label}</span>
                            <Badge className="bg-primary/10 text-primary">{c.band}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{c.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                      <Lightbulb className="mr-1 inline h-3 w-3" /> Key Takeaways
                    </p>
                    <ul className="space-y-2">
                      {answer.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
