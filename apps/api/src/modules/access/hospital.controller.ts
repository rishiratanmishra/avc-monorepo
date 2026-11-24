import { AssignableHospitalRoleCodeSchema, UpdateMembershipStatusSchema } from "@repo/contracts";
import type { RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../../errors/app-error.js";
import { hospitalAdministrationService } from "./access.container.js";
import { assertPrincipal, getRequestMetadata } from "./access.middleware.js";

const hospitalParamsSchema = z.object({ hospitalId: z.uuid() });
const membershipParamsSchema = hospitalParamsSchema.extend({
  membershipId: z.uuid(),
});
const membershipRoleParamsSchema = membershipParamsSchema.extend({
  roleCode: AssignableHospitalRoleCodeSchema,
});

function parseParams<T>(schema: z.ZodType<T>, params: unknown): T {
  const result = schema.safeParse(params);
  if (!result.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Invalid request path", result.error.issues);
  }

  return result.data;
}

export const listMemberships: RequestHandler = async (request, response) => {
  const params = parseParams(hospitalParamsSchema, request.params);
  response.json(
    await hospitalAdministrationService.listMemberships(
      assertPrincipal(request),
      params.hospitalId,
      getRequestMetadata(request),
    ),
  );
};

export const inviteMember: RequestHandler = async (request, response) => {
  const params = parseParams(hospitalParamsSchema, request.params);
  await hospitalAdministrationService.inviteMember(
    assertPrincipal(request),
    params.hospitalId,
    request.body,
    getRequestMetadata(request),
  );
  response.status(202).json({
    message: "If the account can be invited, instructions will be sent to its email address.",
  });
};

export const updateMembershipStatus: RequestHandler = async (request, response) => {
  const params = parseParams(membershipParamsSchema, request.params);
  const body = UpdateMembershipStatusSchema.parse(request.body);
  response.json(
    await hospitalAdministrationService.setMembershipStatus(
      assertPrincipal(request),
      params.hospitalId,
      params.membershipId,
      body.status,
      getRequestMetadata(request),
    ),
  );
};

export const addMembershipRole: RequestHandler = async (request, response) => {
  const params = parseParams(membershipRoleParamsSchema, request.params);
  await hospitalAdministrationService.addMembershipRole(
    assertPrincipal(request),
    params.hospitalId,
    params.membershipId,
    params.roleCode,
    getRequestMetadata(request),
  );
  response.status(204).end();
};

export const removeMembershipRole: RequestHandler = async (request, response) => {
  const params = parseParams(membershipRoleParamsSchema, request.params);
  await hospitalAdministrationService.removeMembershipRole(
    assertPrincipal(request),
    params.hospitalId,
    params.membershipId,
    params.roleCode,
    getRequestMetadata(request),
  );
  response.status(204).end();
};
