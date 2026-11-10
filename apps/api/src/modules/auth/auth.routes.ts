import { Router } from "express";
import {
  CreateAccountSchema,
  EmailInputSchema,
  LoginSchema,
  ResetPasswordSchema,
  UpdateUserProfileSchema,
  VerifyEmailSchema,
} from "@repo/contracts/models/user";
import { requireAuthentication } from "../../middleware/authenticate.js";
import {
  emailActionRateLimit,
  loginRateLimit,
} from "../../middleware/rate-limit.js";
import { validateBody } from "../../middleware/validate-body.js";
import {
  getCurrentUser,
  login,
  logout,
  register,
  requestPasswordReset,
  resendVerification,
  resetPassword,
  updateCurrentProfile,
  verifyEmail,
} from "./auth.controller.js";

export const authRouter = Router();

authRouter.use((_request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  next();
});

authRouter.post(
  "/register",
  emailActionRateLimit,
  validateBody(CreateAccountSchema),
  register,
);
authRouter.post("/login", loginRateLimit, validateBody(LoginSchema), login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuthentication, getCurrentUser);
authRouter.patch(
  "/profile",
  requireAuthentication,
  validateBody(UpdateUserProfileSchema),
  updateCurrentProfile,
);
authRouter.post(
  "/verify-email",
  emailActionRateLimit,
  validateBody(VerifyEmailSchema),
  verifyEmail,
);
authRouter.post(
  "/resend-verification",
  emailActionRateLimit,
  validateBody(EmailInputSchema),
  resendVerification,
);
authRouter.post(
  "/request-password-reset",
  emailActionRateLimit,
  validateBody(EmailInputSchema),
  requestPasswordReset,
);
authRouter.post(
  "/reset-password",
  emailActionRateLimit,
  validateBody(ResetPasswordSchema),
  resetPassword,
);
