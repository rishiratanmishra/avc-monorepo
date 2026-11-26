import { getDatabase } from "@repo/database";
import { accessService } from "../access/access.container.js";
import { AdminUserService } from "./admin-user.service.js";
import { PasswordService } from "./password.service.js";
import { ResendEmailService } from "./resend-email.service.js";

export const adminUserService = new AdminUserService(
  getDatabase(),
  new PasswordService(),
  new ResendEmailService(),
  accessService,
);
