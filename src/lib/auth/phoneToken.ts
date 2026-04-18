import { SignJWT, jwtVerify } from "jose";

const secret = process.env.APP_JWT_SECRET;

function getKey() {
  if (!secret || secret.length < 16) {
    throw new Error(
      "APP_JWT_SECRET is not set or is too short. Use a 32+ character random string.",
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * Issue a short-lived token that proves this phone was just verified via Twilio.
 * The client keeps it in memory and the final register action verifies it.
 */
export async function issuePhoneVerifiedToken(phoneE164: string) {
  return await new SignJWT({ phone: phoneE164, purpose: "phone_verified" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(getKey());
}

export async function verifyPhoneToken(token: string, expectedPhone: string) {
  try {
    const { payload } = await jwtVerify(token, getKey());
    return (
      payload.purpose === "phone_verified" && payload.phone === expectedPhone
    );
  } catch {
    return false;
  }
}
