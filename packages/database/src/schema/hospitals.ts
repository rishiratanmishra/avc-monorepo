import { HOSPITAL_STATUSES } from "@repo/contracts/models/rbac";
import {
  index,
  mysqlEnum,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const hospitals = mysqlTable(
  "hospitals",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    status: mysqlEnum("status", HOSPITAL_STATUSES).default("active").notNull(),
    addressLine1: varchar("address_line_1", { length: 255 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    countryCode: varchar("country_code", { length: 2 }),
    phone: varchar("phone", { length: 32 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    uniqueIndex("hospitals_slug_unique").on(table.slug),
    index("hospitals_status_idx").on(table.status),
  ],
);

export type HospitalRecord = typeof hospitals.$inferSelect;
export type NewHospitalRecord = typeof hospitals.$inferInsert;
