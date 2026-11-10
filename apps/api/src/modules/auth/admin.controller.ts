import { UserRoleCodeSchema } from "@repo/contracts/models/user";
import type { RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../../errors/app-error.js";
import { RoleService } from "./role.service.js";

const roleService = new RoleService();
const roleParamsSchema = z.object({
  userId: z.uuid(),
  roleCode: UserRoleCodeSchema,
});

async function updateRole(
  request: Parameters<RequestHandler>[0],
  response: Parameters<RequestHandler>[1],
  operation: "assign" | "revoke",
): Promise<void> {
  if (!request.auth) {
    throw new AppError(401, "UNAUTHENTICATED", "Sign in to continue");
  }

  const params = roleParamsSchema.safeParse(request.params);
  if (!params.success) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Invalid user ID or role",
      params.error.issues,
    );
  }

  await roleService[operation](
    request.auth.userId,
    params.data.userId,
    params.data.roleCode,
    request.requestId,
  );
  response.status(204).end();
}

export const assignRole: RequestHandler = async (request, response) => {
  await updateRole(request, response, "assign");
};

export const revokeRole: RequestHandler = async (request, response) => {
  await updateRole(request, response, "revoke");
};
