import { createClient } from "@libsql/client";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

let _dbInstance: any = null;

export function getDb(): any {
  if (_dbInstance) return _dbInstance;

  // 1. Try Cloudflare Workers context (Production D1 binding via OpenNext)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    if (ctx?.env?.DB) {
      _dbInstance = drizzleD1(ctx.env.DB, { schema });
      return _dbInstance;
    }
  } catch {
    // Not running inside Cloudflare Worker runtime
  }

  // 2. Fallback to LibSQL / SQLite (Local development & test runners)
  try {
    const dbDir = path.join(process.cwd(), "data");
    if (typeof fs !== "undefined" && fs.existsSync && !fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const sqlitePath = path.join(dbDir, "edunexus.db");
    const fileUrl = `file:${sqlitePath.replace(/\\/g, "/")}`;

    const rawClient = createClient({
      url: process.env.DATABASE_URL || fileUrl,
    });

    _dbInstance = drizzleLibsql(rawClient, { schema });
    return _dbInstance;
  } catch (err) {
    console.error("Database connection initialization error:", err);
    throw err;
  }
}

type AppDatabase = ReturnType<typeof drizzleLibsql<typeof schema>>;

// Transparent Proxy redirecting all query/mutation methods to the active database
export const db: AppDatabase = new Proxy({} as AppDatabase, {
  get(_target, prop) {
    const activeDb = getDb();
    const value = activeDb[prop];
    return typeof value === "function" ? value.bind(activeDb) : value;
  },
});

export const client = {
  executeMultiple: async (sql: string) => {
    const dbDir = path.join(process.cwd(), "data");
    const sqlitePath = path.join(dbDir, "edunexus.db");
    const fileUrl = `file:${sqlitePath.replace(/\\/g, "/")}`;
    const rawClient = createClient({ url: process.env.DATABASE_URL || fileUrl });
    return rawClient.executeMultiple(sql);
  },
};

export { schema };
