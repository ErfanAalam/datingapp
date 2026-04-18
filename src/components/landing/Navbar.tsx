import Link from "next/link";
import { HeartLogo } from "./HeartLogo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-4">
        <nav className="glass rounded-full flex items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <HeartLogo className="w-7 h-7" />
            <span className="text-lg sm:text-xl font-bold tracking-tight">
              <span className="gradient-text">Luvora</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/80">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how" className="hover:text-white transition">How it works</a>
            <a href="#earn" className="hover:text-white transition">Earn coins</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>
          <Link
            href="/register"
            className="btn-primary rounded-full px-4 sm:px-5 py-2 text-sm font-semibold"
          >
            Join waitlist
          </Link>
        </nav>
      </div>
    </header>
  );
}
