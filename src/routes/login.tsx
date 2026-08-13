import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — IEA" },
      {
        name: "description",
        content: "Sign in to your IEA account to continue your IELTS and English lessons.",
      },
      { property: "og:title", content: "Log in — IEA" },
      { property: "og:description", content: "Access your IEA dashboard, mocks and leaderboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
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
      toast.success(isAdmin ? "Welcome back, admin" : "Welcome back!");
      navigate({ to: isAdmin ? "/admin" : "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-soft px-5 py-6">
      <div className="w-full max-w-xs">
        <Link to="/" className="mx-auto flex w-fit">
          <Logo />
        </Link>

        <div className="mt-3 rounded-3xl bg-card p-4 shadow-soft">
          <h1 className="text-lg font-extrabold text-foreground">Welcome back</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Log in to continue where you left off.
          </p>

          <form onSubmit={handleSubmit} className="mt-3 space-y-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                maxLength={255}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                placeholder="you@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={values.password}
                maxLength={72}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                placeholder="Your password"
                className="mt-1"
              />
            </div>
            <Button type="submit" variant="hero" size="pill" className="w-full" disabled={busy}>
              {busy ? "Signing in…" : "Log in"}
            </Button>
          </form>

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-secondary px-3 py-2 text-xs text-secondary-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>Administrators are redirected to the Admin Panel automatically after login.</p>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            No account yet?{" "}
            <Link to="/test" className="font-semibold text-primary hover:underline">
              Take the placement test
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
