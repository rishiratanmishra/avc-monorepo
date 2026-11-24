import { PERMISSION_CODES, type PermissionCode } from "@repo/contracts";
import {
  index,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { roles } from "./roles.js";

export const PERMISSION_SCOPES = ["platform", "hospital", "client"] as const;

export const permissions = mysqlTable(
  "permissions",
  {
    code: varchar("code", { length: 100 }).$type<PermissionCode>().primaryKey(),
    scope: mysqlEnum("scope", PERMISSION_SCOPES).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("permissions_scope_idx").on(table.scope)],
);

export const rolePermissions = mysqlTable(
  "role_permissions",
  {
    roleCode: varchar("role_code", { length: 32 })
      .notNull()
      .references(() => roles.code, { onDelete: "restrict" }),
    permissionCode: varchar("permission_code", { length: 100 })
      .$type<PermissionCode>()
      .notNull()
      .references(() => permissions.code, { onDelete: "restrict" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.roleCode, table.permissionCode],
      name: "role_permissions_primary",
    }),
    index("role_permissions_permission_code_idx").on(table.permissionCode),
  ],
);

export const PERMISSION_SCOPE_BY_CODE = Object.fromEntries(
  PERMISSION_CODES.map((code) => [code, code.split(".")[0]]),
) as Record<PermissionCode, (typeof PERMISSION_SCOPES)[number]>;

export type PermissionRecord = typeof permissions.$inferSelect;
export type NewPermissionRecord = typeof permissions.$inferInsert;
export type RolePermissionRecord = typeof rolePermissions.$inferSelect;
export type NewRolePermissionRecord = typeof rolePermissions.$inferInsert;
