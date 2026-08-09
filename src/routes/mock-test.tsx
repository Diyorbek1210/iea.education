import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ClipboardCheck, Lock, PlayCircle } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { mockTests } from "@/data/mockTest";
import { useAuth } from "@/lib/auth";
import { listMockResults } from "@/lib/db";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mock-test")({
  head: () => ({
    meta: [
      { title: "IELTS Mock Tests — IEA" },
      {
        name: "description",
        content: "Ten full IELTS mock tests — complete them in order to track your progress.",
      },
      { property: "og:title", content: "IELTS Mock Tests — IEA" },
      {
        property: "og:description",
        content: "Complete mock tests in order and track your band scores.",
      },
    ],
  }),
  component: MockTestListPage,
});

function MockTestListPage() {
  const { user } = useAuth();
  const { data: results = [] } = useQuery({
    queryKey: ["mock-results"],
    queryFn: listMockResults,
  });

  const completed = new Set(user?.completedMockTests ?? []);
  const myResults = results.filter((r) => r.userId === user?.uid);

  return (
    <DashboardShell
      title="IELTS Mock Tests"
      subtitle="Complete each mock in order to unlock the next"
    >
      <div className="mx-auto max-w-3xl space-y-4">
        {mockTests.map((mock, index) => {
          const isDone = completed.has(mock.id);
          const previous = index > 0 ? mockTests[index - 1] : null;
          const isUnlocked = index === 0 || (previous ? completed.has(previous.id) : true);
          const isLocked = !isDone && !isUnlocked;
          const result = myResults.find((r) => r.mockTestId === mock.id);

          return (
            <div
              key={mock.id}
              className={cn(
                "flex flex-wrap items-center gap-4 rounded-3xl p-6 shadow-card",
                isDone ? "bg-gradient-primary" : isLocked ? "bg-secondary opacity-70" : "bg-card",
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                  isDone ? "bg-primary-foreground/20" : "bg-secondary",
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                ) : isLocked ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ClipboardCheck className="h-5 w-5 text-foreground" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-extrabold",
                    isDone ? "text-primary-foreground" : "text-foreground",
                  )}
                >
                  {mock.title}
                </p>
                <p
                  className={cn(
                    "mt-1 text-xs",
                    isDone ? "text-primary-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {isDone
                    ? `Completed · Overall band ${result?.overall.toFixed(1) ?? "—"}`
                    : isLocked
                      ? `Complete ${previous?.title} first to unlock`
                      : "Reading · Listening · Writing · Speaking"}
                </p>
              </div>
              {!isDone && !isLocked && (
                <Button asChild variant="hero" size="pill" className="shrink-0">
                  <Link to="/mock-test/$mockId" params={{ mockId: mock.id }}>
                    <PlayCircle className="h-4 w-4" /> Start
                  </Link>
                </Button>
              )}
              {isLocked && (
                <Button variant="soft" size="pill" disabled className="shrink-0">
                  <Lock className="h-4 w-4" /> Locked
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}
