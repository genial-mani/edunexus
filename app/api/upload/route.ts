import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as "avatars" | "resumes" | "logos" | "buses") || "avatars";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 8MB maximum size limit" }, { status: 400 });
    }

    // Allowed types
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const allowedDocTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

    if (folder === "resumes") {
      if (!allowedDocTypes.includes(file.type)) {
        return NextResponse.json({ error: "Resumes must be in PDF or Word (.doc/.docx) format" }, { status: 400 });
      }
    } else {
      if (!allowedImageTypes.includes(file.type)) {
        return NextResponse.json({ error: "Images must be JPG, PNG, or WebP" }, { status: 400 });
      }
    }

    const result = await uploadFile(file, folder);

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: result.filename,
      size: result.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
