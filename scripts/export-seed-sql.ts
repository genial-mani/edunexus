import { createClient } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";

async function exportSeed() {
  const client = createClient({
    url: "file:data/edunexus.db",
  });

  const tables = [
    "users",
    "institutes",
    "institute_members",
    "teacher_profiles",
    "job_vacancies",
    "bus_listings",
    "bus_listing_images",
    "job_applications",
    "saved_jobs",
    "bus_inquiries",
    "notifications",
  ];

  let sqlOutput = "-- EduNexus Seed Data Generated for D1\n\n";

  for (const table of tables) {
    const res = await client.execute(`SELECT * FROM ${table}`);
    if (res.rows.length === 0) continue;

    sqlOutput += `-- Data for ${table}\n`;
    for (const row of res.rows) {
      const cols = res.columns;
      const vals = cols.map((col) => {
        const val = row[col];
        if (val === null || val === undefined) return "NULL";
        if (typeof val === "number") return val;
        return `'${String(val).replace(/'/g, "''")}'`;
      });

      sqlOutput += `INSERT OR REPLACE INTO ${table} (${cols.join(", ")}) VALUES (${vals.join(", ")});\n`;
    }
    sqlOutput += "\n";
  }

  const outputPath = path.resolve(process.cwd(), "lib/db/seed.sql");
  fs.writeFileSync(outputPath, sqlOutput, "utf-8");
  console.log(`✅ Successfully generated lib/db/seed.sql!`);
}

exportSeed().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
