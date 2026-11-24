import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PlatformRoleCodeSchema } from "@repo/contracts";
import { AppError } from "../../errors/app-error.js";
import { RoleService } from "./role.service.js";

describe("platform role assignment boundary", () => {
  it("rejects hospital roles at the contract boundary", () => {
    assert.equal(PlatformRoleCodeSchema.safeParse("hospital_owner").success, false);
    assert.equal(PlatformRoleCodeSchema.safeParse("admin").success, true);
  });

  it("rejects hospital roles before touching the database", async () => {
    const service = new RoleService({} as never);

    await assert.rejects(
      service.assign(
        "550e8400-e29b-41d4-a716-446655440000",
        "550e8400-e29b-41d4-a716-446655440001",
        "hospital_admin",
        "550e8400-e29b-41d4-a716-446655440002",
      ),
      (error: unknown) => {
        assert.ok(error instanceof AppError);
        assert.equal(error.statusCode, 400);
        assert.equal(error.code, "INVALID_PLATFORM_ROLE");
        return true;
      },
    );
  });
});
