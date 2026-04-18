"use client";

import { useRef, useState } from "react";

type Photo = { url: string; key: string };

export function PhotoUpload({
  photos,
  onChange,
  max = 5,
  min = 3,
}: {
  photos: Photo[];
  onChange: (next: Photo[]) => void;
  max?: number;
  min?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const slots = max - photos.length;
    const chosen = Array.from(files).slice(0, slots);
    if (chosen.length === 0) {
      setError(`You can only add ${max} photos.`);
      return;
    }

    for (const file of chosen) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        setError("Each photo must be under 8 MB.");
        continue;
      }
    }

    setUploading(true);
    try {
      const uploaded: Photo[] = [];
      for (const file of chosen) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: "Upload failed" }));
          throw new Error(body.error || "Upload failed");
        }
        const json = (await res.json()) as Photo;
        uploaded.push(json);
      }

      onChange([...photos, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(i: number) {
    const next = photos.slice();
    next.splice(i, 1);
    onChange(next);
  }

  const remaining = max - photos.length;
  const canAddMore = remaining > 0 && !uploading;

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
        {photos.map((p, i) => (
          <div
            key={p.key}
            className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.url}
              alt={`Photo ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1.5 right-1.5 bg-black/70 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-90 group-hover:opacity-100"
              aria-label="Remove photo"
            >
              ×
            </button>
            {i === 0 ? (
              <span className="absolute bottom-1.5 left-1.5 text-[10px] uppercase font-semibold bg-brand-500 text-white rounded-full px-2 py-0.5">
                Main
              </span>
            ) : null}
          </div>
        ))}
        {Array.from({ length: Math.max(0, min - photos.length) }).map((_, i) => (
          <div
            key={`ph-${i}`}
            className="aspect-square rounded-2xl border-2 border-dashed border-white/15 flex items-center justify-center text-white/30 text-xs"
          >
            Required
          </div>
        ))}
        {canAddMore ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-white/20 hover:border-brand-400/70 hover:bg-brand-500/10 flex flex-col items-center justify-center gap-1 text-white/60 hover:text-white transition"
          >
            <span className="text-2xl">+</span>
            <span className="text-[11px]">Add photo</span>
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-white/50">
          {uploading
            ? "Uploading…"
            : `Add ${min}–${max} photos · ${photos.length}/${max} added`}
        </span>
        {error ? <span className="text-brand-300">{error}</span> : null}
      </div>
    </div>
  );
}
