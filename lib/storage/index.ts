import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export async function uploadFile(
  file: File,
  folder: "avatars" | "resumes" | "logos" | "buses" = "avatars"
): Promise<UploadResult> {
  const targetDir = path.join(UPLOAD_DIR, folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const extension = path.extname(file.name).toLowerCase() || ".jpg";
  const uniqueName = `${folder}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${extension}`;
  const filePath = path.join(targetDir, uniqueName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  fs.writeFileSync(filePath, buffer);

  const publicUrl = `/uploads/${folder}/${uniqueName}`;

  return {
    url: publicUrl,
    filename: uniqueName,
    size: buffer.length,
  };
}

export * from "./r2";
