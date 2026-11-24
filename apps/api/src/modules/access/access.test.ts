import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AppError } from "../../errors/app-error.js";
import { hashOpaqueToken } from "../auth/token.service.js";
import { AccessService } from "./access.service.js";
import { FakeAccessRepository, testDate, testUuid } from "./test-support/fake-access-repository.js";

const metadata = {
  requestId: testUuid(900),
  ipAddress: "203.0.113.10",
  userAgent: "access-test",
};

async function expectForbidden(promise: Promise<unknown>): Promise<void> {
  await assert.rejects(promise, (error: unknown) => {
    assert.ok(error instanceof AppError);
    assert.equal(error.statusCode, 403);
    return true;
  });
}

function fixture() {
  const repository = new FakeAccessRepository();
  const service = new AccessService(repository);

  const adminId = testUuid(1);
  const staffId = testUuid(2);
  const clientId = testUuid(3);
  const hospitalA = testUuid(101);
  const hospitalB = testUuid(102);
  const hospitalC = testUuid(103);

  repository.addUser({ id: adminId, email: "admin@example.com", status: "active" }, ["admin"]);
  repository.addUser({ id: staffId, email: "staff@example.com", status: "active" }, ["pet_owner"]);
  repository.addUser({ id: clientId, email: "client@example.com", status: "active" }, [
    "pet_owner",
  ]);

  repository.hospitals.push(
    { id: hospitalA, name: "North Hospital", slug: "north", status: "active" },
    { id: hospitalB, name: "South Hospital", slug: "south", status: "active" },
    { id: hospitalC, name: "West Hospital", slug: "west", status: "active" },
  );

  repository.addMembership({
    id: testUuid(201),
    hospitalId: hospitalA,
    hospitalName: "North Hospital",
    userId: staffId,
    roles: ["veterinarian", "receptionist"],
  });
  repository.addMembership({
    id: testUuid(202),
    hospitalId: hospitalB,
    hospitalName: "South Hospital",
    userId: staffId,
    roles: ["veterinarian"],
    status: "suspended",
  });
  repository.addMembership({
    id: testUuid(203),
    hospitalId: hospitalC,
    hospitalName: "West Hospital",
    userId: staffId,
    roles: ["billing"],
  });
  repository.addClientRelationship({
    id: testUuid(301),
    hospitalId: hospitalA,
    hospitalName: "North Hospital",
    userId: clientId,
  });
  repository.addClientRelationship({
    id: testUuid(302),
    hospitalId: hospitalA,
    hospitalName: "North Hospital",
    userId: staffId,
  });

  const staffToken = "staff-session-token";
  const adminToken = "admin-session-token";
  const clientToken = "client-session-token";

  repository.addSession({
    id: testUuid(401),
    tokenHash: hashOpaqueToken(staffToken),
    userId: staffId,
    expiresAt: testDate(60_000),
    activeHospitalId: hospitalA,
    activeScope: "hospital",
  });
  repository.addSession({
    id: testUuid(402),
    tokenHash: hashOpaqueToken(adminToken),
    userId: adminId,
    expiresAt: testDate(60_000),
    activeScope: "platform",
  });
  repository.addSession({
    id: testUuid(403),
    tokenHash: hashOpaqueToken(clientToken),
    userId: clientId,
    expiresAt: testDate(60_000),
    activeHospitalId: hospitalA,
    activeScope: "client",
  });

  return {
    repository,
    service,
    adminId,
    staffId,
    clientId,
    hospitalA,
    hospitalB,
    hospitalC,
    staffToken,
    adminToken,
    clientToken,
  };
}

describe("access context and scoped authorization", () => {
  it("unions roles only within the active membership and reports all valid destinations", async () => {
    const context = fixture();
    const principal = await context.service.authenticate(context.staffToken, metadata);
    const result = await context.service.loadContext(principal);

    assert.equal(result.activeWorkspace.scope, "hospital");
    assert.equal(result.activeWorkspace.hospitalId, context.hospitalA);
    assert.deepEqual(result.activeWorkspace.permissions, [
      "hospital.clients.read",
      "hospital.clinical_tasks.manage",
      "hospital.patients.read",
      "hospital.prescriptions.write",
      "hospital.records.read",
      "hospital.records.write",
      "hospital.schedule.manage",
    ]);
    assert.equal(result.memberships.length, 2);
    assert.ok(
      result.destinations.some((destination) => destination.id === `practice:${context.hospitalA}`),
    );
    assert.ok(
      result.destinations.some((destination) => destination.id === `client:${context.hospitalA}`),
    );
    assert.equal(result.activeDestination?.scope, "hospital");
    assert.equal(result.activeDestination?.hospitalId, context.hospitalA);
  });

  it("keeps client and staff authority separate when a person has both", async () => {
    const context = fixture();
    const principal = await context.service.authenticate(context.staffToken, metadata);

    await context.service.requireHospitalPermission({
      principal,
      permission: "hospital.patients.read",
      hospitalId: context.hospitalA,
      ...metadata,
    });

    const clientContext = await context.service.selectWorkspace(
      principal,
      { scope: "client", hospitalId: context.hospitalA },
      metadata,
    );
    assert.equal(clientContext.activeWorkspace.scope, "client");
    assert.equal(clientContext.activeDestination?.scope, "client");
    assert.equal(clientContext.activeDestination?.hospitalId, context.hospitalA);
    assert.deepEqual(clientContext.activeWorkspace.permissions, [
      "client.appointments.manage",
      "client.profile.manage",
      "client.records.read",
    ]);

    await expectForbidden(
      context.service.requireHospitalPermission({
        principal: { ...principal, activeScope: "client" },
        permission: "hospital.patients.read",
        hospitalId: context.hospitalA,
        ...metadata,
      }),
    );
  });

  it("denies platform authority to hospital staff and hospital authority to platform-only admins", async () => {
    const context = fixture();
    const staff = await context.service.authenticate(context.staffToken, metadata);
    const admin = await context.service.authenticate(context.adminToken, metadata);

    await expectForbidden(
      context.service.requirePlatformPermission({
        principal: staff,
        permission: "platform.hospitals.manage",
        ...metadata,
      }),
    );
    await expectForbidden(
      context.service.requireHospitalPermission({
        principal: admin,
        permission: "hospital.settings.manage",
        hospitalId: context.hospitalA,
        ...metadata,
      }),
    );
  });

  it("denies cross-hospital and suspended-membership access", async () => {
    const context = fixture();
    const principal = await context.service.authenticate(context.staffToken, metadata);

    await expectForbidden(
      context.service.requireHospitalPermission({
        principal,
        permission: "hospital.patients.read",
        hospitalId: context.hospitalB,
        ...metadata,
      }),
    );
    await expectForbidden(
      context.service.selectWorkspace(
        principal,
        { scope: "hospital", hospitalId: context.hospitalB },
        metadata,
      ),
    );
    await context.service.requireHospitalPermission({
      principal,
      permission: "hospital.patients.read",
      hospitalId: context.hospitalA,
      ...metadata,
    });
  });

  it("enforces client resource ownership and active workspace", async () => {
    const context = fixture();
    const principal = await context.service.authenticate(context.clientToken, metadata);

    await context.service.requireClientResource({
      principal,
      permission: "client.records.read",
      hospitalId: context.hospitalA,
      ...metadata,
    });
    await expectForbidden(
      context.service.requireClientResource({
        principal,
        permission: "client.records.read",
        hospitalId: context.hospitalB,
        ...metadata,
      }),
    );
  });

  it("denies privileged permissions until a legacy null-scope session selects a workspace", async () => {
    const context = fixture();
    const legacyToken = "legacy-session-token";
    context.repository.addSession({
      id: testUuid(405),
      tokenHash: hashOpaqueToken(legacyToken),
      userId: context.staffId,
      expiresAt: testDate(60_000),
      activeHospitalId: context.hospitalA,
    });
    const principal = await context.service.authenticate(legacyToken, metadata);

    await expectForbidden(
      context.service.requireHospitalPermission({
        principal,
        permission: "hospital.patients.read",
        hospitalId: context.hospitalA,
        ...metadata,
      }),
    );

    const selected = await context.service.selectWorkspace(
      principal,
      { scope: "hospital", hospitalId: context.hospitalA },
      metadata,
    );
    assert.equal(selected.activeWorkspace.scope, "hospital");
    await context.service.requireHospitalPermission({
      principal: { ...principal, activeScope: "hospital" },
      permission: "hospital.patients.read",
      hospitalId: context.hospitalA,
      ...metadata,
    });
  });

  it("rejects expired and revoked sessions and audits denials", async () => {
    const context = fixture();
    const expiredToken = "expired-token";
    context.repository.addSession({
      id: testUuid(404),
      tokenHash: hashOpaqueToken(expiredToken),
      userId: context.staffId,
      expiresAt: testDate(-1000),
    });

    await assert.rejects(context.service.authenticate(expiredToken, metadata), (error: unknown) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.statusCode, 401);
      return true;
    });
    assert.ok(
      context.repository.audits.some(
        (audit) => audit.action === "auth.session_rejected" && audit.outcome === "denied",
      ),
    );

    await context.service.authenticate(context.staffToken, metadata);
    await context.repository.revokeAllSessions(context.staffId);
    await assert.rejects(
      context.service.authenticate(context.staffToken, metadata),
      (error: unknown) => {
        assert.ok(error instanceof AppError);
        assert.equal(error.statusCode, 401);
        return true;
      },
    );
  });
});
