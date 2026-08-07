import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    level: typeof search["level"] === "string" ? (search["level"] as string) : "",
    score: Number(search["score"]) || 0,

  }),
  head: () => ({
    meta: [
      { title: "Create your IEA account" },
      {
        name: "description",
        content: "Register for free and unlock IEA video lessons, games and IELTS mock exams.",
      },
      { property: "og:title", content: "Create your IEA account" },
      {
        property: "og:description",
        content: "Your placement level is saved to your profile automatically.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { level, score } = Route.useSearch();
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setBusy(true);
    try {
      await signUp(
        parsed.data.name,
        parsed.data.email,
        parsed.data.password,
        level || "Beginner",
      );
      toast.success("Welcome to IEA!");
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-soft px-5 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mx-auto flex w-fit">
          <Logo />
        </Link>

        <div className="mt-8 rounded-4xl bg-card p-8 shadow-soft">
          <h1 className="text-2xl font-extrabold text-foreground">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {level
              ? `Your placement result (${score}/20) will be saved to your profile.`
              : "Tip: take the placement test first so we can set your level."}
          </p>

          {level ? (
            <div className="mt-5 rounded-2xl bg-secondary px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Detected level
              </p>
              <p className="text-lg font-extrabold text-secondary-foreground">{level}</p>
            </div>
          ) : (
            <Button asChild variant="soft" size="pill" className="mt-5 w-full">
              <Link to="/test">Take the placement test</Link>
            </Button>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={values.name}
                maxLength={100}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                placeholder="Ali Valiyev"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                maxLength={255}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                placeholder="you@example.com"
                className="mt-1.5"
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
                placeholder="At least 6 characters"
                className="mt-1.5"
              />
            </div>
            <Button
              type="submit"
              variant="hero"
              size="pill-lg"
              className="w-full"
              disabled={busy}
            >
              {busy ? "Creating account…" : "Register"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
