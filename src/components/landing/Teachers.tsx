const teachers = [
  {
    name: "Diyorbek Marakhimov",
    role: "Founder",
    bio: "Speaking and Writing specialist. Trained 1200+ students for the academic exam.",
    initials: "DM",
  },
  {
    name: "Azizbek Mamatqulov",
    role: "Founder",
    bio: "Builds exam strategy systems that turn practice hours into predictable scores.",
    initials: "AM",
  },
];

export function Teachers() {
  return (
    <section id="teachers" className="mx-auto max-w-7xl px-5 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Founders</p>
        <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
          Meet the founders
        </h2>
      </div>

      <div className="mx-auto mt-14 grid max-w-3xl gap-5 sm:grid-cols-2">
        {teachers.map((teacher) => (
          <article key={teacher.name} className="rounded-2xl bg-card p-7 text-center shadow-card">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-lg font-extrabold text-primary-foreground">
              {teacher.initials}
            </span>
            <h3 className="mt-4 text-base font-bold text-foreground">{teacher.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {teacher.role}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{teacher.bio}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
