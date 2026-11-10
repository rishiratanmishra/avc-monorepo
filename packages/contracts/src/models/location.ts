import { z } from "zod";

export const LocationSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(120),
  address: z.string().trim().min(1).max(1000),
  phone: z.string().trim().min(7).max(32).nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const CreateLocationSchema = LocationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Location = z.infer<typeof LocationSchema>;
export type CreateLocationInput = z.infer<typeof CreateLocationSchema>;
