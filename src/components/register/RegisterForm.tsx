"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  sendOtpAction,
  verifyOtpAction,
  sendEmailOtpAction,
  verifyEmailOtpAction,
} from "@/app/actions/otp";
import { submitPreRegisterAction } from "@/app/actions/register";
import { Field, TextInput, TextArea, Select, Chip, Stepper } from "./ui";
import { PhotoUpload } from "./PhotoUpload";

type Photo = { url: string; key: string };

type FormState = {
  fullName: string;
  email: string;
  emailToken: string;
  mobile: string;
  mobileToken: string;
  dob: string;
  gender: string;
  interestedIn: string;
  city: string;
  country: string;
  bio: string;
  heightCm: string;
  profession: string;
  education: string;
  relationshipGoal: string;
  languages: string[];
  interests: string[];
  photos: Photo[];
  referralCode: string;
  acceptedTerms: boolean;
};

const INITIAL: FormState = {
  fullName: "",
  email: "",
  emailToken: "",
  mobile: "",
  mobileToken: "",
  dob: "",
  gender: "",
  interestedIn: "",
  city: "",
  country: "",
  bio: "",
  heightCm: "",
  profession: "",
  education: "",
  relationshipGoal: "",
  languages: [],
  interests: [],
  photos: [],
  referralCode: "",
  acceptedTerms: false,
};

const INTEREST_OPTIONS = [
  "Music", "Movies", "Travel", "Food", "Fitness", "Gaming",
  "Reading", "Photography", "Cooking", "Dancing", "Art", "Yoga",
  "Tech", "Fashion", "Pets", "Coffee", "Sports", "Nature",
  "Nightlife", "Spirituality",
];

const LANGUAGE_OPTIONS = [
  "English", "Hindi", "Urdu", "Punjabi", "Tamil", "Telugu",
  "Marathi", "Bengali", "Gujarati", "Kannada", "Malayalam", "Spanish",
  "French", "Arabic",
];

const STEPS = ["You", "Verify", "About", "Preferences", "Photos", "Finish"];

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setState((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  }

  function validateStep(): boolean {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (state.fullName.trim().length < 2) e.fullName = "Enter your name";
      if (!state.dob) e.dob = "Pick your date of birth";
      else {
        const age = ageFrom(state.dob);
        if (age < 18) e.dob = "You must be 18 or older";
        if (age > 120) e.dob = "Enter a valid date of birth";
      }
      if (!state.gender) e.gender = "Select your gender";
    }
    if (step === 1) {
      if (!/^\+[1-9]\d{7,14}$/.test(state.mobile))
        e.mobile = "Use format +countrycode number, e.g. +14155552671";
      if (!state.mobileToken)
        e.mobileToken = "Please verify your mobile with the code";
      if (!/^\S+@\S+\.\S+$/.test(state.email))
        e.email = "Enter a valid email";
      if (!state.emailToken)
        e.emailToken = "Please verify your email with the code";
    }
    if (step === 2) {
      if (state.bio.length > 500) e.bio = "Keep your bio under 500 chars";
      if (state.heightCm) {
        const h = parseInt(state.heightCm, 10);
        if (!Number.isFinite(h) || h < 120 || h > 230)
          e.heightCm = "Height should be 120–230 cm";
      }
    }
    if (step === 3) {
      if (!state.interestedIn) e.interestedIn = "Select who you're interested in";
    }
    if (step === 4) {
      if (state.photos.length < 3)
        e.photos = "Add at least 3 photos";
    }
    if (step === 5) {
      if (!state.acceptedTerms)
        e.acceptedTerms = "You must accept the terms to continue";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep()) return;
    setServerError(null);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }
  function back() {
    setServerError(null);
    setStep((s) => Math.max(0, s - 1));
  }

  function submit() {
    if (!validateStep()) return;
    setServerError(null);
    startTransition(async () => {
      const res = await submitPreRegisterAction({
        fullName: state.fullName,
        email: state.email,
        emailToken: state.emailToken,
        mobile: state.mobile,
        mobileToken: state.mobileToken,
        dob: state.dob,
        gender: state.gender,
        interestedIn: state.interestedIn,
        city: state.city || undefined,
        country: state.country || undefined,
        bio: state.bio || undefined,
        heightCm: state.heightCm || undefined,
        profession: state.profession || undefined,
        education: state.education || undefined,
        relationshipGoal: state.relationshipGoal || undefined,
        languages: state.languages,
        interests: state.interests,
        photos: state.photos.map((p) => p.url),
        referralCode: state.referralCode || undefined,
        acceptedTerms: state.acceptedTerms,
      });
      if (!res.ok) {
        setServerError(res.error);
        if (res.fieldErrors) {
          const mapped: Record<string, string> = {};
          for (const [k, v] of Object.entries(res.fieldErrors)) {
            if (v && v.length) mapped[k] = v[0];
          }
          setErrors(mapped);
        }
        return;
      }
      setSuccess(true);
      router.prefetch("/");
    });
  }

  if (success) return <SuccessCard />;

  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-8">
      <Stepper steps={STEPS} current={step} />

      {step === 0 && (
        <StepYou state={state} set={set} errors={errors} />
      )}
      {step === 1 && (
        <StepVerify state={state} set={set} errors={errors} />
      )}
      {step === 2 && (
        <StepAbout state={state} set={set} errors={errors} />
      )}
      {step === 3 && (
        <StepPreferences state={state} set={set} errors={errors} />
      )}
      {step === 4 && (
        <StepPhotos state={state} set={set} errors={errors} />
      )}
      {step === 5 && (
        <StepFinish state={state} set={set} errors={errors} />
      )}

      {serverError ? (
        <p className="mt-4 text-sm text-brand-300 bg-brand-500/10 border border-brand-500/30 rounded-xl px-4 py-3">
          {serverError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={step === 0 || pending}
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-white/80 border border-white/15 hover:bg-white/5 transition disabled:opacity-40"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="btn-primary rounded-full px-6 py-2.5 text-sm font-semibold"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="btn-primary rounded-full px-6 py-2.5 text-sm font-semibold"
          >
            {pending ? "Submitting…" : "Complete sign-up"}
          </button>
        )}
      </div>
    </div>
  );
}

function ageFrom(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 0;
  const now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a -= 1;
  return a;
}

type StepProps = {
  state: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  errors: Record<string, string>;
};

function StepYou({ state, set, errors }: StepProps) {
  const GENDERS: [string, string][] = [
    ["male", "Male"],
    ["female", "Female"],
    ["non_binary", "Non-binary"],
    ["other", "Other"],
    ["prefer_not_to_say", "Prefer not to say"],
  ];
  return (
    <div className="space-y-5">
      <Field label="Full name" required error={errors.fullName}>
        <TextInput
          autoComplete="name"
          placeholder="What do friends call you?"
          value={state.fullName}
          onChange={(e) => set("fullName", e.target.value)}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Date of birth" required error={errors.dob} hint="18+ only">
          <TextInput
            type="date"
            value={state.dob}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => set("dob", e.target.value)}
          />
        </Field>
        <Field label="Gender" required error={errors.gender}>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map(([v, l]) => (
              <Chip
                key={v}
                active={state.gender === v}
                onClick={() => set("gender", v)}
              >
                {l}
              </Chip>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

function StepVerify({ state, set, errors }: StepProps) {
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneSent, setPhoneSent] = useState(false);
  const [phoneSending, setPhoneSending] = useState(false);
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [phoneMsg, setPhoneMsg] = useState<string | null>(null);

  const [emailOtp, setEmailOtp] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailMsg, setEmailMsg] = useState<string | null>(null);

  async function sendPhone() {
    setPhoneMsg(null);
    setPhoneSending(true);
    try {
      const res = await sendOtpAction(state.mobile);
      if (!res.ok) {
        setPhoneMsg(res.error);
        return;
      }
      setPhoneSent(true);
      setPhoneMsg("Code sent on WhatsApp! Check your chats.");
    } finally {
      setPhoneSending(false);
    }
  }

  async function verifyPhone() {
    setPhoneMsg(null);
    setPhoneVerifying(true);
    try {
      const res = await verifyOtpAction(state.mobile, phoneOtp);
      if (!res.ok || !res.token) {
        setPhoneMsg(res.ok ? "Unexpected response" : res.error);
        return;
      }
      set("mobileToken", res.token);
      setPhoneMsg("Mobile verified ✓");
    } finally {
      setPhoneVerifying(false);
    }
  }

  async function sendEmail() {
    setEmailMsg(null);
    setEmailSending(true);
    try {
      const res = await sendEmailOtpAction(state.email);
      if (!res.ok) {
        setEmailMsg(res.error);
        return;
      }
      setEmailSent(true);
      setEmailMsg("Code sent! Check your inbox (and spam folder).");
    } finally {
      setEmailSending(false);
    }
  }

  async function verifyEmail() {
    setEmailMsg(null);
    setEmailVerifying(true);
    try {
      const res = await verifyEmailOtpAction(state.email, emailOtp);
      if (!res.ok || !res.token) {
        setEmailMsg(res.ok ? "Unexpected response" : res.error);
        return;
      }
      set("emailToken", res.token);
      setEmailMsg("Email verified ✓");
    } finally {
      setEmailVerifying(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <Field
          label="Mobile number (WhatsApp)"
          required
          error={errors.mobile}
          hint="We send the code via WhatsApp. Include country code, e.g. +91… or +1…"
        >
          <div className="flex gap-2">
            <TextInput
              inputMode="tel"
              autoComplete="tel"
              placeholder="+14155552671"
              value={state.mobile}
              onChange={(e) => {
                set("mobile", e.target.value.replace(/\s+/g, ""));
                set("mobileToken", "");
                setPhoneSent(false);
              }}
            />
            <button
              type="button"
              onClick={sendPhone}
              disabled={phoneSending || !/^\+[1-9]\d{7,14}$/.test(state.mobile)}
              className="rounded-2xl px-4 py-3 text-sm font-semibold bg-white/10 border border-white/15 hover:bg-white/15 transition disabled:opacity-40 whitespace-nowrap"
            >
              {phoneSending ? "Sending…" : phoneSent ? "Resend" : "Send on WhatsApp"}
            </button>
          </div>
        </Field>

        {phoneSent && !state.mobileToken ? (
          <Field label="Enter the 6-digit WhatsApp code" required error={errors.mobileToken}>
            <div className="flex gap-2">
              <TextInput
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                placeholder="123456"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ""))}
              />
              <button
                type="button"
                onClick={verifyPhone}
                disabled={phoneVerifying || phoneOtp.length < 4}
                className="btn-primary rounded-2xl px-4 py-3 text-sm font-semibold whitespace-nowrap"
              >
                {phoneVerifying ? "Verifying…" : "Verify"}
              </button>
            </div>
          </Field>
        ) : null}

        {state.mobileToken ? (
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            ✓ Mobile verified via WhatsApp.
          </div>
        ) : null}

        {phoneMsg ? <p className="text-sm text-white/70">{phoneMsg}</p> : null}
      </div>

      <div className="h-px bg-white/10" />

      <div className="space-y-5">
        <Field
          label="Email address"
          required
          error={errors.email}
          hint="We'll email you a 6-digit code to verify."
        >
          <div className="flex gap-2">
            <TextInput
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={state.email}
              onChange={(e) => {
                set("email", e.target.value.trim());
                set("emailToken", "");
                setEmailSent(false);
              }}
            />
            <button
              type="button"
              onClick={sendEmail}
              disabled={emailSending || !/^\S+@\S+\.\S+$/.test(state.email)}
              className="rounded-2xl px-4 py-3 text-sm font-semibold bg-white/10 border border-white/15 hover:bg-white/15 transition disabled:opacity-40 whitespace-nowrap"
            >
              {emailSending ? "Sending…" : emailSent ? "Resend" : "Send code"}
            </button>
          </div>
        </Field>

        {emailSent && !state.emailToken ? (
          <Field label="Enter the 6-digit email code" required error={errors.emailToken}>
            <div className="flex gap-2">
              <TextInput
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                placeholder="123456"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
              />
              <button
                type="button"
                onClick={verifyEmail}
                disabled={emailVerifying || emailOtp.length < 4}
                className="btn-primary rounded-2xl px-4 py-3 text-sm font-semibold whitespace-nowrap"
              >
                {emailVerifying ? "Verifying…" : "Verify"}
              </button>
            </div>
          </Field>
        ) : null}

        {state.emailToken ? (
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            ✓ Email verified.
          </div>
        ) : null}

        {emailMsg ? <p className="text-sm text-white/70">{emailMsg}</p> : null}
      </div>
    </div>
  );
}

function StepAbout({ state, set, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <Field label="Short bio" error={errors.bio} hint={`${state.bio.length}/500`}>
        <TextArea
          placeholder="A line or two that captures your vibe…"
          maxLength={500}
          value={state.bio}
          onChange={(e) => set("bio", e.target.value)}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="City">
          <TextInput
            placeholder="Mumbai"
            value={state.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </Field>
        <Field label="Country">
          <TextInput
            placeholder="India"
            value={state.country}
            onChange={(e) => set("country", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <Field label="Height (cm)" error={errors.heightCm}>
          <TextInput
            type="number"
            min={120}
            max={230}
            placeholder="170"
            value={state.heightCm}
            onChange={(e) => set("heightCm", e.target.value)}
          />
        </Field>
        <Field label="Profession">
          <TextInput
            placeholder="Product designer"
            value={state.profession}
            onChange={(e) => set("profession", e.target.value)}
          />
        </Field>
        <Field label="Education">
          <TextInput
            placeholder="BSc, IIT Bombay"
            value={state.education}
            onChange={(e) => set("education", e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}

function StepPreferences({ state, set, errors }: StepProps) {
  const INTERESTED: [string, string][] = [
    ["male", "Men"],
    ["female", "Women"],
    ["everyone", "Everyone"],
  ];
  const GOALS: [string, string][] = [
    ["casual", "Casual dating"],
    ["long_term", "Long-term"],
    ["friendship", "Friendship"],
    ["marriage", "Marriage"],
    ["not_sure", "Not sure yet"],
  ];

  function toggle(arr: string[], v: string, max: number): string[] {
    if (arr.includes(v)) return arr.filter((x) => x !== v);
    if (arr.length >= max) return arr;
    return [...arr, v];
  }

  return (
    <div className="space-y-5">
      <Field label="Interested in" required error={errors.interestedIn}>
        <div className="flex flex-wrap gap-2">
          {INTERESTED.map(([v, l]) => (
            <Chip
              key={v}
              active={state.interestedIn === v}
              onClick={() => set("interestedIn", v)}
            >
              {l}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="What are you looking for?">
        <div className="flex flex-wrap gap-2">
          {GOALS.map(([v, l]) => (
            <Chip
              key={v}
              active={state.relationshipGoal === v}
              onClick={() =>
                set(
                  "relationshipGoal",
                  state.relationshipGoal === v ? "" : v,
                )
              }
            >
              {l}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Interests" hint="Pick up to 10">
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((v) => (
            <Chip
              key={v}
              active={state.interests.includes(v)}
              onClick={() =>
                set("interests", toggle(state.interests, v, 10))
              }
            >
              {v}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Languages you speak" hint="Pick up to 6">
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((v) => (
            <Chip
              key={v}
              active={state.languages.includes(v)}
              onClick={() =>
                set("languages", toggle(state.languages, v, 6))
              }
            >
              {v}
            </Chip>
          ))}
        </div>
      </Field>
    </div>
  );
}

function StepPhotos({ state, set, errors }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm text-white/80 font-medium">
          Add your photos <span className="text-brand-400 ml-1">*</span>
        </div>
        <p className="text-xs text-white/50 mt-1">
          Add 3–5 clear, recent photos. Your first photo will be your main
          profile picture. We never share originals.
        </p>
      </div>
      <PhotoUpload
        photos={state.photos}
        onChange={(p) => set("photos", p)}
      />
      {errors.photos ? (
        <p className="text-xs text-brand-300">{errors.photos}</p>
      ) : null}
    </div>
  );
}

function StepFinish({ state, set, errors }: StepProps) {
  const summary = useMemo(
    () => [
      ["Name", state.fullName],
      ["Mobile", state.mobile + (state.mobileToken ? " ✓" : "")],
      ["Email", state.email + (state.emailToken ? " ✓" : "")],
      ["DOB", state.dob],
      ["Gender", state.gender.replaceAll("_", " ")],
      ["Interested in", state.interestedIn],
      ["Photos", `${state.photos.length} uploaded`],
    ],
    [state],
  );

  return (
    <div className="space-y-5">
      <Field label="Referral code (optional)" hint="Got one from a friend?">
        <TextInput
          placeholder="LUVORA-FRIEND"
          value={state.referralCode}
          onChange={(e) => set("referralCode", e.target.value.toUpperCase())}
        />
      </Field>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="text-sm font-semibold mb-2">Quick review</div>
        <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
          {summary.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-white/50">{k}</dt>
              <dd className="text-white/90 truncate">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={state.acceptedTerms}
          onChange={(e) => set("acceptedTerms", e.target.checked)}
          className="mt-1 w-4 h-4 accent-pink-500"
        />
        <span className="text-sm text-white/70">
          I&apos;m 18+ and I agree to Luvora&apos;s{" "}
          <a href="#" className="text-brand-300 hover:underline">Terms</a> and{" "}
          <a href="#" className="text-brand-300 hover:underline">Privacy Policy</a>.
        </span>
      </label>
      {errors.acceptedTerms ? (
        <p className="text-xs text-brand-300">{errors.acceptedTerms}</p>
      ) : null}
    </div>
  );
}

function SuccessCard() {
  return (
    <div className="glass-strong rounded-3xl p-8 sm:p-12 text-center">
      <div className="mx-auto w-16 h-16 rounded-full btn-primary flex items-center justify-center text-3xl">
        ♥
      </div>
      <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold">
        You&apos;re on the list!
      </h2>
      <p className="mt-2 text-white/70 max-w-md mx-auto">
        Welcome to Luvora. We&apos;ll text you the moment your invite is ready,
        plus 500 free coins are already reserved for you.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <a
          href="/"
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-white/90 border border-white/15 hover:bg-white/5 transition"
        >
          Back home
        </a>
      </div>
    </div>
  );
}
