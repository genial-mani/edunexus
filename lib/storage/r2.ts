import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface PresignedUrlResult {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  isDirectR2: boolean;
}

import { getCloudflareContext } from "@opennextjs/cloudflare";

function getR2Config() {
  let env: Record<string, any> = { ...process.env };
  try {
    const ctx = getCloudflareContext();
    if (ctx?.env) {
      env = { ...env, ...ctx.env };
    }
  } catch {
    // Outside Cloudflare request scope
  }

  const endpoint = env.R2_ENDPOINT || (env.R2_ACCOUNT_ID ? `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : null);
  const accessKeyId = env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
  const bucketName = env.R2_BUCKET_NAME || "edunexus";
  const publicDomain = env.R2_PUBLIC_DOMAIN || env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://media.arundigi.in";

  return {
    endpoint,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicDomain,
  };
}

export function isR2Configured(): boolean {
  const cfg = getR2Config();
  return Boolean(cfg.endpoint && cfg.accessKeyId && cfg.secretAccessKey && cfg.bucketName);
}

function getR2Client(): { s3: S3Client; bucketName: string; publicDomain: string } {
  const cfg = getR2Config();
  if (!cfg.endpoint || !cfg.accessKeyId || !cfg.secretAccessKey) {
    throw new Error("Cloudflare R2 credentials are not configured in environment variables");
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint: cfg.endpoint,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
  });

  return { s3, bucketName: cfg.bucketName, publicDomain: cfg.publicDomain };
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
    const { s3, bucketName, publicDomain } = getR2Client();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });

    // Public URL format: configured CDN domain or R2 public dev bucket URL
    const baseUrl = publicDomain?.replace(/\/$/, "") || `https://${bucketName}.r2.dev`;
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
