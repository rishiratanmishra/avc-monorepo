import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AppError } from "../../errors/app-error.js";
import { hashOpaqueToken } from "../auth/token.service.js";
import { AccessService } from "./access.service.js";
import { HospitalAdministrationService } from "./hospital-administration.service.js";
import {
  FakeAccessRepository,
  FakeInvitationEmail,
  testDate,
  testUuid,
} from "./test-support/fake-access-repository.js";

const metadata = {
  requestId: testUuid(950),
  ipAddress: "203.0.113.11",
  userAgent: "administration-test",
};

async function expectForbidden(promise: Promise<unknown>, message?: string) {
  await assert.rejects(promise, (error: unknown) => {
    assert.ok(error instanceof AppError);
    assert.equal(error.statusCode, 403);
    if (message) {
      assert.match(error.message, new RegExp(message, "i"));
    }
    return true;
  });
}

function fixture() {
  const repository = new FakeAccessRepository();
  const access = new AccessService(repository);
  const service = new HospitalAdministrationService(repository, access, new FakeInvitationEmail());

  const platformId = testUuid(11);
  const ownerId = testUuid(12);
  const managerId = testUuid(13);
  const targetId = testUuid(14);
  const hospitalId = testUuid(111);

  repository.addUser({ id: platformId, email: "platform@example.com", status: "active" }, [
    "admin",
  ]);
  repository.addUser({ id: ownerId, email: "owner@example.com", status: "active" }, ["pet_owner"]);
  repository.addUser({ id: managerId, email: "manager@example.com", status: "active" }, [
    "pet_owner",
  ]);
  repository.addUser({ id: targetId, email: "target@example.com", status: "active" }, [
    "pet_owner",
  ]);
  repository.hospitals.push({
    id: hospitalId,
    name: "Central Hospital",
    slug: "central",
    status: "active",
  });
  repository.addMembership({
    id: testUuid(211),
    hospitalId,
    userId: ownerId,
    roles: ["hospital_owner"],
  });
  repository.addMembership({
    id: testUuid(212),
    hospitalId,
    userId: managerId,
    roles: ["hospital_admin"],
  });
  repository.addMembership({
    id: testUuid(213),
    hospitalId,
    userId: targetId,
    roles: ["receptionist"],
  });
  repository.addMembership({
    id: testUuid(214),
    hospitalId,
    userId: platformId,
    roles: ["hospital_admin"],
  });

  const platformPrincipal = {
    userId: platformId,
    sessionId: testUuid(311),
    activeHospitalId: null,
    activeScope: "platform" as const,
  };
  const ownerPrincipal = {
    userId: ownerId,
    sessionId: testUuid(312),
    activeHospitalId: hospitalId,
    activeScope: "hospital" as const,
  };
  const managerPrincipal = {
    userId: managerId,
    sessionId: testUuid(313),
    activeHospitalId: hospitalId,
    activeScope: "hospital" as const,
  };
  const platformHospitalPrincipal = {
    userId: platformId,
    sessionId: testUuid(317),
    activeHospitalId: hospitalId,
    activeScope: "hospital" as const,
  };

  return {
    repository,
    service,
    platformId,
    ownerId,
    managerId,
    targetId,
    hospitalId,
    platformPrincipal,
    ownerPrincipal,
    managerPrincipal,
    platformHospitalPrincipal,
  };
}

describe("hospital administration", () => {
  it("provisions a hospital in suspended state until the owner accepts", async () => {
    const context = fixture();
    const created = await context.service.createHospital(
      context.platformPrincipal,
      {
        name: "New Hospital",
        slug: "new-hospital",
        ownerEmail: "founder@example.com",
      },
      metadata,
    );

    assert.equal(created.status, "suspended");
    assert.equal(context.repository.emails.length, 1);
    assert.equal(context.repository.emails[0]?.recipient, "founder@example.com");
    assert.equal(context.repository.emails[0]?.type, "hospital_invitation");

    context.repository.addUser({
      id: testUuid(15),
      email: "founder@example.com",
      status: "active",
    });
    const token = context.repository.emails[0]?.encryptedPayload ?? "";
    const founderPrincipal = {
      userId: testUuid(15),
      sessionId: testUuid(314),
      activeHospitalId: null,
      activeScope: "client" as const,
    };

    const accepted = await context.service.acceptInvitation(founderPrincipal, token, metadata);
    assert.equal(accepted.hospitalId, created.id);
    assert.equal(
      context.repository.hospitals.find((hospital) => hospital.id === created.id)?.status,
      "active",
    );
    assert.ok(
      context.repository.memberships.some(
        (membership) =>
          membership.hospitalId === created.id &&
          membership.userId === founderPrincipal.userId &&
          membership.roles.includes("hospital_owner"),
      ),
    );
  });

  it("binds invitation acceptance to the invited email", async () => {
    const context = fixture();
    await context.service.inviteMember(
      context.ownerPrincipal,
      context.hospitalId,
      { email: "vet@example.com", roleCode: "veterinarian" },
      metadata,
    );

    const token = context.repository.emails[0]?.encryptedPayload ?? "";
    await expectForbidden(
      context.service.acceptInvitation(context.managerPrincipal, token, metadata),
      "bound to another email",
    );
  });

  it("requires owner authority to grant owner and protects the final owner", async () => {
    const context = fixture();

    await expectForbidden(
      context.service.inviteMember(
        context.managerPrincipal,
        context.hospitalId,
        { email: "another-owner@example.com", roleCode: "hospital_owner" },
        metadata,
      ),
      "owner authority",
    );

    const ownerMembershipId = testUuid(211);
    await expectForbidden(
      context.service.setMembershipStatus(
        context.platformHospitalPrincipal,
        context.hospitalId,
        ownerMembershipId,
        "revoked",
        metadata,
      ),
      "final hospital owner",
    );

    await context.service.addMembershipRole(
      context.ownerPrincipal,
      context.hospitalId,
      testUuid(212),
      "hospital_owner",
      metadata,
    );
    await context.service.setMembershipStatus(
      context.platformHospitalPrincipal,
      context.hospitalId,
      ownerMembershipId,
      "revoked",
      metadata,
    );

    assert.equal(
      context.repository.memberships.find((membership) => membership.id === ownerMembershipId)
        ?.status,
      "revoked",
    );
  });

  it("revokes affected sessions when a membership is suspended", async () => {
    const context = fixture();
    context.repository.addSession({
      id: testUuid(315),
      tokenHash: hashOpaqueToken("target-session"),
      userId: context.targetId,
      expiresAt: testDate(60_000),
      activeHospitalId: context.hospitalId,
      activeScope: "hospital",
    });

    await context.service.setMembershipStatus(
      context.managerPrincipal,
      context.hospitalId,
      testUuid(213),
      "suspended",
      metadata,
    );

    const remaining = await context.repository.findSessionByTokenHash(
      hashOpaqueToken("target-session"),
    );
    assert.equal(remaining, null);
  });

  it("revokes hospital sessions when a platform admin suspends the hospital", async () => {
    const context = fixture();
    context.repository.addSession({
      id: testUuid(316),
      tokenHash: hashOpaqueToken("manager-session"),
      userId: context.managerId,
      expiresAt: testDate(60_000),
      activeHospitalId: context.hospitalId,
      activeScope: "hospital",
    });

    await context.service.setHospitalStatus(
      context.platformPrincipal,
      context.hospitalId,
      "suspended",
      metadata,
    );

    const remaining = await context.repository.findSessionByTokenHash(
      hashOpaqueToken("manager-session"),
    );
    assert.equal(remaining, null);
    assert.ok(
      context.repository.audits.some((audit) => audit.action === "hospital.status_changed"),
    );
  });
});
