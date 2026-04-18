"use client";

import { ReactNode } from "react";

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
  hint?: string;
  required?: boolean;
};

export function Field({ label, error, children, hint, required }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm text-white/80 font-medium">
        {label}
        {required ? <span className="text-brand-400 ml-1">*</span> : null}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && !error ? (
        <span className="mt-1 block text-xs text-white/50">{hint}</span>
      ) : null}
      {error ? (
        <span className="mt-1 block text-xs text-brand-300">{error}</span>
      ) : null}
    </label>
  );
}

const baseInput =
  "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-400/60 focus:border-transparent transition";

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input {...props} className={`${baseInput} ${props.className ?? ""}`} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`${baseInput} min-h-[92px] resize-y ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${baseInput} pr-10 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22white%22 viewBox=%220 0 24 24%22><path d=%22M7 10l5 5 5-5z%22/></svg>')] bg-no-repeat bg-[right_0.75rem_center] ${props.className ?? ""}`}
    />
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-sm border transition ${
        active
          ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/40"
          : "bg-white/5 border-white/10 text-white/80 hover:border-white/25"
      }`}
    >
      {children}
    </button>
  );
}

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((label, i) => (
        <div key={label} className="flex-1">
          <div
            className={`h-1.5 rounded-full transition-all ${
              i <= current ? "bg-linear-to-r from-brand-500 to-accent-500" : "bg-white/10"
            }`}
          />
          <div
            className={`mt-1.5 text-[11px] sm:text-xs ${
              i === current ? "text-white" : "text-white/50"
            }`}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
