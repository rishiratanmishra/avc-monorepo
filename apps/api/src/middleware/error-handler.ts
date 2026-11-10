import type { ErrorRequestHandler } from "express";
import { ApiErrorResponseSchema } from "@repo/contracts/models/api";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next,
) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json(
      ApiErrorResponseSchema.parse({
        error: {
          code: error.code,
          message: error.message,
          ...(error.details === undefined ? {} : { details: error.details }),
        },
      }),
    );
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json(
      ApiErrorResponseSchema.parse({
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
      }),
    );
    return;
  }

  const status =
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number" &&
    error.status >= 400 &&
    error.status < 500
      ? error.status
      : 500;

  if (status === 500) {
    console.error("Unhandled API error", {
      requestId: response.getHeader("X-Request-Id"),
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
  }

  response.status(status).json(
    ApiErrorResponseSchema.parse({
      error: {
        code:
          status === 413
            ? "REQUEST_TOO_LARGE"
            : status === 400
              ? "MALFORMED_REQUEST"
              : status === 500
                ? "INTERNAL_SERVER_ERROR"
                : "REQUEST_ERROR",
        message:
          status === 413
            ? "Request body is too large"
            : status === 400
              ? "Request body is malformed"
              : status === 500
                ? "An unexpected error occurred"
                : "Request could not be processed",
      },
    }),
  );
};
