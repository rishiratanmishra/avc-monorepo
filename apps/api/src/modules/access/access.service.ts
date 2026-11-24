import {
  AccessContextSchema,
  ROLE_PERMISSIONS,
  type AccessContext,
  type AccessScope,
  type ApplicationDestination,
  type PermissionCode,
  type SelectWorkspaceInput,
  type UserRoleCode,
  type Workspace,
} from "@repo/contracts";
import { AppError } from "../../errors/app-error.js";
import { hashOpaqueToken } from "../auth/token.service.js";
import type {
  AccessRepository,
  AuthenticatedPrincipal,
  AuthorizationRequest,
  ClientRelationshipView,
  MembershipView,
  RequestMetadata,
} from "./access.types.js";

function permissionsForRoles(roles: readonly UserRoleCode[]): PermissionCode[] {
  const permissions = new Set<PermissionCode>();

  for (const role of roles) {
    for (const permission of ROLE_PERMISSIONS[role]) {
      permissions.add(permission);
    }
  }

  return [...permissions].sort();
}

function hasPermission(roles: readonly UserRoleCode[], permission: PermissionCode): boolean {
  return permissionsForRoles(roles).includes(permission);
}

function isActiveMembership(membership: MembershipView): boolean {
  return membership.status === "active" && membership.hospitalStatus === "active";
}

function isActiveClientRelationship(relationship: ClientRelationshipView): boolean {
  return relationship.status === "active" && relationship.hospitalStatus === "active";
}

export class AccessService {
  constructor(private readonly repository: AccessRepository) {}

  async authenticate(
    token: string | undefined,
    metadata: RequestMetadata,
  ): Promise<AuthenticatedPrincipal> {
    if (!token) {
      throw new AppError(401, "UNAUTHENTICATED", "Sign in to continue");
    }

    const session = await this.repository.findSessionByTokenHash(hashOpaqueToken(token));
    const user = session ? await this.repository.getUser(session.userId) : null;

    if (
      !session ||
      !user ||
      session.expiresAt.getTime() <= Date.now() ||
      user.status !== "active"
    ) {
      await this.auditDenial(
        session?.userId ?? null,
        "auth.session_rejected",
        metadata,
        "Session is invalid, expired, or the account is not active",
      );
      throw new AppError(401, "UNAUTHENTICATED", "Sign in to continue");
    }

    await this.repository.touchSession(session.id);

    return {
      userId: user.id,
      sessionId: session.id,
      activeHospitalId: session.activeHospitalId,
      activeScope: session.activeScope,
    };
  }

  async loadContext(principal: AuthenticatedPrincipal): Promise<AccessContext> {
    const [user, globalRoles, allMemberships, allClientRelationships] = await Promise.all([
      this.repository.getUser(principal.userId),
      this.repository.getGlobalRoles(principal.userId),
      this.repository.getMemberships(principal.userId),
      this.repository.getClientRelationships(principal.userId),
    ]);

    if (!user) {
      throw new AppError(401, "UNAUTHENTICATED", "Sign in to continue");
    }

    const memberships = allMemberships.filter(isActiveMembership);
    const clientRelationships = allClientRelationships.filter(isActiveClientRelationship);
    const activeMembership = memberships.find(
      (membership) => membership.hospitalId === principal.activeHospitalId,
    );
    const activeClient = clientRelationships.find(
      (relationship) => relationship.hospitalId === principal.activeHospitalId,
    );
    const activeWorkspace = this.buildWorkspace(
      principal,
      globalRoles,
      activeMembership,
      activeClient,
    );
    const destinations = this.buildDestinations(globalRoles, memberships, clientRelationships);
    const activeDestination =
      destinations.find(
        (destination) =>
          destination.scope === principal.activeScope &&
          destination.hospitalId === principal.activeHospitalId,
      ) ?? null;

    return AccessContextSchema.parse({
      userId: user.id,
      email: user.email,
      status: user.status,
      globalRoles,
      memberships: memberships.map((membership) => ({
        id: membership.id,
        hospitalId: membership.hospitalId,
        userId: membership.userId,
        status: membership.status,
        title: membership.title,
        roles: membership.roles,
        permissions: permissionsForRoles(membership.roles),
        hospitalName: membership.hospitalName,
        hospitalStatus: membership.hospitalStatus,
        createdAt: membership.createdAt.toISOString(),
        updatedAt: membership.updatedAt.toISOString(),
      })),
      clientRelationships: clientRelationships.map((relationship) => ({
        id: relationship.id,
        hospitalId: relationship.hospitalId,
        userId: relationship.userId,
        status: relationship.status,
        hospitalName: relationship.hospitalName,
        createdAt: relationship.createdAt.toISOString(),
      })),
      activeWorkspace,
      activeDestination,
      destinations,
    });
  }

  async selectWorkspace(
    principal: AuthenticatedPrincipal,
    input: SelectWorkspaceInput,
    metadata: RequestMetadata,
  ): Promise<AccessContext> {
    const [globalRoles, memberships, clientRelationships] = await Promise.all([
      this.repository.getGlobalRoles(principal.userId),
      this.repository.getMemberships(principal.userId),
      this.repository.getClientRelationships(principal.userId),
    ]);

    let hospitalId: string | null = null;
    let scope: AccessScope = input.scope;

    if (input.scope === "platform") {
      if (!globalRoles.includes("admin") || input.hospitalId) {
        await this.denyWorkspace(principal, metadata, input.hospitalId ?? null);
      }
    } else if (input.scope === "hospital") {
      const requestedHospitalId = input.hospitalId;
      if (!requestedHospitalId) {
        await this.denyWorkspace(principal, metadata, null);
      }

      const membership = memberships.find(
        (candidate) =>
          candidate.hospitalId === requestedHospitalId && isActiveMembership(candidate),
      );
      if (!membership) {
        await this.denyWorkspace(principal, metadata, requestedHospitalId ?? null);
      }
      hospitalId = requestedHospitalId!;
    } else {
      if (!globalRoles.includes("pet_owner")) {
        await this.denyWorkspace(principal, metadata, null);
      }

      const requestedHospitalId = input.hospitalId;
      if (requestedHospitalId) {
        const relationship = clientRelationships.find(
          (candidate) =>
            candidate.hospitalId === requestedHospitalId && isActiveClientRelationship(candidate),
        );
        if (!relationship) {
          await this.denyWorkspace(principal, metadata, requestedHospitalId);
        }
        hospitalId = requestedHospitalId;
      }
    }

    await this.repository.setActiveHospital(principal.sessionId, hospitalId, scope);
    await this.repository.audit({
      ...metadata,
      actorUserId: principal.userId,
      targetUserId: principal.userId,
      action: "workspace.selected",
      outcome: "success",
      hospitalId,
      resourceType: scope,
      resourceId: hospitalId,
    });

    return this.loadContext({
      ...principal,
      activeHospitalId: hospitalId,
      activeScope: scope,
    });
  }

  async clearWorkspace(
    principal: AuthenticatedPrincipal,
    metadata: RequestMetadata,
  ): Promise<AccessContext> {
    await this.repository.setActiveHospital(principal.sessionId, null, "client");
    await this.repository.audit({
      ...metadata,
      actorUserId: principal.userId,
      targetUserId: principal.userId,
      action: "workspace.cleared",
      outcome: "success",
    });

    return this.loadContext({
      ...principal,
      activeHospitalId: null,
      activeScope: "client",
    });
  }

  async requirePlatformPermission(request: AuthorizationRequest): Promise<void> {
    if (request.principal.activeScope !== "platform") {
      await this.denyAuthorization(request, "Inactive platform scope");
    }

    const roles = await this.repository.getGlobalRoles(request.principal.userId);
    if (!hasPermission(roles, request.permission)) {
      await this.denyAuthorization(request, "Missing platform permission");
    }
  }

  async requireHospitalPermission(request: AuthorizationRequest): Promise<void> {
    const requestedHospitalId = request.hospitalId ?? null;

    if (request.principal.activeScope !== "hospital") {
      await this.denyAuthorization(request, "Inactive hospital scope");
    }

    if (requestedHospitalId !== request.principal.activeHospitalId) {
      await this.denyAuthorization(request, "Hospital does not match the active workspace");
    }

    const memberships = await this.repository.getMemberships(request.principal.userId);
    const membership = memberships.find(
      (candidate) =>
        candidate.hospitalId === request.principal.activeHospitalId &&
        isActiveMembership(candidate),
    );

    if (!membership || !hasPermission(membership.roles, request.permission)) {
      await this.denyAuthorization(request, "Missing hospital permission");
    }
  }

  async requireClientPermission(request: AuthorizationRequest): Promise<void> {
    if (request.principal.activeScope !== "client") {
      await this.denyAuthorization(request, "Inactive client scope");
    }

    const roles = await this.repository.getGlobalRoles(request.principal.userId);
    if (!hasPermission(roles, request.permission)) {
      await this.denyAuthorization(request, "Missing client permission");
    }
  }

  async requireClientResource(request: AuthorizationRequest): Promise<void> {
    await this.requireClientPermission(request);

    if (!request.hospitalId) {
      await this.denyAuthorization(request, "Client resource requires a hospital");
    }

    if (request.hospitalId !== request.principal.activeHospitalId) {
      await this.denyAuthorization(request, "Resource does not match the active client workspace");
    }

    const relationships = await this.repository.getClientRelationships(request.principal.userId);
    const relationship = relationships.find(
      (candidate) =>
        candidate.hospitalId === request.hospitalId && isActiveClientRelationship(candidate),
    );

    if (!relationship) {
      await this.denyAuthorization(request, "No active client relationship");
    }
  }

  async getClientRelationship(
    principal: AuthenticatedPrincipal,
    hospitalId: string,
    metadata: RequestMetadata,
  ): Promise<ClientRelationshipView> {
    const request: AuthorizationRequest = {
      principal,
      permission: "client.records.read",
      hospitalId,
      ...metadata,
    };
    await this.requireClientResource(request);

    const relationships = await this.repository.getClientRelationships(principal.userId);
    const relationship = relationships.find((candidate) => candidate.hospitalId === hospitalId);
    if (!relationship) {
      throw new AppError(404, "RELATIONSHIP_NOT_FOUND", "Relationship not found");
    }

    return relationship;
  }

  private buildWorkspace(
    principal: AuthenticatedPrincipal,
    globalRoles: UserRoleCode[],
    membership: MembershipView | undefined,
    client: ClientRelationshipView | undefined,
  ): Workspace {
    if (principal.activeScope === "platform") {
      return {
        scope: "platform",
        hospitalId: null,
        hospitalName: null,
        permissions: globalRoles.includes("admin") ? permissionsForRoles(globalRoles) : [],
      };
    }

    if (principal.activeScope === "hospital" && membership) {
      return {
        scope: "hospital",
        hospitalId: membership.hospitalId,
        hospitalName: membership.hospitalName,
        permissions: permissionsForRoles(membership.roles),
      };
    }

    if (principal.activeScope === "client" && globalRoles.includes("pet_owner")) {
      return {
        scope: "client",
        hospitalId: client?.hospitalId ?? null,
        hospitalName: client?.hospitalName ?? null,
        permissions: permissionsForRoles(["pet_owner"]),
      };
    }

    return {
      scope: "client",
      hospitalId: null,
      hospitalName: null,
      permissions: [],
    };
  }

  private buildDestinations(
    globalRoles: UserRoleCode[],
    memberships: MembershipView[],
    clientRelationships: ClientRelationshipView[],
  ): ApplicationDestination[] {
    const destinations: ApplicationDestination[] = [];

    if (globalRoles.includes("admin")) {
      destinations.push({
        id: "platform",
        label: "Platform administration",
        path: "/manage/platform",
        scope: "platform",
        hospitalId: null,
      });
    }

    for (const membership of memberships) {
      const grantsHospitalPermission = membership.roles.some((role) =>
        ROLE_PERMISSIONS[role].some((permission) => permission.startsWith("hospital.")),
      );
      if (!grantsHospitalPermission) {
        continue;
      }

      destinations.push({
        id: `practice:${membership.hospitalId}`,
        label: `Hospital practice — ${membership.hospitalName}`,
        path: "/manage/practice",
        scope: "hospital",
        hospitalId: membership.hospitalId,
      });
    }

    if (globalRoles.includes("pet_owner")) {
      if (clientRelationships.length === 0) {
        destinations.push({
          id: "client",
          label: "Pet parent portal",
          path: "/client",
          scope: "client",
          hospitalId: null,
        });
      } else {
        for (const relationship of clientRelationships) {
          destinations.push({
            id: `client:${relationship.hospitalId}`,
            label: `Pet parent portal — ${relationship.hospitalName}`,
            path: "/client",
            scope: "client",
            hospitalId: relationship.hospitalId,
          });
        }
      }
    }

    return destinations;
  }

  private async denyWorkspace(
    principal: AuthenticatedPrincipal,
    metadata: RequestMetadata,
    hospitalId: string | null,
  ): Promise<never> {
    await this.repository.audit({
      ...metadata,
      actorUserId: principal.userId,
      action: "workspace.selected",
      outcome: "denied",
      hospitalId,
      resourceType: "workspace",
      details: JSON.stringify({ reason: "Workspace is not authorized" }),
    });
    throw new AppError(
      403,
      "WORKSPACE_NOT_AUTHORIZED",
      "That workspace is not available to this account",
    );
  }

  private async denyAuthorization(
    request: AuthorizationRequest,
    reason = "Authorization denied",
  ): Promise<never> {
    await this.repository.audit({
      requestId: request.requestId,
      ipAddress: request.ipAddress,
      userAgent: request.userAgent,
      actorUserId: request.principal.userId,
      targetUserId: null,
      action: "authz.denied",
      outcome: "denied",
      hospitalId: request.hospitalId ?? null,
      resourceType: request.permission.split(".")[0],
      details: JSON.stringify({
        reason,
        permission: request.permission,
      }),
    });
    throw new AppError(
      403,
      "FORBIDDEN",
      "The required permission is missing for the active workspace",
    );
  }

  private async auditDenial(
    actorUserId: string | null,
    action: string,
    metadata: RequestMetadata,
    details: string,
  ): Promise<void> {
    await this.repository.audit({
      ...metadata,
      actorUserId,
      action,
      outcome: "denied",
      details: JSON.stringify({ reason: details }),
    });
  }
}
