import { z } from "zod";

export const genderValues = [
  "male",
  "female",
  "non_binary",
  "other",
  "prefer_not_to_say",
] as const;

export const interestedInValues = ["male", "female", "everyone"] as const;

export const relationshipGoalValues = [
  "casual",
  "long_term",
  "friendship",
  "marriage",
  "not_sure",
] as const;

const phoneRegex = /^\+[1-9]\d{7,14}$/;

function calcAge(dobIso: string): number {
  const dob = new Date(dobIso);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
}

export const preRegisterSchema = z
  .object({
    fullName: z.string().trim().min(2, "Name is too short").max(120),
    email: z
      .string()
      .trim()
      .email("Invalid email")
      .max(255)
      .optional()
      .or(z.literal("").transform(() => undefined)),
    mobile: z.string().regex(phoneRegex, "Use international format, e.g. +14155552671"),
    mobileToken: z.string().min(10, "Please verify your mobile number"),

    dob: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),

    gender: z.enum(genderValues),
    interestedIn: z.enum(interestedInValues),

    city: z.string().trim().max(120).optional().or(z.literal("").transform(() => undefined)),
    country: z.string().trim().max(120).optional().or(z.literal("").transform(() => undefined)),

    bio: z.string().trim().max(500).optional().or(z.literal("").transform(() => undefined)),
    heightCm: z
      .union([z.string(), z.number()])
      .optional()
      .transform((v) => {
        if (v === undefined || v === "") return undefined;
        const n = typeof v === "string" ? parseInt(v, 10) : v;
        return Number.isFinite(n) ? n : undefined;
      })
      .pipe(z.number().int().min(120).max(230).optional()),

    profession: z.string().trim().max(120).optional().or(z.literal("").transform(() => undefined)),
    education: z.string().trim().max(120).optional().or(z.literal("").transform(() => undefined)),
    relationshipGoal: z.enum(relationshipGoalValues).optional(),

    languages: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
    interests: z.array(z.string().trim().min(1).max(40)).max(15).default([]),

    photos: z
      .array(z.string().url())
      .min(3, "Add at least 3 photos")
      .max(5, "You can add up to 5 photos"),

    referralCode: z
      .string()
      .trim()
      .max(40)
      .optional()
      .or(z.literal("").transform(() => undefined)),

    acceptedTerms: z
      .boolean()
      .refine((v) => v === true, {
        message: "You must accept the terms",
      }),
  })
  .superRefine((val, ctx) => {
    const age = calcAge(val.dob);
    if (age < 18) {
      ctx.addIssue({
        path: ["dob"],
        code: z.ZodIssueCode.custom,
        message: "You must be 18 or older",
      });
    }
    if (age > 120) {
      ctx.addIssue({
        path: ["dob"],
        code: z.ZodIssueCode.custom,
        message: "Enter a valid date of birth",
      });
    }
  });

export type PreRegisterInput = z.infer<typeof preRegisterSchema>;

export function ageFromDob(dobIso: string) {
  return calcAge(dobIso);
}
