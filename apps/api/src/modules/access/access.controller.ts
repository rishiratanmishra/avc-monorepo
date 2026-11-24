import type { RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../../errors/app-error.js";
import { accessService, hospitalAdministrationService } from "./access.container.js";
import { assertPrincipal, getRequestMetadata } from "./access.middleware.js";

const hospitalIdParamsSchema = z.object({ hospitalId: z.uuid() });

function hospitalIdFrom(request: Parameters<RequestHandler>[0]): string {
  const params = hospitalIdParamsSchema.safeParse(request.params);
  if (!params.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Invalid hospital ID", params.error.issues);
  }

  return params.data.hospitalId;
}

export const getAccessContext: RequestHandler = async (request, response) => {
  response.json(await accessService.loadContext(assertPrincipal(request)));
};

export const selectWorkspace: RequestHandler = async (request, response) => {
  response.json(
    await accessService.selectWorkspace(
      assertPrincipal(request),
      request.body,
      getRequestMetadata(request),
    ),
  );
};

export const clearWorkspace: RequestHandler = async (request, response) => {
  response.json(
    await accessService.clearWorkspace(assertPrincipal(request), getRequestMetadata(request)),
  );
};

export const acceptInvitation: RequestHandler = async (request, response) => {
  response.json(
    await hospitalAdministrationService.acceptInvitation(
      assertPrincipal(request),
      request.body.token,
      getRequestMetadata(request),
    ),
  );
};

export const getClientRelationship: RequestHandler = async (request, response) => {
  response.json(
    await accessService.getClientRelationship(
      assertPrincipal(request),
      hospitalIdFrom(request),
      getRequestMetadata(request),
    ),
  );
};
