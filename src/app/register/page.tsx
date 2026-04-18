import Link from "next/link";
import { HeartLogo } from "@/components/landing/HeartLogo";
import { RegisterForm } from "@/components/register/RegisterForm";

export const metadata = {
  title: "Join Luvora — Pre-register for early access",
  description:
    "Create your Luvora profile and get founding-member perks: 500 coins, premium filters and a verified badge.",
};

export default function RegisterPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-8 pb-16 sm:pt-12 sm:pb-24">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2">
            <HeartLogo className="w-7 h-7" />
            <span className="text-lg font-bold">
              <span className="gradient-text">Luvora</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition"
          >
            ← Back home
          </Link>
        </div>

        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Claim your <span className="gradient-text">Luvora</span> profile
          </h1>
          <p className="mt-3 text-white/70 text-sm sm:text-base">
            Tell us a bit about you. We&apos;ll keep it private until launch and
            reward early members with 500 free coins.
          </p>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}
