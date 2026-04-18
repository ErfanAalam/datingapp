import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export const cloudinaryConfig = {
  cloudName,
  apiKey,
  apiSecret,
  uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
};

export function assertCloudinaryConfigured() {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not fully configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your env.",
    );
  }
}

export type CloudinarySignature = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  uploadPreset?: string;
};

/**
 * Create a one-time signature for direct browser uploads to Cloudinary.
 * We sign `folder` (+ optional `upload_preset`) and `timestamp` so the browser
 * can POST the file straight to Cloudinary without proxying through our server.
 */
export function createUploadSignature(
  folder = "luvora/pre-register",
): CloudinarySignature {
  assertCloudinaryConfigured();

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign: Record<string, string | number> = { folder, timestamp };
  if (cloudinaryConfig.uploadPreset) {
    paramsToSign.upload_preset = cloudinaryConfig.uploadPreset;
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    apiSecret as string,
  );

  return {
    signature,
    timestamp,
    apiKey: apiKey as string,
    cloudName: cloudName as string,
    folder,
    uploadPreset: cloudinaryConfig.uploadPreset,
  };
}

export { cloudinary };
