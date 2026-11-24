import {
  AssignableHospitalRoleCodeSchema,
  InviteMemberSchema,
  UpdateMembershipStatusSchema,
} from "@repo/contracts";
import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../../middleware/validate-body.js";
import { validateParams } from "../../middleware/validate-params.js";
import { accessService } from "./access.container.js";
import { requireAccessAuthentication, requireHospitalPermission } from "./access.middleware.js";
import {
  addMembershipRole,
  inviteMember,
  listMemberships,
  removeMembershipRole,
  updateMembershipStatus,
} from "./hospital.controller.js";

export const hospitalRouter = Router();

hospitalRouter.use((_request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  next();
});
hospitalRouter.use(requireAccessAuthentication(accessService));

const hospitalParams = z.object({ hospitalId: z.uuid() });
const membershipParams = hospitalParams.extend({ membershipId: z.uuid() });
const membershipRoleParams = membershipParams.extend({
  roleCode: AssignableHospitalRoleCodeSchema,
});

hospitalRouter.get(
  "/:hospitalId/memberships",
  validateParams(hospitalParams),
  requireHospitalPermission(accessService, "hospital.members.manage"),
  listMemberships,
);
hospitalRouter.post(
  "/:hospitalId/invitations",
  validateParams(hospitalParams),
  requireHospitalPermission(accessService, "hospital.members.manage"),
  validateBody(InviteMemberSchema),
  inviteMember,
);
hospitalRouter.patch(
  "/:hospitalId/memberships/:membershipId",
  validateParams(membershipParams),
  requireHospitalPermission(accessService, "hospital.members.manage"),
  validateBody(UpdateMembershipStatusSchema),
  updateMembershipStatus,
);
hospitalRouter.put(
  "/:hospitalId/memberships/:membershipId/roles/:roleCode",
  validateParams(membershipRoleParams),
  requireHospitalPermission(accessService, "hospital.members.manage"),
  addMembershipRole,
);
hospitalRouter.delete(
  "/:hospitalId/memberships/:membershipId/roles/:roleCode",
  validateParams(membershipRoleParams),
  requireHospitalPermission(accessService, "hospital.members.manage"),
  removeMembershipRole,
);
