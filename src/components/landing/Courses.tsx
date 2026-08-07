import { Link } from "@tanstack/react-router";
import { BookMarked, Headphones, Mic, PenLine, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const courses = [
  {
    icon: Mic,
    title: "IELTS Speaking",
    text: "Fluency drills, part 1–3 strategies and pronunciation feedback loops.",
    tag: "All levels",
  },
  {
    icon: Headphones,
    title: "IELTS Listening",
    text: "Prediction techniques, accents training and section-by-section practice.",
    tag: "Band 5–8",
  },
  {
    icon: BookMarked,
    title: "IELTS Reading",
    text: "Skimming, scanning and question-type rules for academic passages.",
    tag: "Band 5–8",
  },
  {
    icon: PenLine,
    title: "IELTS Writing",
    text: "Task 1 data language and Task 2 essay frameworks with model answers.",
    tag: "Band 6+",
  },
  {
    icon: Sparkles,
    title: "General English",
    text: "Grammar, everyday vocabulary and speaking confidence from zero upward.",
    tag: "A1–C1",
  },
];

export function Courses() {
  return (
    <section id="courses" className="bg-card/60 py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Courses</p>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
              Choose your track
            </h2>
            <p className="mt-3 text-muted-foreground">
              Five learning paths, one platform. Take the placement test and we&apos;ll recommend
              where to start.
            </p>
          </div>
          <Button asChild variant="hero" size="pill">
            <Link to="/test">Take the placement test</Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.title}
              className="group rounded-2xl bg-background p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary">
                <course.icon className="h-5 w-5 text-primary-foreground" />
              </span>
              <div className="mt-5 flex items-center gap-3">
                <h3 className="text-lg font-bold text-foreground">{course.title}</h3>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                  {course.tag}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{course.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
