import {
  CreateHospitalSchema,
  InviteMemberSchema,
  InvitationResultSchema,
  type AssignableHospitalRoleCode,
  type CreateHospitalInput,
  type InviteMemberInput,
  type UserRoleCode,
} from "@repo/contracts";
import { AppError } from "../../errors/app-error.js";
import { createOpaqueToken, hashOpaqueToken } from "../auth/token.service.js";
import { AccessService } from "./access.service.js";
import type {
  AccessRepository,
  AuthenticatedPrincipal,
  HospitalRepository,
  HospitalView,
  InvitationEmailPreparer,
  InvitationResult,
  MembershipView,
  RequestMetadata,
} from "./access.types.js";

const invitationTtlMs = 7 * 24 * 60 * 60 * 1000;

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" && error !== null && "code" in error && error.code === "ER_DUP_ENTRY"
  );
}

export class HospitalAdministrationService {
  constructor(
    private readonly repository: AccessRepository & HospitalRepository,
    private readonly access: AccessService,
    private readonly email: InvitationEmailPreparer,
  ) {}

  async listHospitals(
    principal: AuthenticatedPrincipal,
    metadata: RequestMetadata,
  ): Promise<HospitalView[]> {
    await this.access.requirePlatformPermission({
      principal,
      permission: "platform.hospitals.manage",
      ...metadata,
    });

    return this.repository.listHospitals();
  }

  async createHospital(
    principal: AuthenticatedPrincipal,
    input: CreateHospitalInput,
    metadata: RequestMetadata,
  ): Promise<HospitalView> {
    await this.access.requirePlatformPermission({
      principal,
      permission: "platform.hospitals.manage",
      ...metadata,
    });

    const hospital = CreateHospitalSchema.parse(input);
    const token = createOpaqueToken();
    const emailRecord = this.email.prepareHospitalInvitationEmail(hospital.ownerEmail, token);

    try {
      const created = await this.repository.createHospitalWithOwnerInvitation(
        hospital,
        "suspended",
        {
          email: hospital.ownerEmail,
          roleCode: "hospital_owner",
          tokenHash: hashOpaqueToken(token),
          expiresAt: new Date(Date.now() + invitationTtlMs),
          invitedByUserId: principal.userId,
        },
        emailRecord,
      );

      await this.auditSuccess(principal, metadata, "hospital.created", created.id);
      return created;
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new AppError(409, "HOSPITAL_CONFLICT", "A hospital with that slug already exists");
      }
      throw error;
    }
  }

  async setHospitalStatus(
    principal: AuthenticatedPrincipal,
    hospitalId: string,
    status: "active" | "suspended" | "closed",
    metadata: RequestMetadata,
  ): Promise<void> {
    await this.access.requirePlatformPermission({
      principal,
      permission: "platform.hospitals.manage",
      hospitalId,
      ...metadata,
    });

    if (status === "active") {
      await this.repository.setHospitalStatus(hospitalId, status);
    } else {
      await this.repository.setHospitalStatusWithSessionRevocation(hospitalId, status);
    }
    await this.auditSuccess(principal, metadata, "hospital.status_changed", hospitalId, { status });
  }

  async inviteMember(
    principal: AuthenticatedPrincipal,
    hospitalId: string,
    input: InviteMemberInput,
    metadata: RequestMetadata,
  ): Promise<void> {
    await this.access.requireHospitalPermission({
      principal,
      permission: "hospital.members.manage",
      hospitalId,
      ...metadata,
    });

    const invitation = InviteMemberSchema.parse(input);
    if (invitation.roleCode === "hospital_owner") {
      await this.assertActorIsOwner(principal, hospitalId, metadata);
    }

    const token = createOpaqueToken();
    const emailRecord = this.email.prepareHospitalInvitationEmail(invitation.email, token);

    await this.repository.createInvitationWithEmail(
      {
        hospitalId,
        email: invitation.email,
        roleCode: invitation.roleCode,
        tokenHash: hashOpaqueToken(token),
        expiresAt: new Date(Date.now() + invitationTtlMs),
        invitedByUserId: principal.userId,
      },
      emailRecord,
    );
    await this.auditSuccess(principal, metadata, "hospital.invitation_created", hospitalId, {
      roleCode: invitation.roleCode,
      email: invitation.email,
    });
  }

  async acceptInvitation(
    principal: AuthenticatedPrincipal,
    token: string,
    metadata: RequestMetadata,
  ) {
    const user = await this.repository.getUser(principal.userId);
    if (!user || user.status !== "active") {
      throw new AppError(401, "UNAUTHENTICATED", "Sign in to continue");
    }

    const result = await this.repository.consumeInvitation({
      tokenHash: hashOpaqueToken(token),
      userId: principal.userId,
      email: user.email,
      consumedAt: new Date(),
    });

    if (!result) {
      await this.deny(
        principal,
        metadata,
        "hospital.invitation_accepted",
        null,
        "Invitation is invalid, expired, or bound to another email",
      );
      throw new AppError(500, "INTERNAL_ERROR", "Invitation acceptance failed");
    }

    const accepted: InvitationResult = result;
    if (accepted.roleCode === "hospital_owner") {
      await this.repository.setHospitalStatus(accepted.hospitalId, "active");
    }

    await this.auditSuccess(
      principal,
      metadata,
      "hospital.invitation_accepted",
      accepted.hospitalId,
      { roleCode: accepted.roleCode },
    );

    return InvitationResultSchema.parse(accepted);
  }

  async listMemberships(
    principal: AuthenticatedPrincipal,
    hospitalId: string,
    metadata: RequestMetadata,
  ): Promise<MembershipView[]> {
    await this.access.requireHospitalPermission({
      principal,
      permission: "hospital.members.manage",
      hospitalId,
      ...metadata,
    });

    return this.repository.listHospitalMemberships(hospitalId);
  }

  async setMembershipStatus(
    principal: AuthenticatedPrincipal,
    hospitalId: string,
    membershipId: string,
    status: "active" | "suspended" | "revoked",
    metadata: RequestMetadata,
  ): Promise<MembershipView> {
    await this.access.requireHospitalPermission({
      principal,
      permission: "hospital.members.manage",
      hospitalId,
      ...metadata,
    });

    const membership = await this.repository.getMembership(hospitalId, membershipId);
    if (!membership) {
      throw new AppError(404, "MEMBERSHIP_NOT_FOUND", "Membership not found");
    }

    if (membership.userId === principal.userId && status !== "active") {
      await this.deny(
        principal,
        metadata,
        "hospital.membership_status_changed",
        hospitalId,
        "A member cannot suspend or revoke their own membership",
      );
    }

    if (membership.roles.includes("hospital_owner") && status !== "active") {
      await this.assertActorIsOwner(principal, hospitalId, metadata);
      await this.assertNotLastOwner(hospitalId, membershipId, metadata, principal);
    }

    const updated = await this.repository.setMembershipStatus(hospitalId, membershipId, status);
    await this.auditSuccess(principal, metadata, "hospital.membership_status_changed", hospitalId, {
      membershipId,
      status,
      targetUserId: membership.userId,
    });

    return updated;
  }

  async addMembershipRole(
    principal: AuthenticatedPrincipal,
    hospitalId: string,
    membershipId: string,
    roleCode: AssignableHospitalRoleCode,
    metadata: RequestMetadata,
  ): Promise<void> {
    await this.access.requireHospitalPermission({
      principal,
      permission: "hospital.members.manage",
      hospitalId,
      ...metadata,
    });

    const membership = await this.getMembershipOrThrow(hospitalId, membershipId);
    if (roleCode === "hospital_owner") {
      await this.assertActorIsOwner(principal, hospitalId, metadata);
    }

    await this.repository.addMembershipRole(hospitalId, membershipId, roleCode, principal.userId);
    await this.auditSuccess(principal, metadata, "hospital.membership_role_added", hospitalId, {
      membershipId,
      roleCode,
      targetUserId: membership.userId,
    });
  }

  async removeMembershipRole(
    principal: AuthenticatedPrincipal,
    hospitalId: string,
    membershipId: string,
    roleCode: AssignableHospitalRoleCode,
    metadata: RequestMetadata,
  ): Promise<void> {
    await this.access.requireHospitalPermission({
      principal,
      permission: "hospital.members.manage",
      hospitalId,
      ...metadata,
    });

    const membership = await this.getMembershipOrThrow(hospitalId, membershipId);
    if (roleCode === "hospital_owner") {
      await this.assertActorIsOwner(principal, hospitalId, metadata);
      await this.assertNotLastOwner(hospitalId, membershipId, metadata, principal);
    }

    await this.repository.removeMembershipRole(hospitalId, membershipId, roleCode);
    await this.auditSuccess(principal, metadata, "hospital.membership_role_removed", hospitalId, {
      membershipId,
      roleCode,
      targetUserId: membership.userId,
    });
  }

  private async getMembershipOrThrow(
    hospitalId: string,
    membershipId: string,
  ): Promise<MembershipView> {
    const membership = await this.repository.getMembership(hospitalId, membershipId);
    if (!membership) {
      throw new AppError(404, "MEMBERSHIP_NOT_FOUND", "Membership not found");
    }

    return membership;
  }

  private async assertActorIsOwner(
    principal: AuthenticatedPrincipal,
    hospitalId: string,
    metadata: RequestMetadata,
  ): Promise<void> {
    const globalRoles = await this.repository.getGlobalRoles(principal.userId);
    if (globalRoles.includes("admin")) {
      return;
    }

    const memberships = await this.repository.getMemberships(principal.userId);
    const membership = memberships.find(
      (candidate) =>
        candidate.hospitalId === hospitalId &&
        candidate.status === "active" &&
        candidate.hospitalStatus === "active",
    );

    if (!membership?.roles.includes("hospital_owner")) {
      await this.deny(
        principal,
        metadata,
        "authz.denied",
        hospitalId,
        "Hospital owner authority is required",
      );
    }
  }

  private async assertNotLastOwner(
    hospitalId: string,
    membershipId: string,
    metadata: RequestMetadata,
    principal: AuthenticatedPrincipal,
  ): Promise<void> {
    const membership = await this.repository.getMembership(hospitalId, membershipId);
    if (!membership?.roles.includes("hospital_owner")) {
      return;
    }

    const owners = await this.repository.countActiveOwners(hospitalId);
    if (owners <= 1) {
      await this.deny(
        principal,
        metadata,
        "authz.denied",
        hospitalId,
        "The final hospital owner cannot be removed",
      );
    }
  }

  private async auditSuccess(
    principal: AuthenticatedPrincipal,
    metadata: RequestMetadata,
    action: string,
    hospitalId: string | null,
    details?: Record<string, unknown>,
  ): Promise<void> {
    await this.repository.audit({
      ...metadata,
      actorUserId: principal.userId,
      targetUserId: null,
      action,
      outcome: "success",
      hospitalId,
      resourceType: "hospital",
      resourceId: hospitalId,
      details: details ? JSON.stringify(details) : null,
    });
  }

  private async deny(
    principal: AuthenticatedPrincipal,
    metadata: RequestMetadata,
    action: string,
    hospitalId: string | null,
    reason: string,
  ): Promise<never> {
    await this.repository.audit({
      ...metadata,
      actorUserId: principal.userId,
      targetUserId: null,
      action,
      outcome: "denied",
      hospitalId,
      resourceType: "hospital",
      details: JSON.stringify({ reason }),
    });
    throw new AppError(403, "FORBIDDEN", reason);
  }
}
