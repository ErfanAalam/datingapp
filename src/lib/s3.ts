import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const region = process.env.AWS_REGION || "us-east-1";
const bucket = process.env.S3_BUCKET;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL;

let cachedClient: S3Client | null = null;

function getClient() {
  if (!bucket || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "S3 is not fully configured. Set S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your env.",
    );
  }
  if (!cachedClient) {
    cachedClient = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return cachedClient;
}

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const MAX_BYTES = 8 * 1024 * 1024;

function extFromMime(mime: string) {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/heic":
      return "heic";
    case "image/heif":
      return "heif";
    default:
      return "bin";
  }
}

export type UploadResult = { url: string; key: string };

export async function uploadImage(
  body: Uint8Array,
  contentType: string,
  folder = "pre-register",
): Promise<UploadResult> {
  if (!ALLOWED_MIME.has(contentType)) {
    throw new Error("Unsupported image type.");
  }
  if (body.byteLength > MAX_BYTES) {
    throw new Error("File too large. Max 8 MB.");
  }

  const client = getClient();
  const key = `${folder}/${randomUUID()}.${extFromMime(contentType)}`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  const url = publicBaseUrl
    ? `${publicBaseUrl.replace(/\/$/, "")}/${key}`
    : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return { url, key };
}
