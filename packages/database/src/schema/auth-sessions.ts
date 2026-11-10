import { users } from "./users.js";
import {
  index,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const authSessions = mysqlTable(
  "auth_sessions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("auth_sessions_token_hash_unique").on(table.tokenHash),
    index("auth_sessions_user_id_idx").on(table.userId),
    index("auth_sessions_expires_at_idx").on(table.expiresAt),
  ],
);

export type AuthSessionRecord = typeof authSessions.$inferSelect;
export type NewAuthSessionRecord = typeof authSessions.$inferInsert;
