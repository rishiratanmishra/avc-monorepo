import {
  ADMIN_CREATABLE_ROLE_CODES,
  AdminCreateUserSchema,
  AdminUserViewSchema,
  type AdminCreateUserInput,
  type AdminUserView,
  type UserRoleCode,
} from "@repo/contracts";
import {
  auditLogs,
  authTokens,
  emailOutbox,
  getDatabase,
  userProfiles,
  userRoles,
  users,
} from "@repo/database";
import { and, eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { AppError } from "../../errors/app-error.js";
import type { AuthenticatedPrincipal, RequestMetadata } from "../access/access.types.js";
import { AccessService } from "../access/access.service.js";
import { PasswordService } from "./password.service.js";
import { ResendEmailService } from "./resend-email.service.js";
import { createOpaqueToken, hashOpaqueToken } from "./token.service.js";

type Database = ReturnType<typeof getDatabase>;
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

const verificationTokenLifetimeMs = 24 * 60 * 60 * 1000;

function toIso(value: Date): string {
  return value.toISOString();
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" && error !== null && "code" in error && error.code === "ER_DUP_ENTRY"
  );
}

export class AdminUserService {
  constructor(
    private readonly database: Database,
    private readonly passwords: PasswordService,
    private readonly email: ResendEmailService,
    private readonly access: AccessService,
  ) {}

  async listUsers(
    principal: AuthenticatedPrincipal,
    metadata: RequestMetadata,
  ): Promise<AdminUserView[]> {
    await this.access.requirePlatformPermission({
      principal,
      permission: "platform.users.manage",
      ...metadata,
    });

    const userRows = await this.database
      .select({
        id: users.id,
        email: users.email,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(users.createdAt);

    if (userRows.length === 0) {
      return [];
    }

    const userIds = userRows.map((user) => user.id);
    const [profileRows, roleRows] = await Promise.all([
      this.database
        .select({
          userId: userProfiles.userId,
          firstName: userProfiles.firstName,
          lastName: userProfiles.lastName,
        })
        .from(userProfiles)
        .where(inArray(userProfiles.userId, userIds)),
      this.database
        .select({ userId: userRoles.userId, roleCode: userRoles.roleCode })
        .from(userRoles)
        .where(inArray(userRoles.userId, userIds)),
    ]);

    const profiles = new Map(profileRows.map((profile) => [profile.userId, profile]));
    const roles = new Map<string, UserRoleCode[]>();
    for (const role of roleRows) {
      const current = roles.get(role.userId) ?? [];
      current.push(role.roleCode);
      roles.set(role.userId, current);
    }

    return AdminUserViewSchema.array().parse(
      userRows.map((user) => {
        const profile = profiles.get(user.id);
        return {
          id: user.id,
          email: user.email,
          status: user.status,
          roles: (roles.get(user.id) ?? []).sort(),
          firstName: profile?.firstName ?? user.email.split("@")[0],
          lastName: profile?.lastName ?? "User",
          createdAt: toIso(user.createdAt),
          updatedAt: toIso(user.updatedAt),
        };
      }),
    );
  }

  async createUser(
    principal: AuthenticatedPrincipal,
    input: AdminCreateUserInput,
    requestId: string,
    metadata: RequestMetadata,
  ): Promise<AdminUserView> {
    await this.access.requirePlatformPermission({
      principal,
      permission: "platform.users.manage",
      ...metadata,
    });

    const account = AdminCreateUserSchema.parse(input);
    if (!(ADMIN_CREATABLE_ROLE_CODES as readonly string[]).includes(account.roleCode)) {
      throw new AppError(400, "INVALID_USER_ROLE", "That role cannot be assigned here");
    }

    const userId = randomUUID();
    const passwordHash = await this.passwords.hash(account.password);
    const now = new Date();

    try {
      await this.database.transaction(async (transaction) => {
        await this.assertAdministrator(transaction, principal.userId);

        const [existing] = await transaction
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, account.email))
          .limit(1);
        if (existing) {
          throw new AppError(409, "USER_CONFLICT", "A user with that email already exists");
        }

        const token = createOpaqueToken();
        const emailRecord = this.email.prepareVerificationEmail(account.email, token);

        await transaction.insert(users).values({
          id: userId,
          email: account.email,
          passwordHash,
          status: "pending_verification",
        });
        await transaction.insert(userProfiles).values({
          userId,
          firstName: account.profile.firstName,
          lastName: account.profile.lastName,
          preferredName: account.profile.preferredName ?? null,
          phone: account.profile.phone ?? null,
          avatarUrl: account.profile.avatarUrl ?? null,
          addressLine1: account.profile.addressLine1 ?? null,
          addressLine2: account.profile.addressLine2 ?? null,
          city: account.profile.city ?? null,
          state: account.profile.state ?? null,
          postalCode: account.profile.postalCode ?? null,
          countryCode: account.profile.countryCode ?? null,
          locale: account.profile.locale,
          timeZone: account.profile.timeZone,
        });
        await transaction.insert(userRoles).values({
          userId,
          roleCode: "pet_owner",
          assignedByUserId: principal.userId,
        });
        if (account.roleCode === "admin") {
          await transaction.insert(userRoles).values({
            userId,
            roleCode: "admin",
            assignedByUserId: principal.userId,
          });
        }
        await transaction.insert(authTokens).values({
          id: randomUUID(),
          userId,
          type: "email_verification",
          tokenHash: hashOpaqueToken(token),
          expiresAt: new Date(Date.now() + verificationTokenLifetimeMs),
        });
        await transaction.insert(emailOutbox).values(emailRecord);
        await transaction.insert(auditLogs).values({
          id: randomUUID(),
          actorUserId: principal.userId,
          targetUserId: userId,
          action: "admin.user_created",
          outcome: "success",
          resourceType: "platform",
          resourceId: userId,
          ipAddress: metadata.ipAddress ?? null,
          userAgent: metadata.userAgent ?? null,
          requestId,
        });
      });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new AppError(409, "USER_CONFLICT", "A user with that email already exists");
      }
      throw error;
    }

    return AdminUserViewSchema.parse({
      id: userId,
      email: account.email,
      status: "pending_verification",
      roles: account.roleCode === "admin" ? ["admin", "pet_owner"] : ["pet_owner"],
      firstName: account.profile.firstName,
      lastName: account.profile.lastName,
      createdAt: toIso(now),
      updatedAt: toIso(now),
    });
  }

  private async assertAdministrator(transaction: Transaction, actorUserId: string): Promise<void> {
    const [administrator] = await transaction
      .select({ userId: userRoles.userId })
      .from(userRoles)
      .innerJoin(users, eq(userRoles.userId, users.id))
      .where(
        and(
          eq(userRoles.userId, actorUserId),
          eq(userRoles.roleCode, "admin"),
          eq(users.status, "active"),
        ),
      )
      .limit(1);

    if (!administrator) {
      throw new AppError(403, "FORBIDDEN", "Platform administrator authority is required");
    }
  }
}
