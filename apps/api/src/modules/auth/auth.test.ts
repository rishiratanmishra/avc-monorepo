import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CreateAccountSchema, UserSchema } from "@repo/contracts/models/user";
import { PasswordService } from "./password.service.js";
import { createOpaqueToken, hashOpaqueToken } from "./token.service.js";

describe("account contracts", () => {
  const validAccount = {
    email: " OWNER@EXAMPLE.COM ",
    password: "correct horse battery staple",
    profile: {
      firstName: "Ava",
      lastName: "Shah",
    },
  };

  it("normalizes email and applies profile defaults", () => {
    const account = CreateAccountSchema.parse(validAccount);

    assert.equal(account.email, "owner@example.com");
    assert.equal(account.profile.locale, "en-IN");
    assert.equal(account.profile.timeZone, "Asia/Kolkata");
  });

  it("rejects privileged role fields at registration", () => {
    assert.equal(
      CreateAccountSchema.safeParse({
        ...validAccount,
        role: "admin",
      }).success,
      false,
    );
  });

  it("enforces the minimum password length", () => {
    assert.equal(
      CreateAccountSchema.safeParse({
        ...validAccount,
        password: "too-short",
      }).success,
      false,
    );
  });

  it("does not allow password hashes in public user responses", () => {
    assert.equal(
      UserSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        email: "owner@example.com",
        status: "active",
        emailVerifiedAt: null,
        passwordChangedAt: null,
        lastLoginAt: null,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        passwordHash: "must-not-be-returned",
      }).success,
      false,
    );
  });
});

describe("authentication secrets", () => {
  it("generates random opaque tokens and stores only deterministic hashes", () => {
    const first = createOpaqueToken();
    const second = createOpaqueToken();

    assert.notEqual(first, second);
    assert.equal(first.length, 43);
    assert.equal(hashOpaqueToken(first), hashOpaqueToken(first));
    assert.notEqual(hashOpaqueToken(first), first);
  });

  it("hashes passwords with Argon2id and rejects mismatches", async () => {
    const passwords = new PasswordService();
    const password = "correct horse battery staple";
    const hash = await passwords.hash(password);

    assert.notEqual(hash, password);
    assert.match(hash, /^\$argon2id\$/);
    assert.equal(await passwords.verify(password, hash), true);
    assert.equal(await passwords.verify("wrong password", hash), false);
    assert.equal(await passwords.verify(password), false);
  });
});
