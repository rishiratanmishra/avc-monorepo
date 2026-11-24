import type {
  AccessScope,
  CreateHospitalInput,
  HospitalStatus,
  UserRoleCode,
} from "@repo/contracts";
import type { NewEmailOutboxRecord } from "@repo/database";
import {
  auditLogs,
  authSessions,
  emailOutbox,
  getDatabase,
  hospitalClients,
  hospitalInvitations,
  hospitalMembershipRoles,
  hospitalMemberships,
  hospitals,
  userRoles,
  users,
} from "@repo/database";
import { and, count, eq, gt, isNull } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type {
  AccessRepository,
  AuditInput,
  ClientRelationshipView,
  CreateInvitationInput,
  HospitalRepository,
  HospitalView,
  IdentityUser,
  InvitationResult,
  MembershipView,
  PendingInvitationInput,
  SessionIdentity,
} from "./access.types.js";

type Database = ReturnType<typeof getDatabase>;
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

export class DrizzleAccessRepository implements AccessRepository, HospitalRepository {
  constructor(private readonly databaseProvider: () => Database = getDatabase) {}

  private get database(): Database {
    return this.databaseProvider();
  }

  async findSessionByTokenHash(tokenHash: string): Promise<SessionIdentity | null> {
    const [session] = await this.database
      .select({
        id: authSessions.id,
        userId: authSessions.userId,
        expiresAt: authSessions.expiresAt,
        activeHospitalId: authSessions.activeHospitalId,
        activeScope: authSessions.activeScope,
      })
      .from(authSessions)
      .where(eq(authSessions.tokenHash, tokenHash))
      .limit(1);

    return session ?? null;
  }

  async touchSession(sessionId: string): Promise<void> {
    await this.database
      .update(authSessions)
      .set({ lastSeenAt: new Date() })
      .where(eq(authSessions.id, sessionId));
  }

  async getUser(userId: string): Promise<IdentityUser | null> {
    const [user] = await this.database
      .select({
        id: users.id,
        email: users.email,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user ?? null;
  }

  async getUserByEmail(email: string): Promise<IdentityUser | null> {
    const [user] = await this.database
      .select({
        id: users.id,
        email: users.email,
        status: users.status,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user ?? null;
  }

  async getGlobalRoles(userId: string): Promise<UserRoleCode[]> {
    const rows = await this.database
      .select({ roleCode: userRoles.roleCode })
      .from(userRoles)
      .where(eq(userRoles.userId, userId));

    return rows.map((row) => row.roleCode);
  }

  async getMemberships(userId: string): Promise<MembershipView[]> {
    const rows = await this.database
      .select({
        id: hospitalMemberships.id,
        hospitalId: hospitalMemberships.hospitalId,
        hospitalName: hospitals.name,
        hospitalStatus: hospitals.status,
        userId: hospitalMemberships.userId,
        status: hospitalMemberships.status,
        title: hospitalMemberships.title,
        createdAt: hospitalMemberships.createdAt,
        updatedAt: hospitalMemberships.updatedAt,
      })
      .from(hospitalMemberships)
      .innerJoin(hospitals, eq(hospitalMemberships.hospitalId, hospitals.id))
      .where(eq(hospitalMemberships.userId, userId));

    return Promise.all(
      rows.map(async (row) => ({
        ...row,
        roles: await this.getMembershipRoles(this.database, row.id),
      })),
    );
  }

  async getClientRelationships(userId: string): Promise<ClientRelationshipView[]> {
    return this.database
      .select({
        id: hospitalClients.id,
        hospitalId: hospitalClients.hospitalId,
        hospitalName: hospitals.name,
        hospitalStatus: hospitals.status,
        userId: hospitalClients.userId,
        status: hospitalClients.status,
        createdAt: hospitalClients.createdAt,
      })
      .from(hospitalClients)
      .innerJoin(hospitals, eq(hospitalClients.hospitalId, hospitals.id))
      .where(eq(hospitalClients.userId, userId));
  }

  async setActiveHospital(
    sessionId: string,
    hospitalId: string | null,
    scope: AccessScope | null,
  ): Promise<void> {
    await this.database
      .update(authSessions)
      .set({ activeHospitalId: hospitalId, activeScope: scope })
      .where(eq(authSessions.id, sessionId));
  }

  async revokeSessionsForHospital(userId: string, hospitalId: string): Promise<void> {
    await this.database
      .delete(authSessions)
      .where(and(eq(authSessions.userId, userId), eq(authSessions.activeHospitalId, hospitalId)));
  }

  async revokeAllSessions(userId: string): Promise<void> {
    await this.database.delete(authSessions).where(eq(authSessions.userId, userId));
  }

  async revokeAllSessionsForHospital(hospitalId: string): Promise<void> {
    await this.database.delete(authSessions).where(eq(authSessions.activeHospitalId, hospitalId));
  }

  async audit(input: AuditInput): Promise<void> {
    await this.database.insert(auditLogs).values({
      id: randomUUID(),
      actorUserId: input.actorUserId,
      targetUserId: input.targetUserId ?? null,
      action: input.action,
      outcome: input.outcome,
      hospitalId: input.hospitalId ?? null,
      resourceType: input.resourceType ?? null,
      resourceId: input.resourceId ?? null,
      details: input.details ?? null,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      requestId: input.requestId,
    });
  }

  async listHospitals(): Promise<HospitalView[]> {
    return this.database
      .select({
        id: hospitals.id,
        name: hospitals.name,
        slug: hospitals.slug,
        status: hospitals.status,
      })
      .from(hospitals)
      .where(isNull(hospitals.deletedAt));
  }

  async createHospital(input: CreateHospitalInput, status: HospitalStatus): Promise<HospitalView> {
    const id = randomUUID();
    await this.database.insert(hospitals).values({
      id,
      name: input.name,
      slug: input.slug,
      status,
      addressLine1: input.addressLine1 ?? null,
      city: input.city ?? null,
      state: input.state ?? null,
      postalCode: input.postalCode ?? null,
      countryCode: input.countryCode ?? null,
      phone: input.phone ?? null,
    });

    return {
      id,
      name: input.name,
      slug: input.slug,
      status,
    };
  }

  async createHospitalWithOwnerInvitation(
    input: CreateHospitalInput,
    status: HospitalStatus,
    invitation: PendingInvitationInput,
    emailRecord: NewEmailOutboxRecord,
  ): Promise<HospitalView> {
    const hospitalId = randomUUID();

    await this.database.transaction(async (transaction) => {
      await transaction.insert(hospitals).values({
        id: hospitalId,
        name: input.name,
        slug: input.slug,
        status,
        addressLine1: input.addressLine1 ?? null,
        city: input.city ?? null,
        state: input.state ?? null,
        postalCode: input.postalCode ?? null,
        countryCode: input.countryCode ?? null,
        phone: input.phone ?? null,
      });
      await transaction.insert(hospitalInvitations).values({
        ...invitation,
        id: randomUUID(),
        hospitalId,
      });
      await transaction.insert(emailOutbox).values(emailRecord);
    });

    return {
      id: hospitalId,
      name: input.name,
      slug: input.slug,
      status,
    };
  }

  async setHospitalStatus(hospitalId: string, status: HospitalStatus): Promise<void> {
    await this.database.update(hospitals).set({ status }).where(eq(hospitals.id, hospitalId));
  }

  async setHospitalStatusWithSessionRevocation(
    hospitalId: string,
    status: HospitalStatus,
  ): Promise<void> {
    await this.database.transaction(async (transaction) => {
      await transaction.update(hospitals).set({ status }).where(eq(hospitals.id, hospitalId));
      await transaction.delete(authSessions).where(eq(authSessions.activeHospitalId, hospitalId));
    });
  }

  async createInvitation(input: CreateInvitationInput): Promise<void> {
    await this.database.insert(hospitalInvitations).values({
      id: randomUUID(),
      ...input,
    });
  }

  async createInvitationWithEmail(
    input: CreateInvitationInput,
    emailRecord: NewEmailOutboxRecord,
  ): Promise<void> {
    await this.database.transaction(async (transaction) => {
      await transaction.insert(hospitalInvitations).values({
        id: randomUUID(),
        ...input,
      });
      await transaction.insert(emailOutbox).values(emailRecord);
    });
  }

  async queueEmail(record: NewEmailOutboxRecord): Promise<void> {
    await this.database.insert(emailOutbox).values(record);
  }

  async consumeInvitation(input: {
    tokenHash: string;
    userId: string;
    email: string;
    consumedAt: Date;
  }): Promise<InvitationResult | null> {
    return this.database.transaction(async (transaction) => {
      const [invitation] = await transaction
        .select()
        .from(hospitalInvitations)
        .where(
          and(
            eq(hospitalInvitations.tokenHash, input.tokenHash),
            eq(hospitalInvitations.status, "pending"),
            isNull(hospitalInvitations.consumedAt),
            gt(hospitalInvitations.expiresAt, input.consumedAt),
          ),
        )
        .for("update")
        .limit(1);

      if (!invitation || invitation.email !== input.email) {
        return null;
      }

      await transaction
        .update(hospitalInvitations)
        .set({ status: "accepted", consumedAt: input.consumedAt })
        .where(eq(hospitalInvitations.id, invitation.id));

      const [existingMembership] = await transaction
        .select({ id: hospitalMemberships.id })
        .from(hospitalMemberships)
        .where(
          and(
            eq(hospitalMemberships.hospitalId, invitation.hospitalId),
            eq(hospitalMemberships.userId, input.userId),
          ),
        )
        .for("update")
        .limit(1);

      let membershipId = existingMembership?.id;

      if (!membershipId) {
        membershipId = randomUUID();
        await transaction.insert(hospitalMemberships).values({
          id: membershipId,
          hospitalId: invitation.hospitalId,
          userId: input.userId,
          status: "active",
          invitedByUserId: invitation.invitedByUserId,
          activatedAt: input.consumedAt,
        });
      } else {
        await transaction
          .update(hospitalMemberships)
          .set({
            status: "active",
            activatedAt: input.consumedAt,
            revokedAt: null,
            updatedAt: input.consumedAt,
          })
          .where(eq(hospitalMemberships.id, membershipId));
      }

      await transaction
        .delete(hospitalMembershipRoles)
        .where(
          and(
            eq(hospitalMembershipRoles.membershipId, membershipId),
            eq(hospitalMembershipRoles.roleCode, invitation.roleCode),
          ),
        );
      await transaction.insert(hospitalMembershipRoles).values({
        membershipId,
        roleCode: invitation.roleCode,
        assignedByUserId: invitation.invitedByUserId,
      });

      return {
        hospitalId: invitation.hospitalId,
        userId: input.userId,
        membershipId,
        roleCode: invitation.roleCode,
      };
    });
  }

  async getMembership(hospitalId: string, membershipId: string): Promise<MembershipView | null> {
    const [row] = await this.database
      .select({
        id: hospitalMemberships.id,
        hospitalId: hospitalMemberships.hospitalId,
        hospitalName: hospitals.name,
        hospitalStatus: hospitals.status,
        userId: hospitalMemberships.userId,
        status: hospitalMemberships.status,
        title: hospitalMemberships.title,
        createdAt: hospitalMemberships.createdAt,
        updatedAt: hospitalMemberships.updatedAt,
      })
      .from(hospitalMemberships)
      .innerJoin(hospitals, eq(hospitalMemberships.hospitalId, hospitals.id))
      .where(
        and(
          eq(hospitalMemberships.id, membershipId),
          eq(hospitalMemberships.hospitalId, hospitalId),
        ),
      )
      .limit(1);

    if (!row) {
      return null;
    }

    return {
      ...row,
      roles: await this.getMembershipRoles(this.database, row.id),
    };
  }

  async listHospitalMemberships(hospitalId: string): Promise<MembershipView[]> {
    const rows = await this.database
      .select({
        id: hospitalMemberships.id,
        hospitalId: hospitalMemberships.hospitalId,
        hospitalName: hospitals.name,
        hospitalStatus: hospitals.status,
        userId: hospitalMemberships.userId,
        status: hospitalMemberships.status,
        title: hospitalMemberships.title,
        createdAt: hospitalMemberships.createdAt,
        updatedAt: hospitalMemberships.updatedAt,
      })
      .from(hospitalMemberships)
      .innerJoin(hospitals, eq(hospitalMemberships.hospitalId, hospitals.id))
      .where(eq(hospitalMemberships.hospitalId, hospitalId));

    return Promise.all(
      rows.map(async (row) => ({
        ...row,
        roles: await this.getMembershipRoles(this.database, row.id),
      })),
    );
  }

  async setMembershipStatus(
    hospitalId: string,
    membershipId: string,
    status: Extract<MembershipView["status"], "active" | "suspended" | "revoked">,
  ): Promise<MembershipView> {
    const now = new Date();
    await this.database.transaction(async (transaction) => {
      await transaction
        .update(hospitalMemberships)
        .set({
          status,
          activatedAt: status === "active" ? now : null,
          revokedAt: status === "revoked" ? now : null,
          updatedAt: now,
        })
        .where(
          and(
            eq(hospitalMemberships.id, membershipId),
            eq(hospitalMemberships.hospitalId, hospitalId),
          ),
        );

      if (status !== "active") {
        const [membership] = await transaction
          .select({ userId: hospitalMemberships.userId })
          .from(hospitalMemberships)
          .where(eq(hospitalMemberships.id, membershipId))
          .limit(1);

        if (membership) {
          await transaction
            .delete(authSessions)
            .where(
              and(
                eq(authSessions.userId, membership.userId),
                eq(authSessions.activeHospitalId, hospitalId),
              ),
            );
        }
      }
    });

    const membership = await this.getMembership(hospitalId, membershipId);
    if (!membership) {
      throw new Error("Membership disappeared after update");
    }

    return membership;
  }

  async addMembershipRole(
    hospitalId: string,
    membershipId: string,
    roleCode: UserRoleCode,
    assignedByUserId: string,
  ): Promise<void> {
    const membership = await this.getMembership(hospitalId, membershipId);
    if (!membership) {
      return;
    }

    await this.database.transaction(async (transaction) => {
      await transaction
        .delete(hospitalMembershipRoles)
        .where(
          and(
            eq(hospitalMembershipRoles.membershipId, membershipId),
            eq(hospitalMembershipRoles.roleCode, roleCode),
          ),
        );
      await transaction.insert(hospitalMembershipRoles).values({
        membershipId,
        roleCode,
        assignedByUserId,
      });
    });
  }

  async removeMembershipRole(
    hospitalId: string,
    membershipId: string,
    roleCode: UserRoleCode,
  ): Promise<void> {
    await this.database
      .delete(hospitalMembershipRoles)
      .where(
        and(
          eq(hospitalMembershipRoles.membershipId, membershipId),
          eq(hospitalMembershipRoles.roleCode, roleCode),
        ),
      );
  }

  async countActiveOwners(hospitalId: string): Promise<number> {
    const [result] = await this.database
      .select({ total: count() })
      .from(hospitalMembershipRoles)
      .innerJoin(
        hospitalMemberships,
        eq(hospitalMembershipRoles.membershipId, hospitalMemberships.id),
      )
      .where(
        and(
          eq(hospitalMemberships.hospitalId, hospitalId),
          eq(hospitalMemberships.status, "active"),
          eq(hospitalMembershipRoles.roleCode, "hospital_owner"),
        ),
      );

    return Number(result?.total ?? 0);
  }

  private async getMembershipRoles(
    database: Database | Transaction,
    membershipId: string,
  ): Promise<UserRoleCode[]> {
    const rows = await database
      .select({ roleCode: hospitalMembershipRoles.roleCode })
      .from(hospitalMembershipRoles)
      .where(eq(hospitalMembershipRoles.membershipId, membershipId));

    return rows.map((row) => row.roleCode);
  }
}
