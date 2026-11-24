import type { RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../../errors/app-error.js";
import { assertPrincipal, getRequestMetadata } from "./access.middleware.js";
import { hospitalAdministrationService } from "./access.container.js";

const hospitalIdParamsSchema = z.object({ hospitalId: z.uuid() });

export const listHospitals: RequestHandler = async (request, response) => {
  response.json(
    await hospitalAdministrationService.listHospitals(
      assertPrincipal(request),
      getRequestMetadata(request),
    ),
  );
};

export const createHospital: RequestHandler = async (request, response) => {
  const hospital = await hospitalAdministrationService.createHospital(
    assertPrincipal(request),
    request.body,
    getRequestMetadata(request),
  );
  response.status(201).json(hospital);
};

export const updateHospitalStatus: RequestHandler = async (request, response) => {
  const params = hospitalIdParamsSchema.safeParse(request.params);
  if (!params.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Invalid hospital ID", params.error.issues);
  }

  await hospitalAdministrationService.setHospitalStatus(
    assertPrincipal(request),
    params.data.hospitalId,
    request.body.status,
    getRequestMetadata(request),
  );
  response.status(204).end();
};
