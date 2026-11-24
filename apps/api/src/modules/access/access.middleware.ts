import type { PermissionCode } from "@repo/contracts";
import type { RequestHandler } from "express";
import { AppError } from "../../errors/app-error.js";
import { readSessionCookie } from "../auth/session-cookie.js";
import type { AccessRepository, AuthenticatedPrincipal, RequestMetadata } from "./access.types.js";
import { AccessService } from "./access.service.js";

declare global {
  namespace Express {
    interface Request {
      principal?: AuthenticatedPrincipal;
    }
  }
}

export function getRequestMetadata(request: Parameters<RequestHandler>[0]): RequestMetadata {
  return {
    requestId: request.requestId,
    ipAddress: request.ip ?? null,
    userAgent: request.get("user-agent") ?? null,
  };
}

async function authenticateRequest(
  request: Parameters<RequestHandler>[0],
  service: AccessService,
): Promise<AuthenticatedPrincipal> {
  if (request.principal) {
    return request.principal;
  }

  const principal = await service.authenticate(
    readSessionCookie(request.headers.cookie),
    getRequestMetadata(request),
  );
  request.principal = principal;
  request.auth = {
    userId: principal.userId,
    sessionId: principal.sessionId,
  };

  return principal;
}

export function requireAccessAuthentication(service: AccessService): RequestHandler {
  return async (request, _response, next) => {
    try {
      await authenticateRequest(request, service);
      next();
    } catch (error) {
      next(error);
    }
  };
}

function permissionGuard(
  service: AccessService,
  permission: PermissionCode,
  scope: "platform" | "hospital" | "client",
): RequestHandler {
  return async (request, _response, next) => {
    try {
      const principal = await authenticateRequest(request, service);
      const hospitalId =
        typeof request.params.hospitalId === "string" ? request.params.hospitalId : null;
      const metadata = getRequestMetadata(request);

      if (scope === "platform") {
        await service.requirePlatformPermission({
          principal,
          permission,
          hospitalId,
          ...metadata,
        });
      } else if (scope === "hospital") {
        await service.requireHospitalPermission({
          principal,
          permission,
          hospitalId,
          ...metadata,
        });
      } else {
        await service.requireClientPermission({
          principal,
          permission,
          hospitalId,
          ...metadata,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requirePlatformPermission(
  service: AccessService,
  permission: PermissionCode,
): RequestHandler {
  return permissionGuard(service, permission, "platform");
}

export function requireHospitalPermission(
  service: AccessService,
  permission: PermissionCode,
): RequestHandler {
  return permissionGuard(service, permission, "hospital");
}

export function requireClientPermission(
  service: AccessService,
  permission: PermissionCode,
): RequestHandler {
  return permissionGuard(service, permission, "client");
}

export function assertPrincipal(request: Parameters<RequestHandler>[0]): AuthenticatedPrincipal {
  if (!request.principal) {
    throw new AppError(401, "UNAUTHENTICATED", "Sign in to continue");
  }

  return request.principal;
}

export type AccessServiceFactory = (repository: AccessRepository) => AccessService;
