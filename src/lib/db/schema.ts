import {
  pgTable,
  uuid,
  varchar,
  integer,
  text,
  timestamp,
  boolean,
  pgEnum,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", [
  "male",
  "female",
  "non_binary",
  "other",
  "prefer_not_to_say",
]);

export const interestedInEnum = pgEnum("interested_in", [
  "male",
  "female",
  "everyone",
]);

export const relationshipGoalEnum = pgEnum("relationship_goal", [
  "casual",
  "long_term",
  "friendship",
  "marriage",
  "not_sure",
]);

export const preRegistrations = pgTable(
  "pre_registrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    fullName: varchar("full_name", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }),
    mobile: varchar("mobile", { length: 20 }).notNull(),
    mobileVerified: boolean("mobile_verified").notNull().default(false),

    gender: genderEnum("gender").notNull(),
    interestedIn: interestedInEnum("interested_in").notNull(),

    dob: varchar("dob", { length: 10 }).notNull(),
    age: integer("age").notNull(),

    city: varchar("city", { length: 120 }),
    country: varchar("country", { length: 120 }),

    bio: text("bio"),
    heightCm: integer("height_cm"),
    profession: varchar("profession", { length: 120 }),
    education: varchar("education", { length: 120 }),
    relationshipGoal: relationshipGoalEnum("relationship_goal"),
    languages: jsonb("languages").$type<string[]>().default([]),
    interests: jsonb("interests").$type<string[]>().default([]),

    photos: jsonb("photos").$type<string[]>().notNull().default([]),

    referralCode: varchar("referral_code", { length: 40 }),

    acceptedTerms: boolean("accepted_terms").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("pre_registrations_mobile_unique").on(t.mobile),
    index("pre_registrations_email_idx").on(t.email),
    index("pre_registrations_city_idx").on(t.city),
  ],
);

export type PreRegistration = typeof preRegistrations.$inferSelect;
export type NewPreRegistration = typeof preRegistrations.$inferInsert;
