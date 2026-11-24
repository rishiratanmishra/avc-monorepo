import {
  CLIENT_RELATIONSHIP_STATUSES,
  MEMBERSHIP_STATUSES,
  type UserRoleCode,
} from "@repo/contracts";
import {
  foreignKey,
  index,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { hospitals } from "./hospitals.js";
import { roles } from "./roles.js";
import { users } from "./users.js";

export const HOSPITAL_INVITATION_STATUSES = ["pending", "accepted", "revoked", "expired"] as const;

export const hospitalMemberships = mysqlTable(
  "hospital_memberships",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    hospitalId: varchar("hospital_id", { length: 36 })
      .notNull()
      .references(() => hospitals.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: mysqlEnum("status", MEMBERSHIP_STATUSES).default("invited").notNull(),
    title: varchar("title", { length: 100 }),
    invitedByUserId: varchar("invited_by_user_id", { length: 36 }).references(() => users.id, {
      onDelete: "set null",
    }),
    activatedAt: timestamp("activated_at"),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    uniqueIndex("hospital_memberships_hospital_user_unique").on(table.hospitalId, table.userId),
    index("hospital_memberships_user_status_idx").on(table.userId, table.status),
    index("hospital_memberships_hospital_status_idx").on(table.hospitalId, table.status),
  ],
);

export const hospitalMembershipRoles = mysqlTable(
  "hospital_membership_roles",
  {
    membershipId: varchar("membership_id", { length: 36 }).notNull(),
    roleCode: varchar("role_code", { length: 32 })
      .$type<UserRoleCode>()
      .notNull()
      .references(() => roles.code, { onDelete: "restrict" }),
    assignedByUserId: varchar("assigned_by_user_id", { length: 36 }).references(() => users.id, {
      onDelete: "set null",
    }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.membershipId, table.roleCode],
      name: "hospital_membership_roles_primary",
    }),
    foreignKey({
      name: "hospital_membership_roles_membership_fk",
      columns: [table.membershipId],
      foreignColumns: [hospitalMemberships.id],
    }).onDelete("cascade"),
  ],
);

export const hospitalClients = mysqlTable(
  "hospital_clients",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    hospitalId: varchar("hospital_id", { length: 36 })
      .notNull()
      .references(() => hospitals.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: mysqlEnum("status", CLIENT_RELATIONSHIP_STATUSES).default("active").notNull(),
    clientNumber: varchar("client_number", { length: 40 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("hospital_clients_hospital_user_unique").on(table.hospitalId, table.userId),
    index("hospital_clients_user_status_idx").on(table.userId, table.status),
  ],
);

export const hospitalInvitations = mysqlTable(
  "hospital_invitations",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    hospitalId: varchar("hospital_id", { length: 36 })
      .notNull()
      .references(() => hospitals.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 254 }).notNull(),
    roleCode: varchar("role_code", { length: 32 })
      .$type<UserRoleCode>()
      .notNull()
      .references(() => roles.code, { onDelete: "restrict" }),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    status: mysqlEnum("status", HOSPITAL_INVITATION_STATUSES).default("pending").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    consumedAt: timestamp("consumed_at"),
    invitedByUserId: varchar("invited_by_user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("hospital_invitations_token_hash_unique").on(table.tokenHash),
    index("hospital_invitations_hospital_status_idx").on(table.hospitalId, table.status),
    index("hospital_invitations_email_idx").on(table.email),
  ],
);

export type HospitalMembershipRecord = typeof hospitalMemberships.$inferSelect;
export type NewHospitalMembershipRecord = typeof hospitalMemberships.$inferInsert;
export type HospitalMembershipRoleRecord = typeof hospitalMembershipRoles.$inferSelect;
export type NewHospitalMembershipRoleRecord = typeof hospitalMembershipRoles.$inferInsert;
export type HospitalClientRecord = typeof hospitalClients.$inferSelect;
export type NewHospitalClientRecord = typeof hospitalClients.$inferInsert;
export type HospitalInvitationRecord = typeof hospitalInvitations.$inferSelect;
export type NewHospitalInvitationRecord = typeof hospitalInvitations.$inferInsert;
