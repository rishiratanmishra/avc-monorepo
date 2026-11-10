import { and, eq, gt } from "drizzle-orm";
import type { RequestHandler } from "express";
import type { UserRoleCode } from "@repo/contracts/models/user";
import { getDatabase } from "@repo/database";
import { authSessions, userRoles, users } from "@repo/database";
import { AppError } from "../errors/app-error.js";
import { hashOpaqueToken } from "../modules/auth/token.service.js";
import {
  clearSessionCookie,
  readSessionCookie,
} from "../modules/auth/session-cookie.js";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId: string;
      };
    }
  }
}

export const requireAuthentication: RequestHandler = async (
  request,
  response,
  next,
) => {
  const token = readSessionCookie(request.headers.cookie);

  if (!token) {
    next(new AppError(401, "UNAUTHENTICATED", "Sign in to continue"));
    return;
  }

  try {
    const [session] = await getDatabase()
      .select({
        sessionId: authSessions.id,
        userId: users.id,
      })
      .from(authSessions)
      .innerJoin(users, eq(authSessions.userId, users.id))
      .where(
        and(
          eq(authSessions.tokenHash, hashOpaqueToken(token)),
          gt(authSessions.expiresAt, new Date()),
          eq(users.status, "active"),
        ),
      )
      .limit(1);

    if (!session) {
      clearSessionCookie(response);
      next(new AppError(401, "UNAUTHENTICATED", "Sign in to continue"));
      return;
    }

    request.auth = { userId: session.userId, sessionId: session.sessionId };
    next();
  } catch (error) {
    next(error);
  }
};

export function requireRole(roleCode: UserRoleCode): RequestHandler {
  return async (request, _response, next) => {
    if (!request.auth) {
      next(new AppError(401, "UNAUTHENTICATED", "Sign in to continue"));
      return;
    }

    try {
      const [role] = await getDatabase()
        .select({ userId: userRoles.userId })
        .from(userRoles)
        .where(
          and(
            eq(userRoles.userId, request.auth.userId),
            eq(userRoles.roleCode, roleCode),
          ),
        )
        .limit(1);

      if (!role) {
        next(new AppError(403, "FORBIDDEN", "You do not have permission"));
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
