"use server";

import { z } from "zod";
import { sendWhatsAppOtp, verifyTestOtp } from "@/lib/whatsapp";
import { sendEmailOtp, verifyEmailOtp } from "@/lib/email";
import { issuePhoneVerifiedToken } from "@/lib/auth/phoneToken";
import { issueEmailVerifiedToken } from "@/lib/auth/emailToken";

const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, "Use international format, e.g. +14155552671");

const codeSchema = z.string().regex(/^\d{4,8}$/, "Invalid code");

const emailSchema = z.string().trim().toLowerCase().email("Invalid email").max(255);

export type OtpResult =
  | { ok: true; token?: string }
  | { ok: false; error: string };

export async function sendOtpAction(phone: string): Promise<OtpResult> {
  const parsed = phoneSchema.safeParse(phone);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid phone" };
  }
  try {
    await sendWhatsAppOtp(parsed.data);
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
  if (!verifyTestOtp(codeParsed.data)) {
    return { ok: false, error: "Incorrect or expired code" };
  }
  try {
    const token = await issuePhoneVerifiedToken(phoneParsed.data);
    return { ok: true, token };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    return { ok: false, error: msg };
  }
}

export async function sendEmailOtpAction(email: string): Promise<OtpResult> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }
  try {
    await sendEmailOtp(parsed.data);
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to send email code";
    return { ok: false, error: msg };
  }
}

export async function verifyEmailOtpAction(
  email: string,
  code: string,
): Promise<OtpResult> {
  const emailParsed = emailSchema.safeParse(email);
  const codeParsed = codeSchema.safeParse(code);
  if (!emailParsed.success) {
    return { ok: false, error: "Invalid email" };
  }
  if (!codeParsed.success) {
    return { ok: false, error: "Invalid verification code" };
  }
  if (!verifyEmailOtp(emailParsed.data, codeParsed.data)) {
    return { ok: false, error: "Incorrect or expired code" };
  }
  try {
    const token = await issueEmailVerifiedToken(emailParsed.data);
    return { ok: true, token };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    return { ok: false, error: msg };
  }
}
