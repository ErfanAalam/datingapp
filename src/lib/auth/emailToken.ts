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

export async function issueEmailVerifiedToken(email: string) {
  return await new SignJWT({ email, purpose: "email_verified" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(getKey());
}

export async function verifyEmailToken(token: string, expectedEmail: string) {
  try {
    const { payload } = await jwtVerify(token, getKey());
    return (
      payload.purpose === "email_verified" &&
      typeof payload.email === "string" &&
      payload.email.toLowerCase() === expectedEmail.toLowerCase()
    );
  } catch {
    return false;
  }
}
