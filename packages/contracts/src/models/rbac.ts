import { z } from "zod";
import { UserRoleCodeSchema } from "./user.js";

export const ACCESS_SCOPES = ["platform", "hospital", "client"] as const;
export const AccessScopeSchema = z.enum(ACCESS_SCOPES);

export const PLATFORM_ROLE_CODES = ["admin"] as const;
export const HOSPITAL_ROLE_CODES = [
  "hospital_owner",
  "hospital_admin",
  "veterinarian",
  "veterinary_technician",
  "veterinary_assistant",
  "receptionist",
  "billing",
  "staff",
] as const;
export const CLIENT_ROLE_CODES = ["pet_owner"] as const;
export const ASSIGNABLE_PLATFORM_ROLE_CODES = ["admin"] as const;
export const ASSIGNABLE_HOSPITAL_ROLE_CODES = [
  "hospital_owner",
  "hospital_admin",
  "veterinarian",
  "veterinary_technician",
  "veterinary_assistant",
  "receptionist",
  "billing",
] as const;

export const PlatformRoleCodeSchema = z.enum(PLATFORM_ROLE_CODES);
export const HospitalRoleCodeSchema = z.enum(HOSPITAL_ROLE_CODES);
export const AssignableHospitalRoleCodeSchema = z.enum(ASSIGNABLE_HOSPITAL_ROLE_CODES);
export const ClientRoleCodeSchema = z.enum(CLIENT_ROLE_CODES);

export const AUDIT_OUTCOMES = ["success", "denied", "failure"] as const;
export const AuditOutcomeSchema = z.enum(AUDIT_OUTCOMES);
export type AuditOutcome = z.infer<typeof AuditOutcomeSchema>;

export const PERMISSION_CODES = [
  "platform.hospitals.manage",
  "platform.users.manage",
  "platform.audit.read",
  "hospital.settings.manage",
  "hospital.members.manage",
  "hospital.clients.read",
  "hospital.schedule.manage",
  "hospital.patients.read",
  "hospital.records.read",
  "hospital.records.write",
  "hospital.clinical_tasks.manage",
  "hospital.prescriptions.write",
  "hospital.billing.manage",
  "hospital.inventory.manage",
  "client.profile.manage",
  "client.appointments.manage",
  "client.records.read",
] as const;

export const PermissionCodeSchema = z.enum(PERMISSION_CODES);

export type AccessScope = z.infer<typeof AccessScopeSchema>;
export type PlatformRoleCode = z.infer<typeof PlatformRoleCodeSchema>;
export type HospitalRoleCode = z.infer<typeof HospitalRoleCodeSchema>;
export type AssignableHospitalRoleCode = z.infer<typeof AssignableHospitalRoleCodeSchema>;
export type ClientRoleCode = z.infer<typeof ClientRoleCodeSchema>;
export type PermissionCode = z.infer<typeof PermissionCodeSchema>;

export const ROLE_PERMISSIONS: Readonly<
  Record<z.infer<typeof UserRoleCodeSchema>, readonly PermissionCode[]>
> = {
  admin: ["platform.hospitals.manage", "platform.users.manage", "platform.audit.read"],
  hospital_owner: [
    "hospital.settings.manage",
    "hospital.members.manage",
    "hospital.clients.read",
    "hospital.schedule.manage",
    "hospital.patients.read",
    "hospital.records.read",
    "hospital.records.write",
    "hospital.clinical_tasks.manage",
    "hospital.prescriptions.write",
    "hospital.billing.manage",
    "hospital.inventory.manage",
  ],
  hospital_admin: [
    "hospital.settings.manage",
    "hospital.members.manage",
    "hospital.clients.read",
    "hospital.schedule.manage",
    "hospital.patients.read",
    "hospital.records.read",
    "hospital.billing.manage",
    "hospital.inventory.manage",
  ],
  veterinarian: [
    "hospital.schedule.manage",
    "hospital.patients.read",
    "hospital.records.read",
    "hospital.records.write",
    "hospital.clinical_tasks.manage",
    "hospital.prescriptions.write",
  ],
  veterinary_technician: [
    "hospital.patients.read",
    "hospital.records.read",
    "hospital.records.write",
    "hospital.clinical_tasks.manage",
  ],
  veterinary_assistant: ["hospital.patients.read", "hospital.clinical_tasks.manage"],
  receptionist: ["hospital.clients.read", "hospital.schedule.manage", "hospital.patients.read"],
  billing: ["hospital.clients.read", "hospital.billing.manage"],
  staff: [],
  pet_owner: ["client.profile.manage", "client.appointments.manage", "client.records.read"],
};

const idSchema = z.uuid();
const timestampSchema = z.iso.datetime();

export const HOSPITAL_STATUSES = ["active", "suspended", "closed"] as const;
export const HospitalStatusSchema = z.enum(HOSPITAL_STATUSES);
export type HospitalStatus = z.infer<typeof HospitalStatusSchema>;

export const MEMBERSHIP_STATUSES = ["invited", "active", "suspended", "revoked"] as const;
export const MembershipStatusSchema = z.enum(MEMBERSHIP_STATUSES);
export type MembershipStatus = z.infer<typeof MembershipStatusSchema>;

export const CLIENT_RELATIONSHIP_STATUSES = ["active", "suspended", "ended"] as const;
export const ClientRelationshipStatusSchema = z.enum(CLIENT_RELATIONSHIP_STATUSES);
export type ClientRelationshipStatus = z.infer<typeof ClientRelationshipStatusSchema>;

export const HospitalSummarySchema = z.strictObject({
  id: idSchema,
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(120),
  status: HospitalStatusSchema,
});
export type HospitalSummary = z.infer<typeof HospitalSummarySchema>;

export const CreateHospitalSchema = z.strictObject({
  ownerEmail: z.string().trim().toLowerCase().pipe(z.email()),
  name: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case")
    .max(120),
  addressLine1: z.string().trim().min(1).max(255).nullable().optional(),
  city: z.string().trim().min(1).max(100).nullable().optional(),
  state: z.string().trim().min(1).max(100).nullable().optional(),
  postalCode: z.string().trim().min(1).max(20).nullable().optional(),
  countryCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/)
    .nullable()
    .optional(),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, "Phone number must use E.164 format")
    .nullable()
    .optional(),
});
export type CreateHospitalInput = z.infer<typeof CreateHospitalSchema>;

export const MembershipSchema = z.strictObject({
  id: idSchema,
  hospitalId: idSchema,
  userId: idSchema,
  status: MembershipStatusSchema,
  title: z.string().trim().max(100).nullable(),
  roles: z.array(HospitalRoleCodeSchema),
  permissions: z.array(PermissionCodeSchema),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});
export type Membership = z.infer<typeof MembershipSchema>;

export const HospitalMembershipSchema = MembershipSchema.extend({
  hospitalName: z.string().trim().min(1).max(120),
  hospitalStatus: HospitalStatusSchema,
}).strict();
export type HospitalMembership = z.infer<typeof HospitalMembershipSchema>;

export const ClientRelationshipSchema = z.strictObject({
  id: idSchema,
  hospitalId: idSchema,
  userId: idSchema,
  status: ClientRelationshipStatusSchema,
  createdAt: timestampSchema,
});
export type ClientRelationship = z.infer<typeof ClientRelationshipSchema>;

export const HospitalClientRelationshipSchema = ClientRelationshipSchema.extend({
  hospitalName: z.string().trim().min(1).max(120),
}).strict();
export type HospitalClientRelationship = z.infer<
  typeof HospitalClientRelationshipSchema
>;

export const WorkspaceSchema = z.strictObject({
  scope: AccessScopeSchema,
  hospitalId: idSchema.nullable(),
  hospitalName: z.string().trim().min(1).max(120).nullable(),
  permissions: z.array(PermissionCodeSchema),
});
export type Workspace = z.infer<typeof WorkspaceSchema>;

export const ApplicationDestinationSchema = z.strictObject({
  id: z.string().trim().min(1).max(64),
  label: z.string().trim().min(1).max(100),
  path: z.string().trim().startsWith("/").max(200),
  scope: AccessScopeSchema,
  hospitalId: idSchema.nullable(),
});
export type ApplicationDestination = z.infer<typeof ApplicationDestinationSchema>;

export const AccessContextSchema = z.strictObject({
  userId: idSchema,
  email: z.email(),
  status: z.enum(["pending_verification", "active", "suspended", "deactivated"]),
  globalRoles: z.array(UserRoleCodeSchema),
  memberships: z.array(HospitalMembershipSchema),
  clientRelationships: z.array(HospitalClientRelationshipSchema),
  activeWorkspace: WorkspaceSchema,
  activeDestination: ApplicationDestinationSchema.nullable(),
  destinations: z.array(ApplicationDestinationSchema),
});
export type AccessContext = z.infer<typeof AccessContextSchema>;

export const SelectWorkspaceSchema = z.strictObject({
  scope: AccessScopeSchema,
  hospitalId: idSchema.nullable().optional(),
});
export type SelectWorkspaceInput = z.infer<typeof SelectWorkspaceSchema>;

export const InviteMemberSchema = z.strictObject({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  roleCode: AssignableHospitalRoleCodeSchema,
});
export type InviteMemberInput = z.infer<typeof InviteMemberSchema>;

export const AcceptInvitationSchema = z.strictObject({
  token: z.string().min(40).max(256),
});
export type AcceptInvitationInput = z.infer<typeof AcceptInvitationSchema>;

export const UpdateMembershipStatusSchema = z.strictObject({
  status: z.enum(["active", "suspended", "revoked"]),
});
export type UpdateMembershipStatusInput = z.infer<typeof UpdateMembershipStatusSchema>;

export const UpdateHospitalStatusSchema = z.strictObject({
  status: z.enum(["active", "suspended", "closed"]),
});
export type UpdateHospitalStatusInput = z.infer<typeof UpdateHospitalStatusSchema>;

export const InvitationResultSchema = z.strictObject({
  hospitalId: idSchema,
  userId: idSchema,
  membershipId: idSchema,
  roleCode: AssignableHospitalRoleCodeSchema,
});
export type InvitationResultContract = z.infer<typeof InvitationResultSchema>;
