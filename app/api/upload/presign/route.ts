import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createPresignedUploadUrl } from "@/lib/storage/r2";
import path from "path";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required to upload files" }, { status: 401 });
    }

    const body = await request.json();
    const { filename, contentType, size, folder = "avatars" } = body;

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
    }

    // Validate size (max 8MB)
    if (size && size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 8MB maximum size limit" }, { status: 400 });
    }

    // Validate allowed folder categories
    const validFolders = ["avatars", "resumes", "logos", "buses"];
    if (!validFolders.includes(folder)) {
      return NextResponse.json({ error: "Invalid upload category" }, { status: 400 });
    }

    // Validate MIME types
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const allowedDocTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (folder === "resumes") {
      if (!allowedDocTypes.includes(contentType)) {
        return NextResponse.json({ error: "Resumes must be in PDF or Word (.doc/.docx) format" }, { status: 400 });
      }
    } else {
      if (!allowedImageTypes.includes(contentType)) {
        return NextResponse.json({ error: "Images must be JPG, PNG, or WebP" }, { status: 400 });
      }
    }

    // Extract sanitized extension
    const ext = path.extname(filename).toLowerCase().replace(/[^a-z0-9.]/g, "") || (folder === "resumes" ? ".pdf" : ".jpg");
    const uniqueKey = `${folder}/${folder}_${Date.now()}_${crypto.randomUUID().slice(0, 8)}${ext}`;

    const presigned = await createPresignedUploadUrl(uniqueKey, contentType, 300);

    return NextResponse.json({
      success: true,
      uploadUrl: presigned.uploadUrl,
      fileUrl: presigned.fileUrl,
      key: presigned.key,
      isDirectR2: presigned.isDirectR2,
    });
  } catch (error) {
    console.error("Presign error:", error);
    return NextResponse.json({ error: "Failed to generate presigned upload URL" }, { status: 500 });
  }
}
