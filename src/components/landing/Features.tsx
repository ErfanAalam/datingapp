type Feature = {
  title: string;
  desc: string;
  icon: string;
  accent: string;
};

const FEATURES: Feature[] = [
  {
    title: "HD Video & Audio calls",
    desc: "Crystal-clear 1:1 calls with AR filters and beauty mode built in.",
    icon: "📹",
    accent: "from-brand-500/30 to-accent-500/10",
  },
  {
    title: "Chats & fun groups",
    desc: "Private DMs, voice notes, stickers and topic-based group rooms.",
    icon: "💬",
    accent: "from-accent-500/30 to-brand-500/10",
  },
  {
    title: "Random chat roulette",
    desc: "Tap once to meet someone new — safe, skippable, and lightning fast.",
    icon: "🎲",
    accent: "from-brand-400/30 to-pink-500/10",
  },
  {
    title: "Nearby matching",
    desc: "See who's around with smart distance filters and live availability.",
    icon: "📍",
    accent: "from-rose-500/30 to-brand-500/10",
  },
  {
    title: "Live streaming rooms",
    desc: "Go live, host date nights, and receive virtual gifts from your fans.",
    icon: "🎥",
    accent: "from-accent-400/30 to-purple-500/10",
  },
  {
    title: "Short videos (Moments)",
    desc: "Swipe through fun, flirty reels to discover vibes before matching.",
    icon: "✨",
    accent: "from-pink-500/30 to-brand-500/10",
  },
  {
    title: "AI matchmaking",
    desc: "Our compatibility engine learns your vibe and surfaces the best picks.",
    icon: "🧠",
    accent: "from-violet-500/30 to-brand-500/10",
  },
  {
    title: "Icebreaker games",
    desc: "Break the silence with trivia, truth-or-dare and couple quizzes.",
    icon: "🎮",
    accent: "from-fuchsia-500/30 to-accent-500/10",
  },
  {
    title: "Virtual gifts & coins",
    desc: "Send gifts, unlock perks, and tip creators you love.",
    icon: "🎁",
    accent: "from-amber-500/30 to-brand-500/10",
  },
  {
    title: "Verified safe profiles",
    desc: "Photo + mobile verification and AI moderation keep Luvora safe.",
    icon: "🛡️",
    accent: "from-emerald-500/30 to-accent-500/10",
  },
  {
    title: "Refer & earn",
    desc: "Invite friends and earn coins every time they join or go premium.",
    icon: "🤝",
    accent: "from-sky-500/30 to-accent-500/10",
  },
  {
    title: "Daily tasks, free coins",
    desc: "Complete small tasks, spin the wheel and earn coins every day.",
    icon: "🪙",
    accent: "from-yellow-500/30 to-brand-500/10",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-brand-300 text-sm font-semibold tracking-wide uppercase">
            Everything you need, in one app
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            More than matches —{" "}
            <span className="gradient-text">Luvora is a whole vibe.</span>
          </h2>
          <p className="mt-4 text-white/70">
            From the first hello to your first date night, Luvora packs every
            feature you&apos;d expect from a modern dating app and then some.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-5 sm:p-6 transition hover:-translate-y-1 hover:border-white/25"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-linear-to-br ${f.accent} border border-white/10`}
              >
                <span>{f.icon}</span>
              </div>
              <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
              <p className="mt-1 text-white/70 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
