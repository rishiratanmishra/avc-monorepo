import {
  AuthenticatedUserSchema,
  CreateAccountSchema,
  UpdateUserProfileSchema,
  type AuthenticatedUser,
  type CreateAccountInput,
  type UpdateUserProfileInput,
} from "@repo/contracts/models/user";
import {
  auditLogs,
  emailOutbox,
  authSessions,
  authTokens,
  getDatabase,
  userProfiles,
  userRoles,
  users,
} from "@repo/database";
import { and, eq, gt, isNull } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { env } from "../../config/env.js";
import { AppError } from "../../errors/app-error.js";
import { PasswordService } from "./password.service.js";
import { ResendEmailService } from "./resend-email.service.js";
import { hashOpaqueToken, createOpaqueToken } from "./token.service.js";

type Database = ReturnType<typeof getDatabase>;
type TokenType = "email_verification" | "password_reset";

const verificationTokenLifetimeMs = 24 * 60 * 60 * 1000;
const passwordResetTokenLifetimeMs = 60 * 60 * 1000;

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ER_DUP_ENTRY"
  );
}

function toIso(value: Date | null): string | null {
  return value?.toISOString() ?? null;
}

function makeToken(userId: string, type: TokenType, lifetimeMs: number) {
  const token = createOpaqueToken();

  return {
    token,
    record: {
      id: randomUUID(),
      userId,
      type,
      tokenHash: hashOpaqueToken(token),
      expiresAt: new Date(Date.now() + lifetimeMs),
    },
  };
}

export class AuthService {
  constructor(
    private readonly database: Database = getDatabase(),
    private readonly passwords = new PasswordService(),
    private readonly email = new ResendEmailService(),
  ) {}

  async register(input: CreateAccountInput, requestId: string): Promise<void> {
    const account = CreateAccountSchema.parse(input);
    this.email.assertConfigured();

    const [existingUser] = await this.database
      .select({ id: users.id, status: users.status })
      .from(users)
      .where(eq(users.email, account.email))
      .limit(1);

    if (existingUser) {
      if (existingUser.status === "pending_verification") {
        await this.sendVerificationFor(
          existingUser.id,
          account.email,
          requestId,
        );
      }

      return;
    }

    const userId = randomUUID();
    const passwordHash = await this.passwords.hash(account.password);
    const verification = makeToken(
      userId,
      "email_verification",
      verificationTokenLifetimeMs,
    );

    try {
      await this.database.transaction(async (transaction) => {
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
        });

        await transaction.insert(authTokens).values(verification.record);
        await transaction
          .insert(emailOutbox)
          .values(
            this.email.prepareVerificationEmail(
              account.email,
              verification.token,
            ),
          );
        await transaction.insert(auditLogs).values({
          id: randomUUID(),
          actorUserId: null,
          targetUserId: userId,
          action: "auth.account_registered",
          requestId,
        });
      });
    } catch (error) {
      if (!isDuplicateKeyError(error)) {
        throw error;
      }

      const [racedUser] = await this.database
        .select({ id: users.id, status: users.status })
        .from(users)
        .where(eq(users.email, account.email))
        .limit(1);

      if (racedUser?.status === "pending_verification") {
        await this.sendVerificationFor(racedUser.id, account.email, requestId);
      }

      return;
    }
  }

  async resendVerification(email: string, requestId: string): Promise<void> {
    this.email.assertConfigured();
    const [user] = await this.database
      .select({ id: users.id, status: users.status })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user?.status === "pending_verification") {
      await this.sendVerificationFor(user.id, email, requestId);
    }
  }

  async verifyEmail(token: string, requestId: string): Promise<void> {
    const tokenHash = hashOpaqueToken(token);
    const now = new Date();

    await this.database.transaction(async (transaction) => {
      const [record] = await transaction
        .select()
        .from(authTokens)
        .where(
          and(
            eq(authTokens.tokenHash, tokenHash),
            eq(authTokens.type, "email_verification"),
            isNull(authTokens.consumedAt),
            gt(authTokens.expiresAt, now),
          ),
        )
        .for("update")
        .limit(1);

      if (!record) {
        throw new AppError(
          400,
          "INVALID_OR_EXPIRED_TOKEN",
          "Verification link is invalid or expired",
        );
      }

      await transaction
        .update(authTokens)
        .set({ consumedAt: now })
        .where(eq(authTokens.id, record.id));

      await transaction
        .update(users)
        .set({ status: "active", emailVerifiedAt: now, updatedAt: now })
        .where(
          and(
            eq(users.id, record.userId),
            eq(users.status, "pending_verification"),
          ),
        );

      await transaction.insert(auditLogs).values({
        id: randomUUID(),
        actorUserId: record.userId,
        targetUserId: record.userId,
        action: "auth.email_verified",
        requestId,
      });
    });
  }

  async requestPasswordReset(email: string, requestId: string): Promise<void> {
    this.email.assertConfigured();
    const [user] = await this.database
      .select({ id: users.id, status: users.status })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user?.status !== "active") {
      return;
    }

    await this.replaceToken(
      user.id,
      email,
      "password_reset",
      passwordResetTokenLifetimeMs,
      requestId,
    );
  }

  async resetPassword(
    token: string,
    password: string,
    requestId: string,
  ): Promise<void> {
    const passwordHash = await this.passwords.hash(password);
    const tokenHash = hashOpaqueToken(token);
    const now = new Date();

    await this.database.transaction(async (transaction) => {
      const [record] = await transaction
        .select()
        .from(authTokens)
        .where(
          and(
            eq(authTokens.tokenHash, tokenHash),
            eq(authTokens.type, "password_reset"),
            isNull(authTokens.consumedAt),
            gt(authTokens.expiresAt, now),
          ),
        )
        .for("update")
        .limit(1);

      if (!record) {
        throw new AppError(
          400,
          "INVALID_OR_EXPIRED_TOKEN",
          "Password reset link is invalid or expired",
        );
      }

      await transaction
        .update(authTokens)
        .set({ consumedAt: now })
        .where(eq(authTokens.id, record.id));

      await transaction
        .update(users)
        .set({ passwordHash, passwordChangedAt: now, updatedAt: now })
        .where(eq(users.id, record.userId));

      await transaction
        .delete(authSessions)
        .where(eq(authSessions.userId, record.userId));

      await transaction
        .update(authTokens)
        .set({ consumedAt: now })
        .where(
          and(
            eq(authTokens.userId, record.userId),
            isNull(authTokens.consumedAt),
          ),
        );

      await transaction.insert(auditLogs).values({
        id: randomUUID(),
        actorUserId: record.userId,
        targetUserId: record.userId,
        action: "auth.password_reset",
        requestId,
      });
    });
  }

  async login(
    email: string,
    password: string,
    requestId: string,
  ): Promise<{ token: string; user: AuthenticatedUser }> {
    const [user] = await this.database
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const passwordIsValid = await this.passwords.verify(
      password,
      user?.passwordHash,
    );

    if (!user || !passwordIsValid || user.status !== "active") {
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Email or password is incorrect",
      );
    }

    const token = createOpaqueToken();
    const now = new Date();
    const sessionId = randomUUID();
    const expiresAt = new Date(
      now.getTime() + env.sessionTtlDays * 24 * 60 * 60 * 1000,
    );

    await this.database.transaction(async (transaction) => {
      await transaction.insert(authSessions).values({
        id: sessionId,
        userId: user.id,
        tokenHash: hashOpaqueToken(token),
        expiresAt,
      });

      await transaction
        .update(users)
        .set({ lastLoginAt: now, updatedAt: now })
        .where(eq(users.id, user.id));

      await transaction.insert(auditLogs).values({
        id: randomUUID(),
        actorUserId: user.id,
        targetUserId: user.id,
        action: "auth.login",
        requestId,
      });
    });

    return { token, user: await this.getAuthenticatedUser(user.id) };
  }

  async logout(token: string | undefined, requestId: string): Promise<void> {
    if (!token) {
      return;
    }

    const tokenHash = hashOpaqueToken(token);
    await this.database.transaction(async (transaction) => {
      const [session] = await transaction
        .select({ id: authSessions.id, userId: authSessions.userId })
        .from(authSessions)
        .where(eq(authSessions.tokenHash, tokenHash))
        .limit(1);

      if (!session) {
        return;
      }

      await transaction
        .delete(authSessions)
        .where(eq(authSessions.id, session.id));

      await transaction.insert(auditLogs).values({
        id: randomUUID(),
        actorUserId: session.userId,
        targetUserId: session.userId,
        action: "auth.logout",
        requestId,
      });
    });
  }

  async getAuthenticatedUser(userId: string): Promise<AuthenticatedUser> {
    const [user] = await this.database
      .select({
        id: users.id,
        email: users.email,
        status: users.status,
        emailVerifiedAt: users.emailVerifiedAt,
        passwordChangedAt: users.passwordChangedAt,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const [profile] = await this.database
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    const assignedRoles = await this.database
      .select({ code: userRoles.roleCode })
      .from(userRoles)
      .where(eq(userRoles.userId, userId));

    if (!user || !profile) {
      throw new AppError(
        404,
        "ACCOUNT_NOT_FOUND",
        "Account profile was not found",
      );
    }

    return AuthenticatedUserSchema.parse({
      user: {
        ...user,
        emailVerifiedAt: toIso(user.emailVerifiedAt),
        passwordChangedAt: toIso(user.passwordChangedAt),
        lastLoginAt: toIso(user.lastLoginAt),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      profile: {
        ...profile,
        phoneVerifiedAt: toIso(profile.phoneVerifiedAt),
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
      },
      roles: assignedRoles.map((role) => role.code),
    });
  }

  async updateProfile(
    userId: string,
    input: UpdateUserProfileInput,
    requestId: string,
  ): Promise<AuthenticatedUser> {
    const profile = UpdateUserProfileSchema.parse(input);
    const now = new Date();

    await this.database.transaction(async (transaction) => {
      await transaction
        .update(userProfiles)
        .set({
          ...profile,
          ...(profile.phone === undefined ? {} : { phoneVerifiedAt: null }),
          updatedAt: now,
        })
        .where(eq(userProfiles.userId, userId));

      await transaction.insert(auditLogs).values({
        id: randomUUID(),
        actorUserId: userId,
        targetUserId: userId,
        action: "profile.updated",
        requestId,
      });
    });

    return this.getAuthenticatedUser(userId);
  }

  private async sendVerificationFor(
    userId: string,
    email: string,
    requestId: string,
  ): Promise<void> {
    await this.replaceToken(
      userId,
      email,
      "email_verification",
      verificationTokenLifetimeMs,
      requestId,
    );
  }

  private async replaceToken(
    userId: string,
    recipient: string,
    type: TokenType,
    lifetimeMs: number,
    requestId: string,
  ): Promise<void> {
    const token = makeToken(userId, type, lifetimeMs);
    const now = new Date();

    await this.database.transaction(async (transaction) => {
      await transaction
        .update(authTokens)
        .set({ consumedAt: now })
        .where(
          and(
            eq(authTokens.userId, userId),
            eq(authTokens.type, type),
            isNull(authTokens.consumedAt),
          ),
        );

      await transaction.insert(authTokens).values(token.record);
      await transaction
        .insert(emailOutbox)
        .values(
          type === "email_verification"
            ? this.email.prepareVerificationEmail(recipient, token.token)
            : this.email.preparePasswordResetEmail(recipient, token.token),
        );
      await transaction.insert(auditLogs).values({
        id: randomUUID(),
        actorUserId: userId,
        targetUserId: userId,
        action:
          type === "email_verification"
            ? "auth.verification_requested"
            : "auth.password_reset_requested",
        requestId,
      });
    });
  }
}
