import type { RequestHandler } from "express";
import { HealthResponseSchema } from "@repo/contracts/models/api";
import { AppError } from "../../errors/app-error.js";
import { checkReadiness, getHealth } from "./health.service.js";

export const getHealthStatus: RequestHandler = (_request, response) => {
  response.json(HealthResponseSchema.parse(getHealth()));
};

export const getReadinessStatus: RequestHandler = async (
  _request,
  response,
  next,
) => {
  try {
    await checkReadiness();
    response.json(HealthResponseSchema.parse(getHealth()));
  } catch (error) {
    console.error("MySQL readiness check failed", error);
    next(
      new AppError(
        503,
        "SERVICE_UNAVAILABLE",
        "The API is running but a required dependency is unavailable",
        undefined,
        { cause: error },
      ),
    );
  }
};
