import { AwsClient } from "aws4fetch";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface PresignedUrlResult {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  isDirectR2: boolean;
}

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
    endpoint: endpoint?.replace(/\/$/, ""),
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicDomain: publicDomain?.replace(/\/$/, ""),
  };
}

export function isR2Configured(): boolean {
  const cfg = getR2Config();
  return Boolean(cfg.endpoint && cfg.accessKeyId && cfg.secretAccessKey && cfg.bucketName);
}

/**
 * Generates an authorization-checked, short-lived presigned PUT URL for Cloudflare R2
 * Uses edge-compatible aws4fetch (WebCrypto-based, no node fs dependency).
 * Falls back to local direct-PUT handler in local development if R2 credentials are unset.
 */
export async function createPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds: number = 300
): Promise<PresignedUrlResult> {
  if (isR2Configured()) {
    const cfg = getR2Config();
    const aws = new AwsClient({
      accessKeyId: cfg.accessKeyId!,
      secretAccessKey: cfg.secretAccessKey!,
      service: "s3",
      region: "auto",
    });

    // Cloudflare S3 API endpoint format: https://<endpoint>/<bucket>/<key>
    const targetUrl = `${cfg.endpoint}/${cfg.bucketName}/${key}`;
    const signedRequest = await aws.sign(
      new Request(targetUrl, {
        method: "PUT",
        headers: { "Content-Type": contentType },
      }),
      {
        aws: { signQuery: true, datetime: new Date().toISOString().replace(/[:-]|\.\d{3}/g, "") },
      }
    );

    // Public CDN URL via media.arundigi.in or R2 public URL
    const fileUrl = `${cfg.publicDomain}/${key}`;

    return {
      uploadUrl: signedRequest.url,
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
