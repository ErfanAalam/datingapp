import Link from "next/link";
import { HeartLogo } from "./HeartLogo";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-24 -left-10 w-72 h-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-accent-500/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs sm:text-sm text-white/80">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Pre-launch — early members get 500 free coins
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
            Meet someone{" "}
            <span className="gradient-text">worth swiping for.</span>
          </h1>
          <p className="mt-5 text-white/75 text-base sm:text-lg max-w-xl mx-auto md:mx-0">
            Luvora is the all-in-one dating app for real chemistry. Start with a
            chat, jump on a video call, drop into a live room, or vibe over
            short videos — all in one place.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <Link
              href="/register"
              className="btn-primary rounded-full px-7 py-3 text-base font-semibold"
            >
              Claim your profile
            </Link>
            <a
              href="#features"
              className="rounded-full px-7 py-3 text-base font-semibold text-white/90 border border-white/15 hover:border-white/40 hover:bg-white/5 transition"
            >
              Explore features
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center md:justify-start gap-6 text-white/60 text-sm">
            <div className="flex -space-x-2">
              {["#ff5c8e", "#b57bff", "#ff91b4", "#8c3dff"].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full ring-2 ring-[#0b0218]"
                  style={{ background: c }}
                />
              ))}
            </div>
            <span>12,400+ already on the waitlist</span>
          </div>
        </div>

        <HeroArt />
      </div>
    </section>
  );
}

function HeroArt() {
  return (
    <div className="relative mx-auto w-full max-w-md aspect-5/6">
      <div className="absolute inset-0 rounded-[36px] bg-linear-to-br from-brand-500/30 to-accent-500/30 blur-2xl" />

      {/* Phone mock */}
      <div className="relative w-full h-full rounded-[36px] glass-strong p-4 shadow-2xl animate-floaty">
        <div className="h-full w-full rounded-[28px] overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-br from-[#2a0d44] via-[#3b0e4d] to-[#1a0529]" />
          <div className="absolute inset-0">
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white/70 text-xs">
              <span>9:41</span>
              <HeartLogo className="w-5 h-5" />
            </div>
            <div className="absolute top-16 left-6 right-6">
              <h3 className="text-white text-2xl font-bold">Discover</h3>
              <p className="text-white/60 text-sm">Nearby · within 5 km</p>
            </div>

            <div className="absolute top-36 left-6 right-6 rounded-3xl h-[58%] overflow-hidden shadow-xl">
              <div className="h-full w-full bg-[conic-gradient(at_30%_20%,#ff91b4,#8c3dff,#ff2e6d)]" />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/80 to-transparent">
                <div className="text-white text-xl font-semibold">Riya, 24</div>
                <div className="text-white/70 text-xs">2.1 km away · Coffee, Travel, Indie music</div>
              </div>
              <div className="absolute top-3 right-3 rounded-full px-2 py-1 text-[10px] bg-brand-500/90 text-white font-semibold">
                Live now
              </div>
            </div>

            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3">
              <CircleBtn color="rgba(255,255,255,.1)" label="✕" />
              <CircleBtn color="#ff2e6d" big label="♥" />
              <CircleBtn color="rgba(255,255,255,.1)" label="★" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating chips */}
      <FloatingChip className="top-4 -left-6 sm:-left-10" text="💬 New match!" delay={0.2} />
      <FloatingChip
        className="bottom-16 -right-4 sm:-right-10"
        text="📞 Video call in 3s"
        delay={1.1}
      />
      <FloatingChip className="top-1/2 -right-8 sm:-right-16" text="🎁 Gift sent" delay={0.6} />
    </div>
  );
}

function CircleBtn({
  color,
  big,
  label,
}: {
  color: string;
  big?: boolean;
  label: string;
}) {
  return (
    <div
      className={`${big ? "w-14 h-14 text-2xl" : "w-11 h-11 text-lg"} rounded-full flex items-center justify-center text-white shadow-lg`}
      style={{ background: color }}
    >
      {label}
    </div>
  );
}

function FloatingChip({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`absolute glass rounded-full px-3 py-2 text-xs sm:text-sm text-white/90 shadow-xl animate-floaty ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {text}
    </div>
  );
}
