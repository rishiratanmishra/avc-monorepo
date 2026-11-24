import type {
  AccessScope,
  CreateHospitalInput,
  HospitalStatus,
  UserRoleCode,
} from "@repo/contracts";
import type { NewEmailOutboxRecord } from "@repo/database";
import type {
  AccessRepository,
  AuditInput,
  ClientRelationshipView,
  CreateInvitationInput,
  HospitalRepository,
  HospitalView,
  IdentityUser,
  InvitationEmailPreparer,
  InvitationResult,
  MembershipView,
  PendingInvitationInput,
  SessionIdentity,
} from "../access.types.js";

export function testUuid(suffix: number): string {
  return `00000000-0000-4000-8000-${String(suffix).padStart(12, "0")}`;
}

export function testDate(offsetMs = 0): Date {
  return new Date(Date.now() + offsetMs);
}

interface StoredSession extends SessionIdentity {
  tokenHash: string;
}

interface StoredInvitation extends CreateInvitationInput {
  status: "pending" | "accepted" | "revoked";
}

export class FakeAccessRepository implements AccessRepository, HospitalRepository {
  readonly sessions = new Map<string, StoredSession>();
  readonly users = new Map<string, IdentityUser>();
  readonly globalRoles = new Map<string, Set<UserRoleCode>>();
  readonly memberships: MembershipView[] = [];
  readonly clientRelationships: ClientRelationshipView[] = [];
  readonly hospitals: HospitalView[] = [];
  readonly invitations = new Map<string, StoredInvitation>();
  readonly emails: NewEmailOutboxRecord[] = [];
  readonly audits: AuditInput[] = [];

  addUser(user: IdentityUser, roles: UserRoleCode[] = []): void {
    this.users.set(user.id, user);
    this.globalRoles.set(user.id, new Set(roles));
  }

  addSession(input: {
    id: string;
    tokenHash: string;
    userId: string;
    expiresAt: Date;
    activeHospitalId?: string | null;
    activeScope?: AccessScope | null;
  }): void {
    this.sessions.set(input.id, {
      id: input.id,
      tokenHash: input.tokenHash,
      userId: input.userId,
      expiresAt: input.expiresAt,
      activeHospitalId: input.activeHospitalId ?? null,
      activeScope: input.activeScope ?? null,
    });
  }

  addMembership(
    membership: Partial<MembershipView> & {
      id: string;
      hospitalId: string;
      userId: string;
    },
  ): void {
    this.memberships.push({
      hospitalName: "Hospital",
      hospitalStatus: "active",
      status: "active",
      title: null,
      roles: [],
      createdAt: testDate(-1000),
      updatedAt: testDate(-1000),
      ...membership,
    });
  }

  addClientRelationship(
    relationship: Partial<ClientRelationshipView> & {
      id: string;
      hospitalId: string;
      userId: string;
    },
  ): void {
    this.clientRelationships.push({
      hospitalName: "Hospital",
      hospitalStatus: "active",
      status: "active",
      createdAt: testDate(-1000),
      ...relationship,
    });
  }

  async findSessionByTokenHash(tokenHash: string): Promise<SessionIdentity | null> {
    const session = [...this.sessions.values()].find(
      (candidate) => candidate.tokenHash === tokenHash,
    );
    return session ?? null;
  }

  async touchSession(_sessionId: string): Promise<void> {}

  async getUser(userId: string): Promise<IdentityUser | null> {
    return this.users.get(userId) ?? null;
  }

  async getUserByEmail(email: string): Promise<IdentityUser | null> {
    return [...this.users.values()].find((user) => user.email === email) ?? null;
  }

  async getGlobalRoles(userId: string): Promise<UserRoleCode[]> {
    return [...(this.globalRoles.get(userId) ?? [])];
  }

  async getMemberships(userId: string): Promise<MembershipView[]> {
    return this.memberships.filter((membership) => membership.userId === userId);
  }

  async getClientRelationships(userId: string): Promise<ClientRelationshipView[]> {
    return this.clientRelationships.filter((relationship) => relationship.userId === userId);
  }

  async setActiveHospital(
    sessionId: string,
    hospitalId: string | null,
    scope: AccessScope | null,
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.activeHospitalId = hospitalId;
      session.activeScope = scope;
    }
  }

  async revokeSessionsForHospital(userId: string, hospitalId: string): Promise<void> {
    for (const [id, session] of this.sessions) {
      if (session.userId === userId && session.activeHospitalId === hospitalId) {
        this.sessions.delete(id);
      }
    }
  }

  async revokeAllSessions(userId: string): Promise<void> {
    for (const [id, session] of this.sessions) {
      if (session.userId === userId) {
        this.sessions.delete(id);
      }
    }
  }

  async revokeAllSessionsForHospital(hospitalId: string): Promise<void> {
    for (const [id, session] of this.sessions) {
      if (session.activeHospitalId === hospitalId) {
        this.sessions.delete(id);
      }
    }
  }

  async audit(input: AuditInput): Promise<void> {
    this.audits.push(input);
  }

  async listHospitals(): Promise<HospitalView[]> {
    return [...this.hospitals];
  }

  async createHospital(input: CreateHospitalInput, status: HospitalStatus): Promise<HospitalView> {
    const hospital = {
      id: testUuid(this.hospitals.length + 100),
      name: input.name,
      slug: input.slug,
      status,
    };
    this.hospitals.push(hospital);
    return hospital;
  }

  async createHospitalWithOwnerInvitation(
    input: CreateHospitalInput,
    status: HospitalStatus,
    invitation: PendingInvitationInput,
    emailRecord: NewEmailOutboxRecord,
  ): Promise<HospitalView> {
    const hospital = await this.createHospital(input, status);
    await this.createInvitationWithEmail({ ...invitation, hospitalId: hospital.id }, emailRecord);
    return hospital;
  }

  async setHospitalStatus(hospitalId: string, status: HospitalStatus): Promise<void> {
    const hospital = this.hospitals.find((candidate) => candidate.id === hospitalId);
    if (hospital) {
      hospital.status = status;
    }
  }

  async setHospitalStatusWithSessionRevocation(
    hospitalId: string,
    status: HospitalStatus,
  ): Promise<void> {
    await this.setHospitalStatus(hospitalId, status);
    await this.revokeAllSessionsForHospital(hospitalId);
  }

  async createInvitation(input: CreateInvitationInput): Promise<void> {
    this.invitations.set(input.tokenHash, { ...input, status: "pending" });
  }

  async createInvitationWithEmail(
    input: CreateInvitationInput,
    emailRecord: NewEmailOutboxRecord,
  ): Promise<void> {
    await this.createInvitation(input);
    this.emails.push(emailRecord);
  }

  async consumeInvitation(input: {
    tokenHash: string;
    userId: string;
    email: string;
    consumedAt: Date;
  }): Promise<InvitationResult | null> {
    const invitation = this.invitations.get(input.tokenHash);
    if (
      !invitation ||
      invitation.status !== "pending" ||
      invitation.email !== input.email ||
      invitation.expiresAt.getTime() <= input.consumedAt.getTime()
    ) {
      return null;
    }

    invitation.status = "accepted";
    let membership = this.memberships.find(
      (candidate) =>
        candidate.hospitalId === invitation.hospitalId && candidate.userId === input.userId,
    );

    if (!membership) {
      membership = {
        id: testUuid(this.memberships.length + 200),
        hospitalId: invitation.hospitalId,
        hospitalName: "Hospital",
        hospitalStatus: "active",
        userId: input.userId,
        status: "active",
        title: null,
        roles: [],
        createdAt: input.consumedAt,
        updatedAt: input.consumedAt,
      };
      this.memberships.push(membership);
    } else {
      membership.status = "active";
      membership.updatedAt = input.consumedAt;
    }

    if (!membership.roles.includes(invitation.roleCode)) {
      membership.roles.push(invitation.roleCode);
    }

    return {
      hospitalId: invitation.hospitalId,
      userId: input.userId,
      membershipId: membership.id,
      roleCode: invitation.roleCode,
    };
  }

  async getMembership(hospitalId: string, membershipId: string): Promise<MembershipView | null> {
    return (
      this.memberships.find(
        (membership) => membership.id === membershipId && membership.hospitalId === hospitalId,
      ) ?? null
    );
  }

  async listHospitalMemberships(hospitalId: string): Promise<MembershipView[]> {
    return this.memberships.filter((membership) => membership.hospitalId === hospitalId);
  }

  async setMembershipStatus(
    hospitalId: string,
    membershipId: string,
    status: "active" | "suspended" | "revoked",
  ): Promise<MembershipView> {
    const membership = await this.getMembership(hospitalId, membershipId);
    if (!membership) {
      throw new Error("Membership not found");
    }

    membership.status = status;
    if (status !== "active") {
      await this.revokeSessionsForHospital(membership.userId, hospitalId);
    }
    return membership;
  }

  async addMembershipRole(
    hospitalId: string,
    membershipId: string,
    roleCode: UserRoleCode,
    _assignedByUserId: string,
  ): Promise<void> {
    const membership = await this.getMembership(hospitalId, membershipId);
    if (membership && !membership.roles.includes(roleCode)) {
      membership.roles.push(roleCode);
    }
  }

  async removeMembershipRole(
    hospitalId: string,
    membershipId: string,
    roleCode: UserRoleCode,
  ): Promise<void> {
    const membership = await this.getMembership(hospitalId, membershipId);
    if (membership) {
      membership.roles = membership.roles.filter((role) => role !== roleCode);
    }
  }

  async countActiveOwners(hospitalId: string): Promise<number> {
    return this.memberships.filter(
      (membership) =>
        membership.hospitalId === hospitalId &&
        membership.status === "active" &&
        membership.roles.includes("hospital_owner"),
    ).length;
  }

  async queueEmail(record: NewEmailOutboxRecord): Promise<void> {
    this.emails.push(record);
  }
}

export class FakeInvitationEmail implements InvitationEmailPreparer {
  prepareHospitalInvitationEmail(recipient: string, token: string): NewEmailOutboxRecord {
    return {
      id: testUuid(Math.floor(Math.random() * 1_000_000)),
      recipient,
      type: "hospital_invitation",
      encryptedPayload: token,
    };
  }
}
