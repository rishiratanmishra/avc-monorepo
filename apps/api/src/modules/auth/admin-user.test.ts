import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AdminCreateUserSchema,
  AdminUserViewSchema,
  PlatformRoleCodeSchema,
} from "@repo/contracts";
import { AppError } from "../../errors/app-error.js";
import { AdminUserService } from "./admin-user.service.js";

const validAccount = {
  email: " OWNER@EXAMPLE.COM ",
  password: "correct horse battery staple",
  profile: { firstName: "Ava", lastName: "Shah" },
};

const principal = {
  userId: "550e8400-e29b-41d4-a716-446655440000",
  sessionId: "550e8400-e29b-41d4-a716-446655440001",
  activeHospitalId: null,
  activeScope: "platform" as const,
};

const metadata = {
  requestId: "550e8400-e29b-41d4-a716-446655440002",
  ipAddress: "203.0.113.10",
  userAgent: "admin-user-test",
};

describe("admin user creation contracts", () => {
  it("normalizes email, applies profile defaults, and defaults to pet owner", () => {
    const account = AdminCreateUserSchema.parse(validAccount);

    assert.equal(account.email, "owner@example.com");
    assert.equal(account.roleCode, "pet_owner");
    assert.equal(account.profile.locale, "en-IN");
    assert.equal(account.profile.timeZone, "Asia/Kolkata");
  });

  it("allows a platform administrator role at creation", () => {
    const account = AdminCreateUserSchema.parse({ ...validAccount, roleCode: "admin" });
    assert.equal(account.roleCode, "admin");
  });

  it("rejects hospital and client-only role fields outside the allowed set", () => {
    assert.equal(
      AdminCreateUserSchema.safeParse({ ...validAccount, roleCode: "hospital_owner" }).success,
      false,
    );
    assert.equal(
      AdminCreateUserSchema.safeParse({ ...validAccount, role: "admin" }).success,
      false,
    );
  });

  it("enforces the shared password minimum", () => {
    assert.equal(
      AdminCreateUserSchema.safeParse({ ...validAccount, password: "too-short" }).success,
      false,
    );
  });

  it("does not allow password hashes in administrative user responses", () => {
    assert.equal(
      AdminUserViewSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440003",
        email: "owner@example.com",
        status: "active",
        roles: ["pet_owner"],
        firstName: "Ava",
        lastName: "Shah",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        passwordHash: "must-not-be-returned",
      }).success,
      false,
    );
  });

  it("keeps the role-assignment endpoint limited to platform roles", () => {
    assert.equal(PlatformRoleCodeSchema.safeParse("admin").success, true);
    assert.equal(PlatformRoleCodeSchema.safeParse("pet_owner").success, false);
    assert.equal(PlatformRoleCodeSchema.safeParse("hospital_owner").success, false);
  });
});

describe("admin user service authorization", () => {
  it("rejects creation when the actor is not an active platform administrator", async () => {
    const database = {
      transaction: async (callback: (transaction: unknown) => Promise<unknown>) =>
        callback({
          select: () => ({
            from: () => ({
              innerJoin: () => ({
                where: () => ({ limit: async () => [] }),
              }),
            }),
          }),
        }),
    };
    const access = { requirePlatformPermission: async () => undefined };
    const passwords = { hash: async () => "unused-hash" };
    const email = {
      prepareVerificationEmail: () => {
        throw new Error("Email must not be prepared before authorization");
      },
    };
    const service = new AdminUserService(
      database as never,
      passwords as never,
      email as never,
      access as never,
    );

    await assert.rejects(
      service.createUser(
        principal,
        AdminCreateUserSchema.parse(validAccount),
        metadata.requestId,
        metadata,
      ),
      (error: unknown) => {
        assert.ok(error instanceof AppError);
        assert.equal(error.statusCode, 403);
        assert.equal(error.code, "FORBIDDEN");
        return true;
      },
    );
  });
});
