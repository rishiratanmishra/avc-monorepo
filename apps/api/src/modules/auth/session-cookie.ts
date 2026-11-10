import type { CookieOptions, Response } from "express";
import { env } from "../../config/env.js";

export const SESSION_COOKIE_NAME = "avc_session";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax",
  path: "/",
};

export function setSessionCookie(response: Response, token: string): void {
  response.cookie(SESSION_COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: env.sessionTtlDays * 24 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(response: Response): void {
  response.clearCookie(SESSION_COOKIE_NAME, cookieOptions);
}

export function readSessionCookie(cookieHeader?: string): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  const prefix = `${SESSION_COOKIE_NAME}=`;
  const entry = cookieHeader
    .split(";")
    .find((part) => part.trim().startsWith(prefix));

  if (!entry) {
    return undefined;
  }

  const value = entry.trim().slice(prefix.length);

  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
}
