import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { AdminLoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminRequest()) redirect("/admin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0218] text-white px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">Admin sign-in</h1>
          <p className="mt-1 text-sm text-white/60">
            Authorized personnel only.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
