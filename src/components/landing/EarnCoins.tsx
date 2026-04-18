const TASKS = [
  { emoji: "✅", label: "Daily check-in", coins: 10 },
  { emoji: "📸", label: "Upload a new moment", coins: 25 },
  { emoji: "🎯", label: "Complete your profile", coins: 100 },
  { emoji: "🤝", label: "Invite a friend", coins: 150 },
  { emoji: "🎥", label: "Host a live for 5 min", coins: 80 },
  { emoji: "💬", label: "Start 3 new chats", coins: 30 },
];

export function EarnCoins() {
  return (
    <section id="earn" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="text-brand-300 text-sm font-semibold tracking-wide uppercase">
            Earn while you date
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Small tasks.{" "}
            <span className="gradient-text">Real coins.</span>
          </h2>
          <p className="mt-4 text-white/70 max-w-xl">
            Spend Luvora Coins on virtual gifts, premium filters, profile
            boosts, and VIP features. Earn them by showing up, inviting friends,
            and bringing good vibes.
          </p>
          <ul className="mt-6 space-y-2 text-white/80 text-sm">
            <li className="flex gap-2">⭐ Spin the daily wheel for bonus rewards</li>
            <li className="flex gap-2">🏆 Climb the weekly leaderboard for cash prizes</li>
            <li className="flex gap-2">🎁 Receive gifts from viewers when you go live</li>
          </ul>
        </div>

        <div className="glass rounded-3xl p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/60">Your balance</div>
              <div className="text-3xl font-extrabold mt-1">
                🪙 <span className="gradient-text">2,340</span>
              </div>
            </div>
            <button className="btn-primary rounded-full px-4 py-2 text-sm font-semibold">
              Top up
            </button>
          </div>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TASKS.map((t) => (
              <div
                key={t.label}
                className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{t.emoji}</span>
                  <span className="text-sm">{t.label}</span>
                </div>
                <span className="text-brand-300 font-semibold text-sm">
                  +{t.coins}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
