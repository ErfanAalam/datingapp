const STEPS = [
  {
    n: "01",
    title: "Create your vibe",
    desc: "Add photos, pick your interests and tell us what you're looking for.",
  },
  {
    n: "02",
    title: "Match your way",
    desc: "Swipe, chat, go live, or drop into random rooms. You pick the pace.",
  },
  {
    n: "03",
    title: "Meet in real life",
    desc: "Video-date first, then plan something special with in-app date ideas.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-20 sm:py-28 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-accent-400 text-sm font-semibold tracking-wide uppercase">
            How it works
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            From spark to story in{" "}
            <span className="gradient-text">three easy steps.</span>
          </h2>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5 sm:gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="glass rounded-3xl p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 text-7xl sm:text-8xl font-black text-white/5 select-none">
                {s.n}
              </div>
              <div className="text-brand-300 text-sm font-semibold">Step {s.n}</div>
              <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-white/70 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
