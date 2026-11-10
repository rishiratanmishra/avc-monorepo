import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "node:url";
import { createPool, type Pool } from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./schema/index.js";

loadEnv({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

let pool: Pool | undefined;
let database: MySql2Database<typeof schema> | undefined;

function getPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to connect to MySQL");
  }

  pool ??= createPool(databaseUrl);
  return pool;
}

export function getDatabase(): MySql2Database<typeof schema> {
  database ??= drizzle(getPool(), { schema, mode: "default" });
  return database;
}

export async function checkDatabaseConnection(): Promise<void> {
  await getPool().query("SELECT 1");
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    const currentPool = pool;
    pool = undefined;
    database = undefined;
    await currentPool.end();
  }
}
