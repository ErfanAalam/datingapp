import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { adminLogoutAction } from "./actions";

export const dynamic = "force-dynamic";

function fmtDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPage() {
  if (!(await isAdminRequest())) redirect("/admin/login");

  const users = await db
    .select()
    .from(schema.preRegistrations)
    .orderBy(desc(schema.preRegistrations.createdAt));

  const total = users.length;
  const verifiedBoth = users.filter(
    (u) => u.emailVerified && u.mobileVerified,
  ).length;
  const last24 = users.filter(
    (u) => Date.now() - new Date(u.createdAt).getTime() < 24 * 3600 * 1000,
  ).length;

  return (
    <div className="min-h-screen bg-[#0b0218] text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0218]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Admin · Registrations</h1>
            <p className="text-xs text-white/50">Luvora pre-registration dashboard</p>
          </div>
          <form action={adminLogoutAction}>
            <button
              type="submit"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/5"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Total users" value={total} />
          <Stat label="Fully verified" value={verifiedBoth} />
          <Stat label="Last 24 hours" value={last24} />
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wider text-white/50">
                <tr>
                  <Th>User</Th>
                  <Th>Contact</Th>
                  <Th>Basics</Th>
                  <Th>Location</Th>
                  <Th>Interests</Th>
                  <Th>Photos</Th>
                  <Th>Joined</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-white/50">
                      No registrations yet.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="align-top hover:bg-white/[0.02]">
                      <Td>
                        <div className="font-semibold text-white">{u.fullName}</div>
                        <div className="mt-1 text-xs text-white/40">{u.id.slice(0, 8)}…</div>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-1.5 text-white/80">
                          <span>{u.email}</span>
                          {u.emailVerified ? <Badge tone="good">✓</Badge> : <Badge tone="warn">!</Badge>}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-white/70">
                          <span>{u.mobile}</span>
                          {u.mobileVerified ? <Badge tone="good">✓</Badge> : <Badge tone="warn">!</Badge>}
                        </div>
                      </Td>
                      <Td>
                        <div className="capitalize text-white/80">
                          {u.gender.replaceAll("_", " ")} · {u.age}y
                        </div>
                        <div className="text-xs text-white/50">
                          Seeks {u.interestedIn}
                          {u.relationshipGoal ? ` · ${u.relationshipGoal.replaceAll("_", " ")}` : ""}
                        </div>
                        {u.heightCm ? (
                          <div className="text-xs text-white/40">{u.heightCm} cm</div>
                        ) : null}
                      </Td>
                      <Td>
                        <div className="text-white/80">
                          {[u.city, u.country].filter(Boolean).join(", ") || "—"}
                        </div>
                        {u.profession ? (
                          <div className="text-xs text-white/50">{u.profession}</div>
                        ) : null}
                        {u.education ? (
                          <div className="text-xs text-white/40">{u.education}</div>
                        ) : null}
                      </Td>
                      <Td>
                        <TagList items={u.interests ?? []} />
                        <TagList items={u.languages ?? []} muted />
                      </Td>
                      <Td>
                        <PhotoStrip photos={u.photos ?? []} />
                      </Td>
                      <Td>
                        <div className="text-white/80">{fmtDate(u.createdAt)}</div>
                        {u.referralCode ? (
                          <div className="text-xs text-white/40">Ref: {u.referralCode}</div>
                        ) : null}
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
      <div className="mt-1 text-3xl font-extrabold">{value}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-4">{children}</td>;
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "good" | "warn";
}) {
  const cls =
    tone === "good"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
      : "bg-amber-500/15 text-amber-300 border-amber-400/30";
  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${cls}`}
    >
      {children}
    </span>
  );
}

function TagList({ items, muted = false }: { items: string[]; muted?: boolean }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {items.slice(0, 6).map((t) => (
        <span
          key={t}
          className={`rounded-full border px-2 py-0.5 text-[11px] ${
            muted
              ? "border-white/10 text-white/50"
              : "border-pink-400/30 bg-pink-500/10 text-pink-200"
          }`}
        >
          {t}
        </span>
      ))}
      {items.length > 6 ? (
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-white/40">
          +{items.length - 6}
        </span>
      ) : null}
    </div>
  );
}

function PhotoStrip({ photos }: { photos: string[] }) {
  if (!photos || photos.length === 0) {
    return <span className="text-xs text-white/40">—</span>;
  }
  return (
    <div className="flex -space-x-2">
      {photos.slice(0, 4).map((src, i) => (
        <a
          key={src}
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-black/30"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={`photo ${i + 1}`} className="h-full w-full object-cover" />
        </a>
      ))}
      {photos.length > 4 ? (
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-[10px] text-white/60">
          +{photos.length - 4}
        </span>
      ) : null}
    </div>
  );
}
