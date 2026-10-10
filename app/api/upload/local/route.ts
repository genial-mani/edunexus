import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Missing upload object key" }, { status: 400 });
    }

    // Sanitize key path
    const normalizedKey = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, "");
    const targetFilePath = path.join(UPLOAD_DIR, normalizedKey);
    const targetFolder = path.dirname(targetFilePath);

    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(targetFilePath, buffer);

    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.error("Local storage PUT error:", err);
    return NextResponse.json({ error: "Failed to store file" }, { status: 500 });
  }
}
