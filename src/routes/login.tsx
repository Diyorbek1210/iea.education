import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/Logo";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — IEA" },
      {
        name: "description",
        content: "Sign in to your IEA account to continue your English and IELTS lessons.",
      },
      { property: "og:title", content: "Sign in — IEA" },
      {
        property: "og:description",
        content: "Access your dashboard, mock tests and the leaderboard.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!values.email.trim() || !values.password) {
      toast.error("Enter your email and password");
      return;
    }
    setBusy(true);
    try {
      const { isAdmin } = await signIn(values.email, values.password);
      toast.success(isAdmin ? "Welcome back, admin!" : "Welcome back!");
      navigate({ to: isAdmin ? "/admin" : "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface px-5 py-6">
      {/* Floating blobs */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-accent-200/40 blur-3xl animate-float"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[-6rem] top-1/4 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-accent-100/50 blur-3xl"
      />

      <div className="relative w-full max-w-lg">
        <div className="mb-7 flex flex-col items-center gap-4">
          <Logo wordmark="IEA" showLabel label="STUDENT PORTAL" />
        </div>

        <div className="rounded-5xl border border-slate-200/70 bg-white p-8 shadow-lift sm:p-9">
          <h1 className="text-2xl font-black tracking-tighter text-ink">Welcome back</h1>
          <p className="mt-1.5 text-sm font-medium text-ink-soft">
            Sign in to continue your learning journey.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="ml-1">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  maxLength={255}
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                  placeholder="you@example.com"
                  className="pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="ml-1">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={values.password}
                  maxLength={72}
                  onChange={(e) => setValues({ ...values, password: e.target.value })}
                  placeholder="Your password"
                  className="pl-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-ink-faint transition-colors hover:text-ink"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="hero" size="pill-lg" className="w-full" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-rose-600">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-[11px] font-bold leading-snug">
              Admins are automatically taken to the admin panel after signing in.
            </p>
          </div>

          <p className="mt-6 text-center text-xs font-semibold text-ink-soft">
            No account?{" "}
            <Link to="/test" className="font-black text-brand-600 hover:text-accent-600">
              Take the test
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
