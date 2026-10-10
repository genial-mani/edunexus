import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface PresignedUrlResult {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  isDirectR2: boolean;
}

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "edunexus";
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

function getEndpoint(): string | null {
  if (R2_ENDPOINT) return R2_ENDPOINT;
  if (R2_ACCOUNT_ID) return `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  return null;
}

export function isR2Configured(): boolean {
  return Boolean(getEndpoint() && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);
}

function getR2Client(): S3Client {
  const endpoint = getEndpoint();
  if (!endpoint || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error("Cloudflare R2 credentials are not configured in environment variables");
  }

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

/**
 * Generates an authorization-checked, short-lived presigned PUT URL for Cloudflare R2
 * Falls back to local direct-PUT handler in local development if R2 credentials are unset.
 */
export async function createPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds: number = 300
): Promise<PresignedUrlResult> {
  if (isR2Configured()) {
    const s3 = getR2Client();
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });

    // Public URL format: configured CDN domain or R2 public dev bucket URL
    const baseUrl = R2_PUBLIC_DOMAIN?.replace(/\/$/, "") || `https://${R2_BUCKET_NAME}.r2.dev`;
    const fileUrl = `${baseUrl}/${key}`;

    return {
      uploadUrl,
      fileUrl,
      key,
      isDirectR2: true,
    };
  }

  // Local development fallback: direct PUT endpoint
  return {
    uploadUrl: `/api/upload/local?key=${encodeURIComponent(key)}`,
    fileUrl: `/uploads/${key}`,
    key,
    isDirectR2: false,
  };
}
