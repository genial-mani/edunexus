import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

// Create local sqlite database directory if it doesn't exist
const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlitePath = path.join(dbDir, "edunexus.db");
// Format as file URL for LibSQL
const fileUrl = `file:${sqlitePath.replace(/\\/g, "/")}`;

export const client = createClient({
  url: process.env.DATABASE_URL || fileUrl,
});

export const db = drizzle(client, { schema });
export { schema };
