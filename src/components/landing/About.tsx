import { BookOpen, Globe2, Target, Trophy } from "lucide-react";

const points = [
  {
    icon: BookOpen,
    title: "Structured lessons",
    text: "Every video is mapped to a skill and a level, so you always know what to study next.",
  },
  {
    icon: Target,
    title: "Placement first",
    text: "A 20-question test defines your level before you register — no guesswork.",
  },
  {
    icon: Trophy,
    title: "Real mock exams",
    text: "Full Listening, Reading, Writing and Speaking mocks with instant band estimates.",
  },
  {
    icon: Globe2,
    title: "Open to everyone",
    text: "Free access for every learner, anywhere. Ambition is the only requirement.",
  },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">About IEA</p>
        <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
          An English academy that fits into your day
        </h2>
        <p className="mt-4 text-muted-foreground">
          IEA — IELTS &amp; English Access — is a free learning platform built for students who
          want measurable progress. Learn at your pace, test yourself often, and see exactly how
          far you&apos;ve come.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((point) => (
          <div
            key={point.title}
            className="rounded-2xl bg-card p-6 shadow-card transition-transform hover:-translate-y-1"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
              <point.icon className="h-5 w-5 text-primary" />
            </span>
            <h3 className="mt-4 text-base font-bold text-foreground">{point.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
