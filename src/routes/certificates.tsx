import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Download,
  TrendingUp,
  Calendar,
  Flame,
  Star,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { listMockResults, listStudyPlans, getUserProfile } from "@/lib/db";
import { XP_LEVELS, computeXpLevel } from "@/lib/gamification";
import { BADGES } from "@/data/badges";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "Certificates & Reports — IEA" },
      { name: "description", content: "View your progress reports and download certificates." },
    ],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  const { user } = useAuth();

  const { data: mockResults = [] } = useQuery({
    queryKey: ["mock-results"],
    queryFn: listMockResults,
  });

  const { data: plans = [] } = useQuery({
    queryKey: ["study-plans"],
    queryFn: listStudyPlans,
  });

  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.uid],
    queryFn: () => getUserProfile(user!.uid),
    enabled: !!user?.uid,
  });

  const myResults = useMemo(
    () =>
      mockResults
        .filter((r) => r.userId === user?.uid)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [mockResults, user],
  );

  const report = useMemo(() => {
    if (myResults.length === 0) return null;
    const best = myResults.reduce(
      (best, r) => (r.overall > best.overall ? r : best),
      myResults[0]!,
    );
    const avgListening = myResults.reduce((s, r) => s + r.listening, 0) / myResults.length;
    const avgReading = myResults.reduce((s, r) => s + r.reading, 0) / myResults.length;
    const avgWriting = myResults.reduce((s, r) => s + r.writing, 0) / myResults.length;
    const avgSpeaking = myResults.reduce((s, r) => s + r.speaking, 0) / myResults.length;
    const avgOverall = myResults.reduce((s, r) => s + r.overall, 0) / myResults.length;

    const first = myResults[myResults.length - 1]!;
    const improvement = best.overall - first.overall;

    return {
      totalTests: myResults.length,
      bestOverall: best.overall,
      avgOverall: Math.round(avgOverall * 10) / 10,
      avgListening: Math.round(avgListening * 10) / 10,
      avgReading: Math.round(avgReading * 10) / 10,
      avgWriting: Math.round(avgWriting * 10) / 10,
      avgSpeaking: Math.round(avgSpeaking * 10) / 10,
      improvement: Math.round(improvement * 10) / 10,
      bestDate: best.date,
      firstDate: first.date,
      best,
    };
  }, [myResults]);

  const xpLevel = profile ? computeXpLevel(profile.xp ?? 0) : null;
  const unlockedBadges = profile?.badges ?? [];

  function handlePrint() {
    window.print();
  }

  return (
    <DashboardShell
      title="Certificates & Reports"
      subtitle="Track your progress and download certificates"
    >
      <div className="space-y-8">
        {/* Progress Report */}
        {report ? (
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-primary" />
                <h2 className="text-lg font-extrabold text-foreground">Progress Report</h2>
              </div>
              <Button onClick={handlePrint} variant="soft" size="pill" className="no-print">
                <Download className="mr-2 h-4 w-4" /> Print / Save PDF
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="rounded-2xl bg-primary/5 p-4 text-center">
                <p className="text-3xl font-extrabold text-primary">{report.bestOverall}</p>
                <p className="text-xs text-muted-foreground mt-1">Best Overall Band</p>
              </div>
              <div className="rounded-2xl bg-primary/5 p-4 text-center">
                <p className="text-3xl font-extrabold text-foreground">{report.avgOverall}</p>
                <p className="text-xs text-muted-foreground mt-1">Average Band</p>
              </div>
              <div className="rounded-2xl bg-primary/5 p-4 text-center">
                <p className="text-3xl font-extrabold text-foreground">{report.totalTests}</p>
                <p className="text-xs text-muted-foreground mt-1">Mock Tests Taken</p>
              </div>
              <div className="rounded-2xl bg-primary/5 p-4 text-center">
                <p
                  className={cn(
                    "text-3xl font-extrabold",
                    report.improvement >= 0 ? "text-green-500" : "text-red-500",
                  )}
                >
                  {report.improvement >= 0 ? "+" : ""}
                  {report.improvement}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Band Improvement</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-foreground mb-3">Skill Breakdown (Average)</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Listening", value: report.avgListening, color: "bg-blue-500" },
                { label: "Reading", value: report.avgReading, color: "bg-green-500" },
                { label: "Writing", value: report.avgWriting, color: "bg-orange-500" },
                { label: "Speaking", value: report.avgSpeaking, color: "bg-purple-500" },
              ].map((s) => (
                <div key={s.label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{s.label}</span>
                    <span className="text-sm font-bold text-foreground">{s.value}</span>
                  </div>
                  <Progress value={(s.value / 9) * 100} className="h-2" />
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                First test: {new Date(report.firstDate).toLocaleDateString()} • Latest test:{" "}
                {new Date(report.bestDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-card p-12 shadow-card text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-bold text-foreground">No mock tests yet</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Complete at least one mock test to see your progress report.
            </p>
            <a href="/mock-test">
              <Button variant="hero" size="pill" className="mt-4">
                Take a Mock Test
              </Button>
            </a>
          </div>
        )}

        {/* Gamification Summary */}
        {profile && (
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <Star className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-extrabold text-foreground">Your Achievements</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              <div className="rounded-2xl bg-amber-500/5 p-4 text-center">
                <p className="text-2xl font-extrabold text-foreground">{profile.xp ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Total XP</p>
                {xpLevel && (
                  <Badge variant="secondary" className="mt-1 text-[10px]">
                    Level {xpLevel.level}: {xpLevel.title}
                  </Badge>
                )}
              </div>
              <div className="rounded-2xl bg-orange-500/5 p-4 text-center">
                <Flame className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                <p className="text-2xl font-extrabold text-foreground">{profile.streak ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Day Streak</p>
              </div>
              <div className="rounded-2xl bg-green-500/5 p-4 text-center">
                <Award className="h-6 w-6 text-green-500 mx-auto mb-1" />
                <p className="text-2xl font-extrabold text-foreground">{unlockedBadges.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Badges Earned</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-foreground mb-3">Earned Badges</h3>
            <div className="flex flex-wrap gap-3">
              {BADGES.map((badge) => {
                const earned = unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={cn(
                      "rounded-xl p-3 text-center w-24",
                      earned ? "bg-primary/10" : "bg-muted/50 opacity-40",
                    )}
                  >
                    <Award
                      className={cn(
                        "h-6 w-6 mx-auto mb-1",
                        earned ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <p className="text-[10px] font-bold text-foreground leading-tight">
                      {badge.name}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Certificate */}
        <div className="rounded-3xl bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-extrabold text-foreground">Certificate</h2>
            </div>
            {report && (
              <Button onClick={handlePrint} variant="hero" size="pill" className="no-print">
                <Download className="mr-2 h-4 w-4" /> Download Certificate
              </Button>
            )}
          </div>

          {report ? (
            <div
              id="certificate"
              className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10 p-8 sm:p-12 print:border-primary print:shadow-none"
            >
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 h-16 w-16 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 h-16 w-16 border-t-2 border-r-2 border-primary/30 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 h-16 w-16 border-b-2 border-l-2 border-primary/30 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 h-16 w-16 border-b-2 border-r-2 border-primary/30 rounded-br-2xl" />

              <div className="text-center space-y-4">
                <Award className="h-16 w-16 text-primary mx-auto" />
                <p className="text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase">
                  Certificate of Achievement
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  IELTS Preparation
                </h2>

                <div className="w-16 h-0.5 bg-primary mx-auto" />

                <p className="text-sm text-muted-foreground">This is to certify that</p>
                <p className="text-xl sm:text-2xl font-extrabold text-primary">
                  {user?.name ?? "Student"}
                </p>

                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  has successfully completed {report.totalTests} IELTS mock test
                  {report.totalTests > 1 ? "s" : ""} and achieved
                </p>

                <p className="text-5xl sm:text-6xl font-extrabold text-foreground">
                  Band {report.bestOverall}
                </p>

                <div className="flex justify-center gap-8 text-sm">
                  <div>
                    <p className="text-muted-foreground">Listening</p>
                    <p className="font-bold text-foreground">{report.avgListening}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reading</p>
                    <p className="font-bold text-foreground">{report.avgReading}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Writing</p>
                    <p className="font-bold text-foreground">{report.avgWriting}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Speaking</p>
                    <p className="font-bold text-foreground">{report.avgSpeaking}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-xs text-muted-foreground">
                    Issued on{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">IEA — IELTS Exam Academy</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-bold text-foreground">
                Complete mock tests to earn your certificate
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your certificate will be generated based on your mock test performance.
              </p>
            </div>
          )}
        </div>

        {/* Mock Test History */}
        {myResults.length > 0 && (
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <h2 className="text-lg font-extrabold text-foreground mb-4">Mock Test History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left text-xs font-bold text-muted-foreground">Date</th>
                    <th className="py-2 text-center text-xs font-bold text-muted-foreground">
                      Listening
                    </th>
                    <th className="py-2 text-center text-xs font-bold text-muted-foreground">
                      Reading
                    </th>
                    <th className="py-2 text-center text-xs font-bold text-muted-foreground">
                      Writing
                    </th>
                    <th className="py-2 text-center text-xs font-bold text-muted-foreground">
                      Speaking
                    </th>
                    <th className="py-2 text-center text-xs font-bold text-muted-foreground">
                      Overall
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myResults.map((r) => (
                    <tr key={r.id} className="border-b border-border/50">
                      <td className="py-2.5 text-foreground">
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 text-center text-foreground">{r.listening}</td>
                      <td className="py-2.5 text-center text-foreground">{r.reading}</td>
                      <td className="py-2.5 text-center text-foreground">{r.writing}</td>
                      <td className="py-2.5 text-center text-foreground">{r.speaking}</td>
                      <td className="py-2.5 text-center">
                        <Badge
                          variant={r.overall >= 7 ? "default" : "secondary"}
                          className="font-bold"
                        >
                          {r.overall}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
