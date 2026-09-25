import { cn } from "@/shared/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("shimmer rounded-2xl bg-slate-200/70", className)} {...props} />;
}

export { Skeleton };
