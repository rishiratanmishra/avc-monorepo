import { AcceptInvitationSchema, SelectWorkspaceSchema } from "@repo/contracts";
import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../../middleware/validate-body.js";
import { validateParams } from "../../middleware/validate-params.js";
import {
  acceptInvitation,
  clearWorkspace,
  getAccessContext,
  getClientRelationship,
  selectWorkspace,
} from "./access.controller.js";
import { accessService } from "./access.container.js";
import { requireAccessAuthentication, requireClientPermission } from "./access.middleware.js";

export const accessRouter = Router();

accessRouter.use((_request, response, next) => {
  response.setHeader("Cache-Control", "no-store");
  next();
});
accessRouter.use(requireAccessAuthentication(accessService));

accessRouter.get("/context", getAccessContext);
accessRouter.post("/workspace", validateBody(SelectWorkspaceSchema), selectWorkspace);
accessRouter.delete("/workspace", clearWorkspace);
accessRouter.post("/invitations/accept", validateBody(AcceptInvitationSchema), acceptInvitation);
accessRouter.get(
  "/client/:hospitalId/relationship",
  validateParams(z.object({ hospitalId: z.uuid() })),
  requireClientPermission(accessService, "client.records.read"),
  getClientRelationship,
);
