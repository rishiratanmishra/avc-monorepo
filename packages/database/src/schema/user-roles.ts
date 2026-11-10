import type { UserRoleCode } from "@repo/contracts/models/user";
import { users } from "./users.js";
import { roles } from "./roles.js";
import {
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const userRoles = mysqlTable(
  "user_roles",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleCode: varchar("role_code", { length: 32 })
      .$type<UserRoleCode>()
      .notNull()
      .references(() => roles.code, { onDelete: "restrict" }),
    assignedByUserId: varchar("assigned_by_user_id", { length: 36 }).references(
      () => users.id,
      { onDelete: "set null" },
    ),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleCode] })],
);

export type UserRoleRecord = typeof userRoles.$inferSelect;
export type NewUserRoleRecord = typeof userRoles.$inferInsert;
