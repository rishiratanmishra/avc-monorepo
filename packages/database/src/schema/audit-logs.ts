import { users } from "./users.js";
import {
  index,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const auditLogs = mysqlTable(
  "audit_logs",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    actorUserId: varchar("actor_user_id", { length: 36 }).references(
      () => users.id,
      { onDelete: "set null" },
    ),
    targetUserId: varchar("target_user_id", { length: 36 }).references(
      () => users.id,
      { onDelete: "set null" },
    ),
    action: varchar("action", { length: 100 }).notNull(),
    requestId: varchar("request_id", { length: 36 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("audit_logs_actor_created_idx").on(
      table.actorUserId,
      table.createdAt,
    ),
    index("audit_logs_target_created_idx").on(
      table.targetUserId,
      table.createdAt,
    ),
    index("audit_logs_action_created_idx").on(table.action, table.createdAt),
    uniqueIndex("audit_logs_request_id_action_unique").on(
      table.requestId,
      table.action,
    ),
  ],
);

export type AuditLogRecord = typeof auditLogs.$inferSelect;
export type NewAuditLogRecord = typeof auditLogs.$inferInsert;
