import {
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const locations = mysqlTable(
  "locations",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    address: varchar("address", { length: 1000 }).notNull(),
    phone: varchar("phone", { length: 32 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex("locations_slug_unique").on(table.slug)],
);

export type LocationRecord = typeof locations.$inferSelect;
export type NewLocationRecord = typeof locations.$inferInsert;
