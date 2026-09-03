import { GraduationCap } from "lucide-react";

import { cn } from "@/shared/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary shadow-card">
        <GraduationCap className="h-6 w-6 text-primary-foreground" />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-foreground">IEA</span>
    </div>
  );
}
