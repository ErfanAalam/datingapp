import { HeartLogo } from "./HeartLogo";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <HeartLogo className="w-6 h-6" />
          <span className="font-bold">
            <span className="gradient-text">Luvora</span>
          </span>
          <span className="text-white/40 text-sm ml-2">
            © {new Date().getFullYear()} Luvora Inc.
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/60">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
