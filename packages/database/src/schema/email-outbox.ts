import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const EMAIL_OUTBOX_TYPES = [
  "email_verification",
  "password_reset",
] as const;
export const EMAIL_OUTBOX_STATUSES = [
  "pending",
  "processing",
  "sent",
  "failed",
] as const;

export type EmailOutboxType = (typeof EMAIL_OUTBOX_TYPES)[number];
export type EmailOutboxStatus = (typeof EMAIL_OUTBOX_STATUSES)[number];

export const emailOutbox = mysqlTable(
  "email_outbox",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    recipient: varchar("recipient", { length: 254 }).notNull(),
    type: mysqlEnum("type", [...EMAIL_OUTBOX_TYPES]).notNull(),
    encryptedPayload: varchar("encrypted_payload", { length: 512 }).notNull(),
    status: mysqlEnum("status", [...EMAIL_OUTBOX_STATUSES])
      .default("pending")
      .notNull(),
    attempts: int("attempts", { unsigned: true }).default(0).notNull(),
    availableAt: timestamp("available_at").defaultNow().notNull(),
    lockedAt: timestamp("locked_at"),
    sentAt: timestamp("sent_at"),
    lastError: varchar("last_error", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("email_outbox_status_available_idx").on(
      table.status,
      table.availableAt,
    ),
    index("email_outbox_locked_at_idx").on(table.lockedAt),
  ],
);

export type EmailOutboxRecord = typeof emailOutbox.$inferSelect;
export type NewEmailOutboxRecord = typeof emailOutbox.$inferInsert;
