import { Link } from "@tanstack/react-router";
import { ClipboardCheck, TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { mockTests } from "@/data/mockTest";
import type { MockResult } from "@/lib/types";
import { cn } from "@/lib/utils";

const chartConfig = {
  overall: { label: "Overall", color: "var(--color-chart-1)" },
  listening: { label: "Listening", color: "var(--color-chart-2)" },
  reading: { label: "Reading", color: "var(--color-chart-3)" },
  writing: { label: "Writing", color: "var(--color-chart-4)" },
  speaking: { label: "Speaking", color: "var(--color-chart-5)" },
} satisfies ChartConfig;

/** Band progression across completed mock tests, shown on the dashboard. */
export function MockProgressChart({ results }: { results: MockResult[] }) {
  const sorted = [...results].sort((a, b) => a.date.localeCompare(b.date));
  const data = sorted.map((r) => {
    const mock = mockTests.find((m) => m.id === r.mockTestId);
    return {
      name: mock ? `Mock ${mock.order}` : (r.mockTestId ?? "Mock"),
      overall: r.overall,
      listening: r.listening,
      reading: r.reading,
      writing: r.writing,
      speaking: r.speaking,
    };
  });

  if (data.length === 0) {
    return (
      <section className="rounded-3xl bg-card p-6 text-center shadow-card sm:p-8">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <ClipboardCheck className="h-6 w-6 text-muted-foreground" />
        </span>
        <p className="mt-3 text-sm font-bold text-foreground">No mock tests completed yet</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
          Take your first IELTS mock test and your band progression chart will appear here.
        </p>
        <Button variant="hero" size="pill" className="mt-4" asChild>
          <Link to="/mock-test">Take a mock test</Link>
        </Button>
      </section>
    );
  }

  const latest = data[data.length - 1]!.overall;
  const previous = data.length > 1 ? data[data.length - 2]!.overall : null;
  const delta = previous !== null ? Math.round((latest - previous) * 10) / 10 : null;

  return (
    <section className="rounded-3xl bg-card p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-foreground">Mock test progress</p>
          <p className="text-xs text-muted-foreground">
            {data.length} of {mockTests.length} mocks completed
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Latest overall
          </p>
          <p className="text-2xl font-extrabold text-foreground">{latest.toFixed(1)}</p>
          {delta !== null && delta !== 0 && (
            <p
              className={cn(
                "flex items-center justify-end gap-1 text-xs font-bold",
                delta > 0 ? "text-success" : "text-destructive",
              )}
            >
              {delta > 0 ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)} vs previous
            </p>
          )}
        </div>
      </div>

      <ChartContainer config={chartConfig} className="mt-4 aspect-auto h-56 w-full sm:h-64">
        <AreaChart data={data} margin={{ left: -20, right: 8 }}>
          <defs>
            <linearGradient id="mockOverallFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
          <YAxis
            domain={[0, 9]}
            tickCount={7}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={11}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Area
            type="monotone"
            dataKey="listening"
            stroke="var(--color-listening)"
            strokeWidth={1.5}
            fill="none"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="reading"
            stroke="var(--color-reading)"
            strokeWidth={1.5}
            fill="none"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="writing"
            stroke="var(--color-writing)"
            strokeWidth={1.5}
            fill="none"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="speaking"
            stroke="var(--color-speaking)"
            strokeWidth={1.5}
            fill="none"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="overall"
            stroke="var(--color-overall)"
            strokeWidth={3}
            fill="url(#mockOverallFill)"
          />
          <ChartLegend content={<ChartLegendContent />} className="pt-2" />
        </AreaChart>
      </ChartContainer>
    </section>
  );
}
