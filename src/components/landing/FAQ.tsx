const ITEMS = [
  {
    q: "When is Luvora launching?",
    a: "We're rolling out invites to pre-registered members first. Sign up now to skip the line and get founding-member perks.",
  },
  {
    q: "Is Luvora free to use?",
    a: "Yes, all core features — chats, matches, calls and live rooms — are free. Luvora Coins unlock premium boosts, gifts and VIP filters.",
  },
  {
    q: "How do you keep Luvora safe?",
    a: "Every account is mobile-verified, photos are reviewed by AI + humans, and we offer one-tap reporting plus block-on-call.",
  },
  {
    q: "Which countries are supported?",
    a: "We're starting in India and expanding fast across Southeast Asia, UAE and the US. Your waitlist position is locked to your region.",
  },
  {
    q: "Can I use it on the web?",
    a: "Luvora is mobile-first (iOS + Android at launch) with a companion web app for chats, live rooms and video calls.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28 border-t border-white/5">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-accent-400 text-sm font-semibold tracking-wide uppercase">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Good questions, honest answers.
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {ITEMS.map((it, i) => (
            <details
              key={i}
              className="group glass rounded-2xl px-5 py-4 open:bg-white/10 transition"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-left">
                <span className="font-semibold">{it.q}</span>
                <span className="text-white/60 group-open:rotate-45 transition">
                  +
                </span>
              </summary>
              <p className="mt-2 text-white/70 text-sm leading-relaxed">
                {it.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
