import { GraduationCap } from "lucide-react";

import { cn } from "@/shared/lib/utils";

export function Logo({
  className,
  wordmark = "IEA",
  showLabel = false,
  label = "STUDENT PORTAL",
  compact = false,
}: {
  className?: string;
  wordmark?: string;
  showLabel?: boolean;
  label?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-hero text-white shadow-brand",
          compact ? "h-9 w-9" : "h-11 w-11",
        )}
      >
        <GraduationCap className={compact ? "h-5 w-5" : "h-6 w-6"} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-black uppercase italic tracking-tight text-brand-700",
            compact ? "text-sm" : "text-lg",
          )}
        >
          {wordmark}
        </span>
        {showLabel && (
          <span className="mt-1 text-[8px] font-black uppercase tracking-[0.4em] text-ink-faint">
            {label}
          </span>
        )}
      </span>
    </div>
  );
}
