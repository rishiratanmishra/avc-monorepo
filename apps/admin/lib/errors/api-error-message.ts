import { ApiError } from "@repo/api-client";

/** Converts API/transport failures into form-level messages. Field validation stays in Zod/Formik. */
export function apiErrorMessage(
  error: unknown,
  fallback = "The request could not be completed. Please try again.",
): string {
  if (!(error instanceof ApiError)) {
    return fallback;
  }
  if (error.status === 0) {
    return "The service is unavailable. Check your connection and try again.";
  }
  if (error.code === "VALIDATION_ERROR") {
    return "Please check the entered details and try again.";
  }
  return error.message || fallback;
}
