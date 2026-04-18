import nodemailer, { type Transporter } from "nodemailer";

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || "Luvora <no-reply@luvora.app>";
const secure = process.env.SMTP_SECURE === "true" || port === 465;

const OTP_TTL_MS = 10 * 60 * 1000;

type OtpEntry = { code: string; expiresAt: number };

const otpStore: Map<string, OtpEntry> =
  (globalThis as unknown as { __luvoraEmailOtpStore?: Map<string, OtpEntry> })
    .__luvoraEmailOtpStore ?? new Map<string, OtpEntry>();
(globalThis as unknown as { __luvoraEmailOtpStore?: Map<string, OtpEntry> })
  .__luvoraEmailOtpStore = otpStore;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!host || !user || !pass) return null;
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }
  return cachedTransporter;
}

export async function sendEmailOtp(email: string) {
  const normalized = normalizeEmail(email);
  const code = generateOtp();
  otpStore.set(normalized, { code, expiresAt: Date.now() + OTP_TTL_MS });

  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      `[email] SMTP not configured — skipping send. Code for ${normalized}: ${code}`,
    );
    return { status: "dev_skipped" };
  }

  await transporter.sendMail({
    from,
    to: normalized,
    subject: "Your Luvora verification code",
    text: `Your Luvora verification code is ${code}. It expires in 10 minutes. Do not share this code.`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px;">
  <h2 style="margin:0 0 12px;color:#111;">Verify your email</h2>
  <p style="color:#444;line-height:1.5;">Use the code below to finish your Luvora sign-up. It expires in 10 minutes.</p>
  <div style="font-size:32px;font-weight:700;letter-spacing:6px;background:#f5f5f5;padding:16px;border-radius:12px;text-align:center;margin:16px 0;">${code}</div>
  <p style="color:#888;font-size:12px;">If you didn't request this, you can ignore this email.</p>
</div>`,
  });

  return { status: "sent" };
}

export function verifyEmailOtp(email: string, code: string) {
  const normalized = normalizeEmail(email);
  const entry = otpStore.get(normalized);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalized);
    return false;
  }
  if (entry.code !== code) return false;
  otpStore.delete(normalized);
  return true;
}
