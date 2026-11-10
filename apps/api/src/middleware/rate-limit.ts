import { rateLimit } from "express-rate-limit";
import { AppError } from "../errors/app-error.js";

function createLimiter(limit: number, windowMs: number) {
  return rateLimit({
    limit,
    windowMs,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (_request, _response, next) => {
      next(
        new AppError(
          429,
          "RATE_LIMITED",
          "Too many requests. Please try again later",
        ),
      );
    },
  });
}

export const loginRateLimit = createLimiter(10, 15 * 60 * 1000);
export const emailActionRateLimit = createLimiter(5, 60 * 60 * 1000);
