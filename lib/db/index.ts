import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

type AppDatabase = ReturnType<typeof drizzleLibsql<typeof schema>>;

export function getDb(): AppDatabase {
  // 1. Production: Cloudflare Workers active request context (D1 binding)
  try {
    const ctx = getCloudflareContext();
    const d1 = (ctx?.env as any)?.DB || (ctx?.env as any)?.edunexus_db;
    if (d1) {
      return drizzleD1(d1, { schema }) as unknown as AppDatabase;
    }
  } catch {
    // Outside Cloudflare Worker runtime (local development / testing)
  }

  // 2. Local development fallback: LibSQL SQLite
  const client = createClient({
    url: process.env.DATABASE_URL || "file:data/edunexus.db",
  });
  return drizzleLibsql(client, { schema });
}

// Transparent Proxy redirecting queries per-request to the active database
export const db: AppDatabase = new Proxy({} as AppDatabase, {
  get(_target, prop) {
    const activeDb = getDb();
    const value = activeDb[prop as keyof AppDatabase];
    return typeof value === "function" ? (value as any).bind(activeDb) : value;
  },
});

export const client = {
  executeMultiple: async (sql: string) => {
    const rawClient = createClient({
      url: process.env.DATABASE_URL || "file:data/edunexus.db",
    });
    return rawClient.executeMultiple(sql);
  },
};

export { schema };
