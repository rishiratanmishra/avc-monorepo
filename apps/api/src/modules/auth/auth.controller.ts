import type { RequestHandler } from "express";
import { AppError } from "../../errors/app-error.js";
import { AuthService } from "./auth.service.js";
import {
  clearSessionCookie,
  readSessionCookie,
  setSessionCookie,
} from "./session-cookie.js";

const authService = new AuthService();

export const register: RequestHandler = async (request, response) => {
  await authService.register(request.body, request.requestId);
  response.status(202).json({
    message:
      "If these details can be used to create an account, verification instructions will be sent.",
  });
};

export const login: RequestHandler = async (request, response) => {
  const result = await authService.login(
    request.body.email,
    request.body.password,
    request.requestId,
  );

  setSessionCookie(response, result.token);
  response.json(result.user);
};

export const logout: RequestHandler = async (request, response) => {
  await authService.logout(
    readSessionCookie(request.headers.cookie),
    request.requestId,
  );
  clearSessionCookie(response);
  response.status(204).end();
};

export const verifyEmail: RequestHandler = async (request, response) => {
  await authService.verifyEmail(request.body.token, request.requestId);
  response.json({ message: "Email address verified" });
};

export const resendVerification: RequestHandler = async (request, response) => {
  await authService.resendVerification(request.body.email, request.requestId);
  response.status(202).json({
    message:
      "If the account needs verification, instructions will be sent to its email address.",
  });
};

export const requestPasswordReset: RequestHandler = async (
  request,
  response,
) => {
  await authService.requestPasswordReset(request.body.email, request.requestId);
  response.status(202).json({
    message:
      "If an active account uses that email, password reset instructions will be sent.",
  });
};

export const resetPassword: RequestHandler = async (request, response) => {
  await authService.resetPassword(
    request.body.token,
    request.body.password,
    request.requestId,
  );
  clearSessionCookie(response);
  response.status(204).end();
};

export const getCurrentUser: RequestHandler = async (request, response) => {
  if (!request.auth) {
    throw new AppError(401, "UNAUTHENTICATED", "Sign in to continue");
  }

  response.json(await authService.getAuthenticatedUser(request.auth.userId));
};

export const updateCurrentProfile: RequestHandler = async (
  request,
  response,
) => {
  if (!request.auth) {
    throw new AppError(401, "UNAUTHENTICATED", "Sign in to continue");
  }

  response.json(
    await authService.updateProfile(
      request.auth.userId,
      request.body,
      request.requestId,
    ),
  );
};
