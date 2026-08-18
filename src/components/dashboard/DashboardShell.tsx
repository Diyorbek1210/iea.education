import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bot,
  BookOpen,
  Calculator,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Mic,
  PenLine,
  Trophy,
  ClipboardCheck,
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
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/vocabulary", label: "Vocabulary", icon: BookOpen },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/task-practice", label: "Task Practice", icon: Target },
  { to: "/model-answers", label: "Model Answers", icon: FileText },
  { to: "/writing-generator", label: "Writing Practice", icon: PenLine },
  { to: "/pronunciation", label: "Pronunciation", icon: Mic },
  { to: "/band-calculator", label: "Band Calculator", icon: Calculator },
  { to: "/resources", label: "Resources", icon: Globe },
  { to: "/requirements", label: "Requirements", icon: GraduationCap },
  { to: "/mock-test", label: "Mock Test", icon: ClipboardCheck },
  { to: "/practice", label: "Practice with AI", icon: Bot },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/community", label: "Community", icon: Users },
] as const;

export function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar p-5 shadow-card transition-transform lg:static lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="mt-8 flex-1 space-y-1 overflow-y-auto" aria-label="Main navigation">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              aria-current={pathname === item.to ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                pathname === item.to
                  ? "bg-gradient-primary text-primary-foreground shadow-card"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/settings"
          onClick={() => setOpen(false)}
          aria-current={pathname === "/settings" ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors mt-auto",
            pathname === "/settings"
              ? "bg-gradient-primary text-primary-foreground shadow-card"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
          <Settings className="h-4 w-4" aria-hidden="true" />
          Settings
        </Link>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-5 py-4 backdrop-blur-md">
          <button
            type="button"
            className="rounded-xl border border-border p-2 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-extrabold text-foreground">{title}</h1>
            {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <SearchDialog />
            <NotificationBell />
            <span className="hidden rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-secondary-foreground sm:block">
              {user.name}
            </span>
          </div>
        </header>

        <main id="main-content" className="p-5 lg:p-8" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}
