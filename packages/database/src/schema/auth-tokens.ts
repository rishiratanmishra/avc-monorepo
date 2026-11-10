import { users } from "./users.js";
import {
  index,
  mysqlEnum,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const AUTH_TOKEN_TYPES = [
  "email_verification",
  "password_reset",
] as const;

export type AuthTokenType = (typeof AUTH_TOKEN_TYPES)[number];

export const authTokens = mysqlTable(
  "auth_tokens",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: mysqlEnum("type", [...AUTH_TOKEN_TYPES]).notNull(),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    consumedAt: timestamp("consumed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("auth_tokens_token_hash_unique").on(table.tokenHash),
    index("auth_tokens_user_type_idx").on(table.userId, table.type),
    index("auth_tokens_expires_at_idx").on(table.expiresAt),
  ],
);

export type AuthTokenRecord = typeof authTokens.$inferSelect;
export type NewAuthTokenRecord = typeof authTokens.$inferInsert;
