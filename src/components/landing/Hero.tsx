import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Users } from "lucide-react";

import heroStudent from "@/assets/hero-student.jpg";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-soft">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-1.5 text-xs font-semibold text-primary shadow-card">
            <Sparkles className="h-3.5 w-3.5" />
            100% free learning platform
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            Free <span className="text-gradient-primary">IELTS &amp; English</span> Access
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Learn English from zero or push your band score higher — with video lessons,
            interactive games, full mock exams and a live leaderboard. Start with a quick
            placement test and we&apos;ll build the path for you.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="pill-lg">
              <Link to="/test">
                Join Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="pill-lg">
              <a href="#courses">Explore Courses</a>
            </Button>
          </div>

          <dl className="mt-10 flex flex-wrap gap-8">
            {[
              ["3000+", "Active learners"],
              ["120+", "Video lessons"],
              ["7.5", "Average band"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-2xl font-extrabold text-foreground">{value}</dt>
                <dd className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="rounded-4xl bg-card p-6 shadow-soft">
            <Logo />
            <img
              src={heroStudent}
              alt="Student learning English with IEA"
              width={1024}
              height={1024}
              className="mt-6 aspect-[4/3] w-full rounded-3xl object-cover"
            />
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-secondary px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary">
                <Users className="h-4 w-4 text-primary-foreground" />
              </span>
              <p className="text-sm font-semibold text-secondary-foreground">
                Trusted by 3000+ learners
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
