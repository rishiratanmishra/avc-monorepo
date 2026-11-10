import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required. Set it in packages/database/.env before running migrations.",
  );
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: databaseUrl,
  },
});
