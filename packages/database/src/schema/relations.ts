import { relations } from "drizzle-orm";
import { roles } from "./roles.js";
import { userProfiles } from "./user-profiles.js";
import { userRoles } from "./user-roles.js";
import { users } from "./users.js";

export const usersRelations = relations(users, ({ many, one }) => ({
  profile: one(userProfiles),
  roles: many(userRoles, { relationName: "userRoleAssignments" }),
  roleAssignments: many(userRoles, { relationName: "roleAssigner" }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
    relationName: "userRoleAssignments",
  }),
  role: one(roles, {
    fields: [userRoles.roleCode],
    references: [roles.code],
  }),
  assignedBy: one(users, {
    fields: [userRoles.assignedByUserId],
    references: [users.id],
    relationName: "roleAssigner",
  }),
}));
