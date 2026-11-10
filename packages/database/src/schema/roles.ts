import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const roles = mysqlTable("roles", {
  code: varchar("code", { length: 32 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type RoleRecord = typeof roles.$inferSelect;
export type NewRoleRecord = typeof roles.$inferInsert;
