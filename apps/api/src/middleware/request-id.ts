import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export const attachRequestId: RequestHandler = (request, response, next) => {
  request.requestId = randomUUID();
  response.setHeader("X-Request-Id", request.requestId);
  next();
};
