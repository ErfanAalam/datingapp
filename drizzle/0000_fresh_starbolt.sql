CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'non_binary', 'other', 'prefer_not_to_say');--> statement-breakpoint
CREATE TYPE "public"."interested_in" AS ENUM('male', 'female', 'everyone');--> statement-breakpoint
CREATE TYPE "public"."relationship_goal" AS ENUM('casual', 'long_term', 'friendship', 'marriage', 'not_sure');--> statement-breakpoint
CREATE TABLE "pre_registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(120) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"mobile" varchar(20) NOT NULL,
	"mobile_verified" boolean DEFAULT false NOT NULL,
	"gender" "gender" NOT NULL,
	"interested_in" "interested_in" NOT NULL,
	"dob" varchar(10) NOT NULL,
	"age" integer NOT NULL,
	"city" varchar(120),
	"country" varchar(120),
	"bio" text,
	"height_cm" integer,
	"profession" varchar(120),
	"education" varchar(120),
	"relationship_goal" "relationship_goal",
	"languages" jsonb DEFAULT '[]'::jsonb,
	"interests" jsonb DEFAULT '[]'::jsonb,
	"photos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"referral_code" varchar(40),
	"accepted_terms" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "pre_registrations_mobile_unique" ON "pre_registrations" USING btree ("mobile");--> statement-breakpoint
CREATE UNIQUE INDEX "pre_registrations_email_unique" ON "pre_registrations" USING btree ("email");--> statement-breakpoint
CREATE INDEX "pre_registrations_city_idx" ON "pre_registrations" USING btree ("city");