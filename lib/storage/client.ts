/**
 * Client-side file uploader utilizing authorization-checked presigned URLs.
 * In production: uploads binary directly to Cloudflare R2 via HTTP PUT.
 * In local dev: uploads binary to local direct PUT endpoint.
 */
export async function uploadFilePresigned(
  file: File,
  folder: "avatars" | "resumes" | "logos" | "buses" = "avatars"
): Promise<{ url: string; key: string; filename: string }> {
  // 1. Request presigned upload URL from EduNexus API
  const presignRes = await fetch("/api/upload/presign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      size: file.size,
      folder,
    }),
  });

  if (!presignRes.ok) {
    const errorData = await presignRes.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to obtain upload authorization");
  }

  const { uploadUrl, fileUrl, key } = await presignRes.json();

  // 2. Direct binary PUT upload to Cloudflare R2 / storage
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error(`Failed to upload file to storage (${uploadRes.status})`);
  }

  return {
    url: fileUrl,
    key,
    filename: file.name,
  };
}
