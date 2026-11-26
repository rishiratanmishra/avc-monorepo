import type { AdminCreateUserInput, PlatformRoleCode } from "@repo/contracts";
import type { RequestHandler } from "express";
import { assertPrincipal, getRequestMetadata } from "../access/access.middleware.js";
import { adminUserService } from "./admin-user.container.js";
import { RoleService } from "./role.service.js";

const roleService = new RoleService();

export const listPlatformUsers: RequestHandler = async (request, response) => {
  const principal = assertPrincipal(request);
  response.json(await adminUserService.listUsers(principal, getRequestMetadata(request)));
};

export const createPlatformUser: RequestHandler = async (request, response) => {
  const principal = assertPrincipal(request);
  const user = await adminUserService.createUser(
    principal,
    request.body as AdminCreateUserInput,
    request.requestId,
    getRequestMetadata(request),
  );
  response.status(201).json(user);
};

async function updatePlatformRole(
  request: Parameters<RequestHandler>[0],
  response: Parameters<RequestHandler>[1],
  operation: "assign" | "revoke",
): Promise<void> {
  const principal = assertPrincipal(request);
  const { userId, roleCode } = request.params as {
    userId: string;
    roleCode: PlatformRoleCode;
  };

  await roleService[operation](
    principal.userId,
    userId,
    roleCode,
    request.requestId,
    getRequestMetadata(request),
  );
  response.status(204).end();
}

export const assignPlatformUserRole: RequestHandler = async (request, response) => {
  await updatePlatformRole(request, response, "assign");
};

export const revokePlatformUserRole: RequestHandler = async (request, response) => {
  await updatePlatformRole(request, response, "revoke");
};
