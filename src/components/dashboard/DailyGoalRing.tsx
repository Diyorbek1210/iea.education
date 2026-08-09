const SIZE = 96;
const STROKE = 9;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DailyGoalRing({ todayXp, dailyGoal }: { todayXp: number; dailyGoal: number }) {
  const ratio = dailyGoal > 0 ? Math.min(1, todayXp / dailyGoal) : 0;
  const offset = CIRCUMFERENCE * (1 - ratio);

  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-secondary"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="stroke-primary transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-sm font-extrabold text-foreground">{todayXp}</span>
        <span className="text-[10px] text-muted-foreground">/ {dailyGoal} XP</span>
      </div>
    </div>
  );
}
