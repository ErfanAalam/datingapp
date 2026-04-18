"use server";

import { redirect } from "next/navigation";
import {
  checkAdminCredentials,
  clearAdminCookie,
  issueAdminSession,
  setAdminCookie,
} from "@/lib/auth/adminSession";

export type AdminLoginResult = { ok: true } | { ok: false; error: string };

export async function adminLoginAction(
  email: string,
  password: string,
): Promise<AdminLoginResult> {
  if (!email || !password) {
    return { ok: false, error: "Enter your email and password." };
  }
  if (!checkAdminCredentials(email, password)) {
    return { ok: false, error: "Invalid email or password." };
  }
  const token = await issueAdminSession();
  await setAdminCookie(token);
  return { ok: true };
}

export async function adminLogoutAction() {
  await clearAdminCookie();
  redirect("/admin/login");
}
