"use server";

import { db, schema } from "@/lib/db";
import { preRegisterSchema, ageFromDob } from "@/lib/validation/register";
import { verifyPhoneToken } from "@/lib/auth/phoneToken";
import { verifyEmailToken } from "@/lib/auth/emailToken";

export type RegisterResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitPreRegisterAction(
  raw: unknown,
): Promise<RegisterResult> {
  const parsed = preRegisterSchema.safeParse(raw);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const first =
      Object.values(flat.fieldErrors).flat()[0] ??
      flat.formErrors[0] ??
      "Invalid form data";
    return { ok: false, error: first, fieldErrors: flat.fieldErrors };
  }

  const data = parsed.data;

  const phoneOk = await verifyPhoneToken(data.mobileToken, data.mobile);
  if (!phoneOk) {
    return {
      ok: false,
      error: "Mobile verification expired. Please verify your number again.",
      fieldErrors: { mobileToken: ["Verification expired"] },
    };
  }

  const emailOk = await verifyEmailToken(data.emailToken, data.email);
  if (!emailOk) {
    return {
      ok: false,
      error: "Email verification expired. Please verify your email again.",
      fieldErrors: { emailToken: ["Verification expired"] },
    };
  }

  try {
    const [row] = await db
      .insert(schema.preRegistrations)
      .values({
        fullName: data.fullName,
        email: data.email,
        emailVerified: true,
        mobile: data.mobile,
        mobileVerified: true,
        gender: data.gender,
        interestedIn: data.interestedIn,
        dob: data.dob,
        age: ageFromDob(data.dob),
        city: data.city,
        country: data.country,
        bio: data.bio,
        heightCm: data.heightCm,
        profession: data.profession,
        education: data.education,
        relationshipGoal: data.relationshipGoal,
        languages: data.languages,
        interests: data.interests,
        photos: data.photos,
        referralCode: data.referralCode,
        acceptedTerms: data.acceptedTerms,
      })
      .returning({ id: schema.preRegistrations.id });

    return { ok: true, id: row.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save registration";
    if (/duplicate key|unique/i.test(msg)) {
      if (/email/i.test(msg)) {
        return {
          ok: false,
          error: "This email is already pre-registered.",
          fieldErrors: { email: ["Already registered"] },
        };
      }
      return {
        ok: false,
        error: "This mobile number is already pre-registered.",
        fieldErrors: { mobile: ["Already registered"] },
      };
    }
    return { ok: false, error: msg };
  }
}
