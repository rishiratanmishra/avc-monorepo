import { users } from "./users.js";
import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const userProfiles = mysqlTable("user_profiles", {
  userId: varchar("user_id", { length: 36 })
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  preferredName: varchar("preferred_name", { length: 100 }),
  phone: varchar("phone", { length: 16 }),
  phoneVerifiedAt: timestamp("phone_verified_at"),
  avatarUrl: varchar("avatar_url", { length: 2048 }),
  addressLine1: varchar("address_line_1", { length: 255 }),
  addressLine2: varchar("address_line_2", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }),
  countryCode: varchar("country_code", { length: 2 }),
  locale: varchar("locale", { length: 20 }).default("en-IN").notNull(),
  timeZone: varchar("time_zone", { length: 64 })
    .default("Asia/Kolkata")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserProfileRecord = typeof userProfiles.$inferSelect;
export type NewUserProfileRecord = typeof userProfiles.$inferInsert;
