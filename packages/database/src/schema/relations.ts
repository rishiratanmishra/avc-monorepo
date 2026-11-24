import { relations } from "drizzle-orm";
import {
  hospitalClients,
  hospitalInvitations,
  hospitalMembershipRoles,
  hospitalMemberships,
} from "./hospital-memberships.js";
import { hospitals } from "./hospitals.js";
import { permissions, rolePermissions } from "./permissions.js";
import { roles } from "./roles.js";
import { userProfiles } from "./user-profiles.js";
import { userRoles } from "./user-roles.js";
import { users } from "./users.js";

export const usersRelations = relations(users, ({ many, one }) => ({
  profile: one(userProfiles),
  roles: many(userRoles, { relationName: "userRoleAssignments" }),
  roleAssignments: many(userRoles, { relationName: "roleAssigner" }),
  memberships: many(hospitalMemberships, { relationName: "membershipUser" }),
  membershipInvitations: many(hospitalMemberships, {
    relationName: "membershipInviter",
  }),
  clientRelationships: many(hospitalClients, { relationName: "clientUser" }),
  sentInvitations: many(hospitalInvitations, {
    relationName: "invitationInviter",
  }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(userRoles),
  hospitalRoles: many(hospitalMembershipRoles),
  permissions: many(rolePermissions),
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

export const hospitalsRelations = relations(hospitals, ({ many }) => ({
  memberships: many(hospitalMemberships),
  clients: many(hospitalClients),
  invitations: many(hospitalInvitations),
}));

export const hospitalMembershipsRelations = relations(hospitalMemberships, ({ one, many }) => ({
  hospital: one(hospitals, {
    fields: [hospitalMemberships.hospitalId],
    references: [hospitals.id],
  }),
  user: one(users, {
    fields: [hospitalMemberships.userId],
    references: [users.id],
    relationName: "membershipUser",
  }),
  invitedBy: one(users, {
    fields: [hospitalMemberships.invitedByUserId],
    references: [users.id],
    relationName: "membershipInviter",
  }),
  roles: many(hospitalMembershipRoles),
}));

export const hospitalMembershipRolesRelations = relations(hospitalMembershipRoles, ({ one }) => ({
  membership: one(hospitalMemberships, {
    fields: [hospitalMembershipRoles.membershipId],
    references: [hospitalMemberships.id],
  }),
  role: one(roles, {
    fields: [hospitalMembershipRoles.roleCode],
    references: [roles.code],
  }),
  assignedBy: one(users, {
    fields: [hospitalMembershipRoles.assignedByUserId],
    references: [users.id],
  }),
}));

export const hospitalClientsRelations = relations(hospitalClients, ({ one }) => ({
  hospital: one(hospitals, {
    fields: [hospitalClients.hospitalId],
    references: [hospitals.id],
  }),
  user: one(users, {
    fields: [hospitalClients.userId],
    references: [users.id],
    relationName: "clientUser",
  }),
}));

export const hospitalInvitationsRelations = relations(hospitalInvitations, ({ one }) => ({
  hospital: one(hospitals, {
    fields: [hospitalInvitations.hospitalId],
    references: [hospitals.id],
  }),
  invitedBy: one(users, {
    fields: [hospitalInvitations.invitedByUserId],
    references: [users.id],
    relationName: "invitationInviter",
  }),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleCode],
    references: [roles.code],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionCode],
    references: [permissions.code],
  }),
}));
