"use server";

import { z } from "zod";
import { sendOtp, checkOtp } from "@/lib/twilio";
import { issuePhoneVerifiedToken } from "@/lib/auth/phoneToken";

const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, "Use international format, e.g. +14155552671");

const codeSchema = z.string().regex(/^\d{4,8}$/, "Invalid code");

export type OtpResult =
  | { ok: true; token?: string }
  | { ok: false; error: string };

export async function sendOtpAction(phone: string): Promise<OtpResult> {
  const parsed = phoneSchema.safeParse(phone);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid phone" };
  }
  try {
    await sendOtp(parsed.data);
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to send OTP";
    return { ok: false, error: msg };
  }
}

export async function verifyOtpAction(
  phone: string,
  code: string,
): Promise<OtpResult> {
  const phoneParsed = phoneSchema.safeParse(phone);
  const codeParsed = codeSchema.safeParse(code);
  if (!phoneParsed.success) {
    return { ok: false, error: "Invalid phone" };
  }
  if (!codeParsed.success) {
    return { ok: false, error: "Invalid verification code" };
  }
  try {
    const result = await checkOtp(phoneParsed.data, codeParsed.data);
    if (!result.valid) {
      return { ok: false, error: "Incorrect or expired code" };
    }
    const token = await issuePhoneVerifiedToken(phoneParsed.data);
    return { ok: true, token };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    return { ok: false, error: msg };
  }
}
