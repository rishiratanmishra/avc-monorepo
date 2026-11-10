import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { AppError } from "../errors/app-error.js";

export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      next(
        new AppError(
          400,
          "VALIDATION_ERROR",
          "Request body validation failed",
          result.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        ),
      );
      return;
    }

    request.body = result.data;
    next();
  };
}
