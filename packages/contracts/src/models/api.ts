import { z } from "zod";

export const HealthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.string(),
  timestamp: z.iso.datetime(),
});

export const ApiErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const IdParamSchema = z.object({
  id: z.uuid(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type IdParam = z.infer<typeof IdParamSchema>;
