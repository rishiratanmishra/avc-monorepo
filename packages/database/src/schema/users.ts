import { USER_STATUSES, type UserStatus } from "@repo/contracts/models/user";
import {
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    email: varchar("email", { length: 254 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    status: mysqlEnum("status", [...USER_STATUSES])
      .$type<UserStatus>()
      .default("pending_verification")
      .notNull(),
    emailVerifiedAt: timestamp("email_verified_at"),
    passwordChangedAt: timestamp("password_changed_at"),
    lastLoginAt: timestamp("last_login_at"),
    failedLoginAttempts: int("failed_login_attempts", { unsigned: true })
      .default(0)
      .notNull(),
    lockedUntil: timestamp("locked_until"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export type UserRecord = typeof users.$inferSelect;
export type NewUserRecord = typeof users.$inferInsert;
