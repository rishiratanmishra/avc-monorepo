import type { RequestHandler } from "express";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";

const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);
const allowedOrigins = new Set([...env.corsOrigins, env.appOrigin]);

export const requireTrustedOrigin: RequestHandler = (
  request,
  _response,
  next,
) => {
  if (safeMethods.has(request.method)) {
    next();
    return;
  }

  const source = request.get("origin") ?? request.get("referer");

  if (!source) {
    next(
      new AppError(
        403,
        "UNTRUSTED_ORIGIN",
        "A trusted browser origin is required",
      ),
    );
    return;
  }

  let origin: string;

  try {
    origin = new URL(source).origin;
  } catch {
    next(new AppError(403, "UNTRUSTED_ORIGIN", "Request origin is invalid"));
    return;
  }

  if (!allowedOrigins.has(origin)) {
    next(
      new AppError(403, "UNTRUSTED_ORIGIN", "Request origin is not allowed"),
    );
    return;
  }

  next();
};
