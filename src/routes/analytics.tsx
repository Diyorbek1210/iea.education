import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Target,
  Award,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { useAuth } from "@/lib/auth";
import { listMockResults } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import type { SkillType } from "@/shared/types/types";
import { cn } from "@/shared/lib/utils";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — IEA" },
      { name: "description", content: "Detailed performance analytics and progress tracking." },
    ],
  }),
  component: AnalyticsPage,
});

const SKILL_LABELS: Record<SkillType, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

const SKILL_COLORS: Record<SkillType, string> = {
  listening: "#3b82f6",
  reading: "#22c55e",
  writing: "#f97316",
  speaking: "#a855f7",
};

function AnalyticsPage() {
  const { user } = useAuth();
  const { data: mockResults = [] } = useQuery({
    queryKey: ["mock-results"],
    queryFn: listMockResults,
  });

  const myResults = useMemo(
    () => mockResults.filter((r) => r.userId === user?.uid).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [mockResults, user],
  );

  const skillStats = useMemo(() => {
    const skills: SkillType[] = ["listening", "reading", "writing", "speaking"];
    return skills.map((skill) => {
      const scores = myResults.map((r) => r[skill]).filter((s) => s > 0);
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const best = scores.length > 0 ? Math.max(...scores) : 0;
      const recent = scores.slice(-3);
      const older = scores.slice(0, -3);
      const recentAvg = recent.length > 0 ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;
      const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : avg;
      let trend: "improving" | "declining" | "stable" = "stable";
      if (recent.length > 0 && older.length > 0) {
        if (recentAvg > olderAvg + 0.25) trend = "improving";
        else if (recentAvg < olderAvg - 0.25) trend = "declining";
      }
      return { skill, attempts: scores.length, averageScore: avg, bestScore: best, trend };
    });
  }, [myResults]);

  const overallStats = useMemo(() => {
    if (myResults.length === 0) return { average: 0, best: 0, total: 0, latest: 0 };
    const scores = myResults.map((r) => r.overall);
    return {
      average: scores.reduce((a, b) => a + b, 0) / scores.length,
      best: Math.max(...scores),
      total: myResults.length,
      latest: scores[scores.length - 1] ?? 0,
    };
  }, [myResults]);

  const chartData = useMemo(
    () =>
      myResults.map((r, i) => ({
        test: `Test ${i + 1}`,
        date: new Date(r.date).toLocaleDateString(),
        overall: r.overall,
        listening: r.listening,
        reading: r.reading,
        writing: r.writing,
        speaking: r.speaking,
      })),
    [myResults],
  );

  const radarData = useMemo(
    () =>
      skillStats.map((s) => ({
        skill: SKILL_LABELS[s.skill],
        score: s.averageScore,
        fullMark: 9,
      })),
    [skillStats],
  );

  const weakAreas = skillStats.filter((s) => s.averageScore > 0 && s.averageScore < 6);

  return (
    <DashboardShell title="Performance Analytics" subtitle="Track your progress and identify weak areas">
      <div className="space-y-6">
        {myResults.length === 0 ? (
          <div className="rounded-3xl bg-card p-12 text-center shadow-card">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-bold text-foreground">No mock test data yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete mock tests to see your performance analytics here.
            </p>
          </div>
        ) : (
          <>
            {/* Overall Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-2xl bg-card p-4 shadow-card">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Average Band</p>
                <p className="mt-1 text-2xl font-extrabold text-primary">{overallStats.average.toFixed(1)}</p>
              </div>
              <div className="rounded-2xl bg-card p-4 shadow-card">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Best Band</p>
                <p className="mt-1 text-2xl font-extrabold text-success">{overallStats.best.toFixed(1)}</p>
              </div>
              <div className="rounded-2xl bg-card p-4 shadow-card">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Tests Taken</p>
                <p className="mt-1 text-2xl font-extrabold text-foreground">{overallStats.total}</p>
              </div>
              <div className="rounded-2xl bg-card p-4 shadow-card">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Latest Band</p>
                <p className="mt-1 text-2xl font-extrabold text-foreground">{overallStats.latest.toFixed(1)}</p>
              </div>
            </div>

            {/* Band Score Trend */}
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <h3 className="text-lg font-extrabold text-foreground">Band Score Trend</h3>
              <div className="mt-4 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="test" />
                    <YAxis domain={[0, 9]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="overall" stroke="#000" strokeWidth={2} name="Overall" />
                    <Line type="monotone" dataKey="listening" stroke={SKILL_COLORS.listening} name="Listening" />
                    <Line type="monotone" dataKey="reading" stroke={SKILL_COLORS.reading} name="Reading" />
                    <Line type="monotone" dataKey="writing" stroke={SKILL_COLORS.writing} name="Writing" />
                    <Line type="monotone" dataKey="speaking" stroke={SKILL_COLORS.speaking} name="Speaking" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Skill Stats */}
              <div className="rounded-3xl bg-card p-6 shadow-card">
                <h3 className="text-lg font-extrabold text-foreground">Skill Breakdown</h3>
                <div className="mt-4 space-y-4">
                  {skillStats.map((s) => (
                    <div key={s.skill}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-foreground">{SKILL_LABELS[s.skill]}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{s.averageScore.toFixed(1)}</span>
                          {s.trend === "improving" && <TrendingUp className="h-3 w-3 text-success" />}
                          {s.trend === "declining" && <TrendingDown className="h-3 w-3 text-destructive" />}
                          {s.trend === "stable" && <Minus className="h-3 w-3 text-muted-foreground" />}
                        </div>
                      </div>
                      <Progress value={(s.averageScore / 9) * 100} className="h-2" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Best: {s.bestScore.toFixed(1)} • {s.attempts} attempts
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar Chart */}
              <div className="rounded-3xl bg-card p-6 shadow-card">
                <h3 className="text-lg font-extrabold text-foreground">Skill Radar</h3>
                <div className="mt-4 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis domain={[0, 9]} />
                      <Radar name="Average" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Weak Areas */}
            {weakAreas.length > 0 && (
              <div className="rounded-3xl bg-card p-6 shadow-card">
                <h3 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
                  <AlertTriangle className="h-5 w-5 text-warning" /> Areas Needing Attention
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {weakAreas.map((s) => (
                    <div key={s.skill} className="flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-4">
                      <Target className="h-5 w-5 text-warning" />
                      <div>
                        <p className="font-bold text-foreground">{SKILL_LABELS[s.skill]}</p>
                        <p className="text-sm text-muted-foreground">
                          Average: {s.averageScore.toFixed(1)} • Focus on improving this skill
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardShell>
  );
}
