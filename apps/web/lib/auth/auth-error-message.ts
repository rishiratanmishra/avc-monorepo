import { ApiError } from "@repo/api-client";

/**
 * Converts a failed auth request into a user-facing, form-level message.
 * Field validation stays in Formik; this helper only handles server/transport failures.
 */
export function authErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!(error instanceof ApiError)) {
    return fallback;
  }

  if (error.status === 0) {
    return "The service is unavailable. Check your connection and try again.";
  }
  if (error.code === "INVALID_CREDENTIALS") {
    return "The email or password is incorrect.";
  }
  if (error.code === "ACCOUNT_SUSPENDED") {
    return "This account is suspended. Contact your administrator.";
  }
  if (error.code === "EMAIL_NOT_VERIFIED") {
    return "Verify your email address before signing in.";
  }
  return error.message || "The request could not be completed.";
}
