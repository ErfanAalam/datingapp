"use server";

import { createUploadSignature } from "@/lib/cloudinary";

export type UploadSignatureResult =
  | {
      ok: true;
      signature: string;
      timestamp: number;
      apiKey: string;
      cloudName: string;
      folder: string;
      uploadPreset?: string;
    }
  | { ok: false; error: string };

export async function getUploadSignatureAction(): Promise<UploadSignatureResult> {
  try {
    const sig = createUploadSignature();
    return { ok: true, ...sig };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to sign upload";
    return { ok: false, error: msg };
  }
}
