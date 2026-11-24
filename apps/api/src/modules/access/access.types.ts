import type {
  AccessScope,
  AuditOutcome,
  ClientRelationshipStatus,
  CreateHospitalInput,
  HospitalStatus,
  MembershipStatus,
  PermissionCode,
  UserRoleCode,
} from "@repo/contracts";
import type { NewEmailOutboxRecord } from "@repo/database";

export interface SessionIdentity {
  id: string;
  userId: string;
  expiresAt: Date;
  activeHospitalId: string | null;
  activeScope: AccessScope | null;
}

export interface IdentityUser {
  id: string;
  email: string;
  status: "pending_verification" | "active" | "suspended" | "deactivated";
}

export interface MembershipView {
  id: string;
  hospitalId: string;
  hospitalName: string;
  hospitalStatus: HospitalStatus;
  userId: string;
  status: MembershipStatus;
  title: string | null;
  roles: UserRoleCode[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientRelationshipView {
  id: string;
  hospitalId: string;
  hospitalName: string;
  hospitalStatus: HospitalStatus;
  userId: string;
  status: ClientRelationshipStatus;
  createdAt: Date;
}

export interface HospitalView {
  id: string;
  name: string;
  slug: string;
  status: HospitalStatus;
}

export interface InvitationResult {
  hospitalId: string;
  userId: string;
  membershipId: string;
  roleCode: UserRoleCode;
}

export interface AuditInput {
  actorUserId: string | null;
  targetUserId?: string | null;
  action: string;
  outcome: AuditOutcome;
  requestId: string;
  hospitalId?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface CreateInvitationInput {
  hospitalId: string;
  email: string;
  roleCode: UserRoleCode;
  tokenHash: string;
  expiresAt: Date;
  invitedByUserId: string;
}

export type PendingInvitationInput = Omit<CreateInvitationInput, "hospitalId">;

export interface AccessRepository {
  findSessionByTokenHash(tokenHash: string): Promise<SessionIdentity | null>;
  touchSession(sessionId: string): Promise<void>;
  getUser(userId: string): Promise<IdentityUser | null>;
  getUserByEmail(email: string): Promise<IdentityUser | null>;
  getGlobalRoles(userId: string): Promise<UserRoleCode[]>;
  getMemberships(userId: string): Promise<MembershipView[]>;
  getClientRelationships(userId: string): Promise<ClientRelationshipView[]>;
  setActiveHospital(
    sessionId: string,
    hospitalId: string | null,
    scope: AccessScope | null,
  ): Promise<void>;
  revokeSessionsForHospital(userId: string, hospitalId: string): Promise<void>;
  revokeAllSessions(userId: string): Promise<void>;
  revokeAllSessionsForHospital(hospitalId: string): Promise<void>;
  audit(input: AuditInput): Promise<void>;
}

export interface HospitalRepository {
  listHospitals(): Promise<HospitalView[]>;
  createHospital(input: CreateHospitalInput, status: HospitalStatus): Promise<HospitalView>;
  setHospitalStatus(hospitalId: string, status: HospitalStatus): Promise<void>;
  setHospitalStatusWithSessionRevocation(hospitalId: string, status: HospitalStatus): Promise<void>;
  createInvitation(input: CreateInvitationInput): Promise<void>;
  createInvitationWithEmail(
    input: CreateInvitationInput,
    emailRecord: NewEmailOutboxRecord,
  ): Promise<void>;
  createHospitalWithOwnerInvitation(
    input: CreateHospitalInput,
    status: HospitalStatus,
    invitation: PendingInvitationInput,
    emailRecord: NewEmailOutboxRecord,
  ): Promise<HospitalView>;
  consumeInvitation(input: {
    tokenHash: string;
    userId: string;
    email: string;
    consumedAt: Date;
  }): Promise<InvitationResult | null>;
  getMembership(hospitalId: string, membershipId: string): Promise<MembershipView | null>;
  listHospitalMemberships(hospitalId: string): Promise<MembershipView[]>;
  setMembershipStatus(
    hospitalId: string,
    membershipId: string,
    status: Extract<MembershipStatus, "active" | "suspended" | "revoked">,
  ): Promise<MembershipView>;
  addMembershipRole(
    hospitalId: string,
    membershipId: string,
    roleCode: UserRoleCode,
    assignedByUserId: string,
  ): Promise<void>;
  removeMembershipRole(
    hospitalId: string,
    membershipId: string,
    roleCode: UserRoleCode,
  ): Promise<void>;
  countActiveOwners(hospitalId: string): Promise<number>;
  queueEmail(record: NewEmailOutboxRecord): Promise<void>;
}

export interface InvitationEmailPreparer {
  prepareHospitalInvitationEmail(recipient: string, token: string): NewEmailOutboxRecord;
}

export interface RequestMetadata {
  requestId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AuthenticatedPrincipal {
  userId: string;
  sessionId: string;
  activeHospitalId: string | null;
  activeScope: AccessScope | null;
}

export interface AuthorizationRequest extends RequestMetadata {
  principal: AuthenticatedPrincipal;
  permission: PermissionCode;
  hospitalId?: string | null;
}
