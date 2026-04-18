import Link from "next/link";

export function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative rounded-[32px] overflow-hidden p-8 sm:p-14 text-center glass-strong">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-accent-500/30 blur-3xl" />
          <h2 className="relative text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Your next chapter starts with a{" "}
            <span className="gradient-text">Luvora match.</span>
          </h2>
          <p className="relative mt-4 text-white/75 max-w-2xl mx-auto">
            Secure your username and unlock founding-member perks: 500 free
            coins, premium filters for a month and a verified badge.
          </p>
          <div className="relative mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/register"
              className="btn-primary rounded-full px-8 py-3 text-base font-semibold"
            >
              Claim your spot
            </Link>
            <a
              href="#faq"
              className="rounded-full px-8 py-3 text-base font-semibold text-white/90 border border-white/15 hover:border-white/40 hover:bg-white/5 transition"
            >
              Got questions?
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
