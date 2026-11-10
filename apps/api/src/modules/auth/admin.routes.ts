import { Router } from "express";
import {
  requireAuthentication,
  requireRole,
} from "../../middleware/authenticate.js";
import { assignRole, revokeRole } from "./admin.controller.js";

export const adminRouter = Router();

adminRouter.use(requireAuthentication, requireRole("admin"));
adminRouter.put("/users/:userId/roles/:roleCode", assignRole);
adminRouter.delete("/users/:userId/roles/:roleCode", revokeRole);
