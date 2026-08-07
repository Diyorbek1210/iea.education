import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Aziza T.",
    result: "Band 5.5 → 7.5",
    text: "The placement test put me in the right track immediately. Four months later I got the band I needed for my visa.",
  },
  {
    name: "Jasur B.",
    result: "Beginner → B1",
    text: "I started with zero grammar. The games made vocabulary stick, and the videos never felt boring.",
  },
  {
    name: "Malika S.",
    result: "Band 6.0 → 8.0",
    text: "Full mock tests every week and honest feedback. The leaderboard kept me competitive with myself.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-card/60 py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Testimonials</p>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            Results our learners talk about
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure key={item.name} className="rounded-2xl bg-background p-7 shadow-card">
              <Quote className="h-7 w-7 text-primary/30" />
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                “{item.text}”
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <div>
                  <p className="text-sm font-bold text-foreground">{item.name}</p>
                  <p className="text-xs font-semibold text-primary">{item.result}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
