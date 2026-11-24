import { ResendEmailService } from "../auth/resend-email.service.js";
import { AccessService } from "./access.service.js";
import { DrizzleAccessRepository } from "./drizzle-access.repository.js";
import { HospitalAdministrationService } from "./hospital-administration.service.js";

export const accessRepository = new DrizzleAccessRepository();
export const accessService = new AccessService(accessRepository);
export const hospitalAdministrationService = new HospitalAdministrationService(
  accessRepository,
  accessService,
  new ResendEmailService(),
);
