import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  Clock,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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

interface TaskSection {
  id: string;
  skill: SkillCategory;
  title: string;
  description: string;
  questionTypes: string[];
  estimatedTime: number;
  difficulty: "easy" | "medium" | "hard";
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  options?: string[];
  answer: string | number;
  explanation: string;
}

const TASK_SECTIONS: TaskSection[] = [
  // Listening
  {
    id: "l-note-complete",
    skill: "listening",
    title: "Note Completion",
    description: "Fill in the missing information from a conversation.",
    questionTypes: ["Note Completion"],
    estimatedTime: 10,
    difficulty: "easy",
    questions: [
      { id: "1", text: "The customer's booking reference is ___.", answer: "BK7429", explanation: "The speaker clearly states 'Your booking reference is BK7429'." },
      { id: "2", text: "The hotel room costs £___ per night.", answer: "120", explanation: "The receptionist says 'The room is one hundred and twenty pounds per night'." },
      { id: "3", text: "Check-out time is at ___ am.", answer: "11", explanation: "The speaker mentions 'Check-out is at eleven am'." },
    ],
  },
  {
    id: "l-multiple-choice",
    skill: "listening",
    title: "Multiple Choice",
    description: "Choose the correct answer from three options.",
    questionTypes: ["Multiple Choice"],
    estimatedTime: 15,
    difficulty: "medium",
    questions: [
      { id: "1", text: "What is the main purpose of the meeting?", options: ["A) To discuss budget", "B) To plan an event", "C) To hire staff"], answer: 1, explanation: "The speaker says 'We're here today to plan the annual company event'." },
      { id: "2", text: "When will the project be completed?", options: ["A) March", "B) June", "C) September"], answer: 2, explanation: "The speaker mentions 'We expect to finish by September'." },
    ],
  },
  // Reading
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
  // Writing
  {
    id: "w-task1",
    skill: "writing",
    title: "Writing Task 1 — Graph Description",
    description: "Describe the main features of a graph in at least 150 words.",
    questionTypes: ["Report Writing"],
    estimatedTime: 20,
    difficulty: "medium",
    questions: [
      { id: "1", text: "Describe the changes in internet usage between 2000 and 2020 as shown in the graph. Write at least 150 words.", answer: "", explanation: "A good response should overview the main trend, compare data points, and use appropriate language for describing changes." },
    ],
  },
  {
    id: "w-task2",
    skill: "writing",
    title: "Writing Task 2 — Essay",
    description: "Write a 250-word essay in response to the given topic.",
    questionTypes: ["Essay Writing"],
    estimatedTime: 40,
    difficulty: "hard",
    questions: [
      { id: "1", text: "Some people believe that children should be taught to be competitive. Others think they should learn to cooperate. Discuss both views and give your opinion. Write at least 250 words.", answer: "", explanation: "A strong essay addresses both views with clear position, well-developed ideas, and appropriate vocabulary." },
    ],
  },
  // Speaking
  {
    id: "s-part1",
    skill: "speaking",
    title: "Speaking Part 1 — Interview",
    description: "Answer personal questions about familiar topics.",
    questionTypes: ["Personal Questions"],
    estimatedTime: 5,
    difficulty: "easy",
    questions: [
      { id: "1", text: "Do you work or study?", answer: "", explanation: "Give a clear answer with a reason and brief example." },
      { id: "2", text: "What do you like most about your studies/job?", answer: "", explanation: "Extend your answer with specific details." },
      { id: "3", text: "Do you enjoy reading? Why or why not?", answer: "", explanation: "Provide reasons and examples for your opinion." },
    ],
  },
  {
    id: "s-part2",
    skill: "speaking",
    title: "Speaking Part 2 — Cue Card",
    description: "Describe a topic for 1-2 minutes after 1 minute preparation.",
    questionTypes: ["Monologue"],
    estimatedTime: 3,
    difficulty: "medium",
    questions: [
      { id: "1", text: "Describe a book that you have read recently.\nYou should say:\n- what the book was about\n- why you decided to read it\n- what you liked about it\nand explain whether you would recommend it to others.", answer: "", explanation: "Cover all bullet points, speak for the full 2 minutes, and use varied vocabulary." },
    ],
  },
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
  const [selectedSkill, setSelectedSkill] = useState<SkillCategory | "all">("all");
  const [activeSection, setActiveSection] = useState<TaskSection | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const filteredSections = useMemo(
    () => selectedSkill === "all" ? TASK_SECTIONS : TASK_SECTIONS.filter((s) => s.skill === selectedSkill),
    [selectedSkill],
  );

  const startSection = (section: TaskSection) => {
    setActiveSection(section);
    setCurrentQ(0);
    setUserAnswers({});
    setShowResult(false);
    setTimeLeft(section.estimatedTime * 60);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const checkAnswers = () => {
    setShowResult(true);
  };

  const score = activeSection
    ? activeSection.questions.filter((q) => {
        const userAnswer = userAnswers[q.id];
        if (typeof q.answer === "number") return Number(userAnswer) === q.answer;
        return userAnswer?.toLowerCase().trim() === String(q.answer).toLowerCase().trim();
      }).length
    : 0;

  const resetSection = () => {
    setUserAnswers({});
    setShowResult(false);
    setCurrentQ(0);
  };

  return (
    <DashboardShell title="Task Practice" subtitle="Practice individual IELTS sections">
      <div className="space-y-6">
        {!activeSection ? (
          <>
            {/* Skill Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSkill === "all" ? "hero" : "soft"}
                size="pill"
                onClick={() => setSelectedSkill("all")}
              >
                All Skills
              </Button>
              {(["listening", "reading", "writing", "speaking"] as SkillCategory[]).map((skill) => {
                const Icon = SKILL_ICONS[skill];
                return (
                  <Button
                    key={skill}
                    variant={selectedSkill === skill ? "hero" : "soft"}
                    size="pill"
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <Icon className="mr-1 h-4 w-4" /> {skill.charAt(0).toUpperCase() + skill.slice(1)}
                  </Button>
                );
              })}
            </div>

            {/* Sections */}
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredSections.map((section) => {
                const Icon = SKILL_ICONS[section.skill];
                return (
                  <button
                    key={section.id}
                    onClick={() => startSection(section)}
                    className="rounded-3xl bg-card p-5 text-left shadow-card transition-all hover:shadow-soft"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("mt-1", SKILL_COLORS[section.skill])}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-foreground">{section.title}</p>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {section.questionTypes.map((qt) => (
                            <Badge key={qt} variant="secondary" className="text-[10px]">{qt}</Badge>
                          ))}
                          <Badge variant="secondary" className="text-[10px]">
                            <Clock className="mr-1 h-3 w-3" /> {section.estimatedTime}min
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] capitalize">
                            {section.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          /* Active Section */
          <div className="mx-auto max-w-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-foreground">{activeSection.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {activeSection.questions.length} questions • {activeSection.estimatedTime} min
                </p>
              </div>
              <Button variant="ghost" size="pill" onClick={() => setActiveSection(null)}>
                Back
              </Button>
            </div>

            {/* Progress */}
            <Progress
              value={((currentQ + 1) / activeSection.questions.length) * 100}
              className="h-2"
            />

            {/* Questions */}
            {activeSection.questions.map((q, idx) => (
              <div key={q.id} className="rounded-3xl bg-card p-6 shadow-card">
                <p className="text-xs font-semibold text-muted-foreground">Question {idx + 1}</p>
                <p className="mt-2 whitespace-pre-line font-semibold text-foreground">{q.text}</p>

                {q.options ? (
                  <div className="mt-4 space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswer(q.id, String(optIdx))}
                        className={cn(
                          "w-full rounded-xl border-2 p-3 text-left text-sm transition-all",
                          userAnswers[q.id] === String(optIdx)
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50",
                          showResult && String(optIdx) === String(q.answer) && "border-success bg-success/10 text-success",
                          showResult && userAnswers[q.id] === String(optIdx) && String(optIdx) !== String(q.answer) && "border-destructive bg-destructive/10 text-destructive",
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Type your answer..."
                    value={userAnswers[q.id] ?? ""}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    disabled={showResult}
                    className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                  />
                )}

                {showResult && (
                  <div className={cn(
                    "mt-3 rounded-xl p-3 text-sm",
                    (userAnswers[q.id] ?? "").toLowerCase().trim() === String(q.answer).toLowerCase().trim()
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive",
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      {(userAnswers[q.id] ?? "").toLowerCase().trim() === String(q.answer).toLowerCase().trim() ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span className="font-bold">
                        Correct answer: {q.answer}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Actions */}
            <div className="flex justify-center gap-3">
              {!showResult ? (
                <Button onClick={checkAnswers} variant="hero" size="pill">
                  Check Answers ({score}/{activeSection.questions.length})
                </Button>
              ) : (
                <>
                  <div className="flex items-center gap-2 rounded-2xl bg-card px-6 py-3 shadow-card">
                    <span className="text-lg font-extrabold text-foreground">
                      {score}/{activeSection.questions.length}
                    </span>
                    <span className="text-sm text-muted-foreground">correct</span>
                  </div>
                  <Button onClick={resetSection} variant="soft" size="pill">
                    <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
