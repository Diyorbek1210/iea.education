import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

export function AppHeader({
  title,
  subtitle,
  actions,
  eyebrow,
  className,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden bg-gradient-hero shadow-header rounded-b-[2rem] no-print",
        className,
      )}
    >
      {/* Decorative circles */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-12 h-[120px] w-[120px] rounded-full bg-accent-500/12"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-14 right-6 h-[80px] w-[80px] rounded-full bg-white/5"
      />

      <div className="relative mx-auto flex w-full max-w-4xl items-start justify-between gap-4 px-6 pb-8 pt-7 sm:px-8">
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-2.5 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
              {eyebrow}
            </p>
          )}
          <h1 className="text-[28px] font-extrabold tracking-[0.5px] text-white">{title}</h1>
          {subtitle && <p className="mt-1 text-[13px] font-bold text-white/50">{subtitle}</p>}
          {/* Accent line: dot + bar */}
          <div className="mt-4 flex items-center gap-1.5">
            <span className="h-[6px] w-[6px] rounded-full bg-accent-500" />
            <span className="h-[6px] w-10 rounded-full bg-accent-500" />
          </div>
        </div>

        {actions && <div className="flex shrink-0 items-center gap-2.5">{actions}</div>}
      </div>
    </header>
  );
}

export function HeaderAction({
  icon,
  label,
  onClick,
  badge,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.12] text-white transition-all duration-300 hover:bg-accent-500/80 active:scale-95"
    >
      {icon}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[9px] font-black text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}
