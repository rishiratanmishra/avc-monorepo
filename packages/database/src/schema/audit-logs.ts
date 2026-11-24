import { AUDIT_OUTCOMES } from "@repo/contracts";
import {
  index,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { hospitals } from "./hospitals.js";
import { users } from "./users.js";

export const auditLogs = mysqlTable(
  "audit_logs",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    actorUserId: varchar("actor_user_id", { length: 36 }).references(() => users.id, {
      onDelete: "set null",
    }),
    targetUserId: varchar("target_user_id", { length: 36 }).references(() => users.id, {
      onDelete: "set null",
    }),
    action: varchar("action", { length: 100 }).notNull(),
    outcome: mysqlEnum("outcome", AUDIT_OUTCOMES).default("success").notNull(),
    hospitalId: varchar("hospital_id", { length: 36 }).references(() => hospitals.id, {
      onDelete: "set null",
    }),
    resourceType: varchar("resource_type", { length: 64 }),
    resourceId: varchar("resource_id", { length: 36 }),
    details: text("details"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: varchar("user_agent", { length: 512 }),
    requestId: varchar("request_id", { length: 36 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("audit_logs_actor_created_idx").on(table.actorUserId, table.createdAt),
    index("audit_logs_target_created_idx").on(table.targetUserId, table.createdAt),
    index("audit_logs_action_created_idx").on(table.action, table.createdAt),
    index("audit_logs_hospital_created_idx").on(table.hospitalId, table.createdAt),
    uniqueIndex("audit_logs_request_id_action_unique").on(table.requestId, table.action),
  ],
);

export type AuditLogRecord = typeof auditLogs.$inferSelect;
export type NewAuditLogRecord = typeof auditLogs.$inferInsert;
