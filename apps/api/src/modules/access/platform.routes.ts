import { CreateHospitalSchema, UpdateHospitalStatusSchema } from "@repo/contracts";
import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../../middleware/validate-body.js";
import { validateParams } from "../../middleware/validate-params.js";
import { accessService } from "./access.container.js";
import { requireAccessAuthentication, requirePlatformPermission } from "./access.middleware.js";
import { createHospital, listHospitals, updateHospitalStatus } from "./platform.controller.js";

export const platformRouter = Router();

platformRouter.use((_request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  next();
});
platformRouter.use(requireAccessAuthentication(accessService));

platformRouter.get(
  "/hospitals",
  requirePlatformPermission(accessService, "platform.hospitals.manage"),
  listHospitals,
);
platformRouter.post(
  "/hospitals",
  requirePlatformPermission(accessService, "platform.hospitals.manage"),
  validateBody(CreateHospitalSchema),
  createHospital,
);
platformRouter.patch(
  "/hospitals/:hospitalId/status",
  validateParams(z.object({ hospitalId: z.uuid() })),
  requirePlatformPermission(accessService, "platform.hospitals.manage"),
  validateBody(UpdateHospitalStatusSchema),
  updateHospitalStatus,
);
