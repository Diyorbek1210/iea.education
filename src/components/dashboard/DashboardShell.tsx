import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Bot,
  BookOpen,
  Calculator,
  Globe,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Trophy,
  ClipboardCheck,
  Route,
  X,
  FileText,
  Target,
  Users,
  Settings,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Logo } from "@/components/Logo";
import { NotificationBell } from "@/components/NotificationBell";
import { SearchDialog } from "@/components/SearchDialog";
import { useAuth } from "@/lib/auth";
import { cn } from "@/shared/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/learn", label: "Learning Path", icon: Route },
  { to: "/mock-test", label: "Mock Test", icon: ClipboardCheck },
  { to: "/task-practice", label: "Task Practice", icon: Target },
  { to: "/practice", label: "Practice with AI", icon: Bot },
  { to: "/vocabulary", label: "Vocabulary", icon: BookOpen },
  { to: "/model-answers", label: "Model Answers", icon: FileText },
  { to: "/band-calculator", label: "Band Calculator", icon: Calculator },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/resources", label: "Resources", icon: Globe },
  { to: "/requirements", label: "Requirements", icon: GraduationCap },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/community", label: "Community", icon: Users },
  { to: "/certificates", label: "Certificates", icon: Award },
] as const;

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function NavItem({
  to,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300",
        active
          ? "bg-gradient-to-r from-brand-700 to-brand-600 text-white shadow-brand"
          : "text-slate-500 hover:bg-slate-50 hover:text-brand-700",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
          active
            ? "bg-white/15"
            : "bg-slate-100 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600",
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="text-[12px] font-bold tracking-wide">{label}</span>
    </Link>
  );
}

export function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
    if (open) setOpen(false);
  }, [loading, user, navigate, pathname, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/login" });
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-600" />
          <p className="text-[11px] font-black uppercase tracking-widest text-ink-soft">Loading…</p>
        </div>
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-2 pt-2">
        <Logo compact showLabel label="STUDENT PORTAL" />
        <button
          type="button"
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-700 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-7 px-2 text-[9px] font-black uppercase tracking-[0.3em] text-ink-faint">
        Menu
      </p>

      <nav className="mt-3 flex-1 space-y-1 overflow-y-auto pr-0.5" aria-label="Main navigation">
        {nav.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            active={pathname === item.to}
            onClick={() => setOpen(false)}
          />
        ))}
      </nav>

      <div className="mt-4 border-t border-slate-200/70 pt-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[12px] font-bold tracking-wide text-rose-500 transition-all duration-300 hover:bg-rose-50 hover:text-rose-600"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </span>
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-2xl focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 flex-col border-r border-slate-200/70 bg-white p-5 lg:flex">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-brand-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-[280px] bg-white shadow-lift transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Mobile menu"
      >
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-[12px] font-black uppercase tracking-widest text-ink">
              {title}
            </h1>
            {subtitle && (
              <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {subtitle}
              </p>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <SearchDialog />
            <NotificationBell />
            <Link
              to="/settings"
              aria-current={pathname === "/settings" ? "page" : undefined}
              className={cn(
                "hidden h-10 w-10 items-center justify-center rounded-full bg-white text-ink-soft transition-all duration-300 hover:bg-brand-50 hover:text-brand-700 sm:flex",
              )}
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-50 text-[13px] font-black text-brand-700 transition-all duration-300 hover:bg-brand-100"
              aria-label="Profile"
            >
              {initials(user.name) || "ST"}
            </Link>
          </div>
        </header>

        <main
          id="main-content"
          className="mx-auto w-full max-w-4xl animate-fade-up px-4 py-6 sm:px-6 lg:px-8"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
