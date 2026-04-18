"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminLoginAction } from "../actions";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await adminLoginAction(email, password);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.replace("/admin");
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="text-xs uppercase tracking-wider text-white/60">
          Email
        </span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-pink-400/60"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-wider text-white/60">
          Password
        </span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-pink-400/60"
        />
      </label>
      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:opacity-95 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
