import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Calculator, Info, TrendingUp, ArrowRight, RotateCcw } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/band-calculator")({
  head: () => ({
    meta: [
      { title: "Band Calculator — IEA" },
      { name: "description", content: "Calculate your overall IELTS band score from individual skill scores." },
    ],
  }),
  component: BandCalculatorPage,
});

const BAND_DESCRIPTIONS: Record<number, string> = {
  9: "Expert User — Full operational fluency with complete understanding",
  8.5: "Very Good User — Fully operational with only occasional errors",
  8: "Very Good User — Operational with occasional inaccuracies",
  7.5: "Good User — Operational with some inaccuracies and misunderstandings",
  7: "Good User — Generally operational with occasional inaccuracies",
  6.5: "Competent User — Mostly effective with some inaccuracies",
  6: "Competent User — Generally effective despite some inaccuracies",
  5.5: "Modest User — Partial command with noticeable errors",
  5: "Modest User — Frequent problems in understanding",
  4.5: "Limited User — Basic competence with frequent problems",
  4: "Limited User — Frequent breakdowns in communication",
  3.5: "Extremely Limited User — Communicates only basic meaning",
  3: "Very Limited User — Great difficulty understanding and communicating",
  2.5: "Intermittent User — Great difficulty with spoken and written English",
  2: "Non User — Essentially no ability to use the language",
};

const SKILL_NAMES = ["Listening", "Reading", "Writing", "Speaking"] as const;
const SKILL_COLORS = ["text-blue-500", "text-green-500", "text-orange-500", "text-purple-500"] as const;

function calculateOverall(listening: number, reading: number, writing: number, speaking: number): number {
  const avg = (listening + reading + writing + speaking) / 4;
  const remainder = avg % 0.5;
  if (remainder < 0.25) return Math.floor(avg * 2) / 2;
  return Math.ceil(avg * 2) / 2;
}

function BandCalculatorPage() {
  const [scores, setScores] = useState([5.0, 5.0, 5.0, 5.0]);
  const [showGuide, setShowGuide] = useState(false);

  const overall = useMemo(
    () => calculateOverall(scores[0], scores[1], scores[2], scores[3]),
    [scores],
  );

  const weakest = useMemo(() => {
    const min = Math.min(...scores);
    return scores.map((s, i) => (s === min ? SKILL_NAMES[i] : null)).filter(Boolean)[0];
  }, [scores]);

  const improvement = useMemo(() => {
    const needed = Math.max(0, overall - Math.min(...scores));
    return needed > 0 ? `Improve ${weakest} by ${needed.toFixed(1)} band to raise overall.` : "All skills are balanced!";
  }, [overall, scores, weakest]);

  const setScore = (index: number, value: number) => {
    setScores((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const reset = () => setScores([5.0, 5.0, 5.0, 5.0]);

  return (
    <DashboardShell title="Band Score Calculator" subtitle="Calculate your IELTS overall band score">
      <div className="space-y-6">
        {/* Calculator */}
        <div className="rounded-3xl bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-foreground">Enter Your Scores</h3>
            <Button variant="ghost" size="pill" onClick={reset}>
              <RotateCcw className="mr-1 h-4 w-4" /> Reset
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SKILL_NAMES.map((skill, idx) => (
              <div key={skill} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("text-sm font-bold", SKILL_COLORS[idx])}>{skill}</span>
                  <span className="text-xl font-extrabold text-foreground">{scores[idx].toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={9}
                  step={0.5}
                  value={scores[idx]}
                  onChange={(e) => setScore(idx, Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>0</span><span>3</span><span>5</span><span>7</span><span>9</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="rounded-3xl bg-gradient-primary p-8 text-center text-primary-foreground shadow-soft">
          <p className="text-sm font-semibold opacity-80">Overall Band Score</p>
          <p className="mt-2 text-6xl font-extrabold">{overall.toFixed(1)}</p>
          <p className="mt-2 text-sm opacity-80">
            {BAND_DESCRIPTIONS[overall] || ""}
          </p>
        </div>

        {/* Breakdown */}
        <div className="rounded-3xl bg-card p-6 shadow-card">
          <h3 className="text-lg font-extrabold text-foreground mb-4">Score Breakdown</h3>
          <div className="space-y-3">
            {SKILL_NAMES.map((skill, idx) => (
              <div key={skill} className="flex items-center gap-3">
                <span className={cn("w-24 text-sm font-semibold", SKILL_COLORS[idx])}>{skill}</span>
                <Progress value={(scores[idx] / 9) * 100} className="h-3 flex-1" />
                <span className="w-10 text-right text-sm font-bold text-foreground">{scores[idx].toFixed(1)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-secondary p-3">
            <TrendingUp className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <p className="text-sm text-foreground">{improvement}</p>
          </div>
        </div>

        {/* Band Guide */}
        <div className="rounded-3xl bg-card p-6 shadow-card">
          <button onClick={() => setShowGuide(!showGuide)} className="flex w-full items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-extrabold text-foreground">IELTS Band Score Guide</h3>
          </button>
          {showGuide && (
            <div className="mt-4 space-y-2">
              {Object.entries(BAND_DESCRIPTIONS).map(([band, desc]) => (
                <div key={band} className="flex items-start gap-3 rounded-xl p-2">
                  <Badge className="shrink-0 bg-primary/10 text-primary">{band}</Badge>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
