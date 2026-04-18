import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = process.env.APP_JWT_SECRET;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "erfankhan@gmail.com").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@321";

export const ADMIN_COOKIE = "admin_session";
const SESSION_TTL_HOURS = 8;

function getKey() {
  if (!secret || secret.length < 16) {
    throw new Error(
      "APP_JWT_SECRET is not set or is too short. Use a 32+ character random string.",
    );
  }
  return new TextEncoder().encode(secret);
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function checkAdminCredentials(email: string, password: string) {
  const emailOk = safeEqual(email.trim().toLowerCase(), ADMIN_EMAIL);
  const passOk = safeEqual(password, ADMIN_PASSWORD);
  return emailOk && passOk;
}

export async function issueAdminSession() {
  return await new SignJWT({ role: "admin", email: ADMIN_EMAIL })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_HOURS}h`)
    .sign(getKey());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function isAdminRequest() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function setAdminCookie(token: string) {
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_HOURS * 60 * 60,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
