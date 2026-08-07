const teachers = [
  {
    name: "Diyorbek M.",
    role: "Founder & IELTS Coach",
    band: "Band 8.5",
    bio: "Speaking and Writing specialist. Trained 1200+ students for the academic exam.",
    initials: "DM",
  },
  {
    name: "Nilufar A.",
    role: "Listening & Reading Lead",
    band: "Band 8.0",
    bio: "Builds exam strategy systems that turn practice hours into predictable scores.",
    initials: "NA",
  },
  {
    name: "Sardor K.",
    role: "General English Tutor",
    band: "CELTA",
    bio: "Takes absolute beginners to confident conversation in a single course cycle.",
    initials: "SK",
  },
  {
    name: "Emma R.",
    role: "Native Speaking Partner",
    band: "Native",
    bio: "Weekly speaking clubs, pronunciation clinics and real-life fluency practice.",
    initials: "ER",
  },
];

export function Teachers() {
  return (
    <section id="teachers" className="mx-auto max-w-7xl px-5 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Teachers</p>
        <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
          Learn from examiners &amp; coaches
        </h2>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {teachers.map((teacher) => (
          <article key={teacher.name} className="rounded-2xl bg-card p-7 text-center shadow-card">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-lg font-extrabold text-primary-foreground">
              {teacher.initials}
            </span>
            <h3 className="mt-4 text-base font-bold text-foreground">{teacher.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {teacher.role}
            </p>
            <span className="mt-3 inline-block rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-secondary-foreground">
              {teacher.band}
            </span>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{teacher.bio}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
