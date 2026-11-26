import type { CreateHospitalInput } from "@repo/contracts";
import { z } from "zod";

const optionalText = (max: number, label: string) =>
  z.string().trim().max(max, `${label} is too long.`);

export const createHospitalFormSchema = z.object({
  ownerEmail: z
    .string()
    .trim()
    .min(1, "Enter the owner's email address.")
    .regex(/^\S+@\S+\.\S+$/, "Enter a valid email address."),
  name: z.string().trim().min(1, "Enter the hospital name.").max(120, "Name is too long."),
  slug: z
    .string()
    .trim()
    .min(1, "Enter a URL slug.")
    .max(120, "Slug is too long.")
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  addressLine1: optionalText(255, "Address"),
  city: optionalText(100, "City"),
  state: optionalText(100, "State"),
  postalCode: optionalText(20, "Postal code"),
  countryCode: z
    .string()
    .trim()
    .toUpperCase()
    .refine((value) => value === "" || /^[A-Z]{2}$/.test(value), "Use a two-letter country code."),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\+[1-9]\d{1,14}$/.test(value),
      "Use E.164 format, for example +15551234567.",
    ),
});

export type CreateHospitalFormValues = z.infer<typeof createHospitalFormSchema>;

export const emptyCreateHospitalValues: CreateHospitalFormValues = {
  ownerEmail: "",
  name: "",
  slug: "",
  addressLine1: "",
  city: "",
  state: "",
  postalCode: "",
  countryCode: "",
  phone: "",
};

function optionalValue(value: string): string | undefined {
  return value === "" ? undefined : value;
}

export function toCreateHospitalInput(values: CreateHospitalFormValues): CreateHospitalInput {
  return {
    ownerEmail: values.ownerEmail,
    name: values.name,
    slug: values.slug,
    addressLine1: optionalValue(values.addressLine1),
    city: optionalValue(values.city),
    state: optionalValue(values.state),
    postalCode: optionalValue(values.postalCode),
    countryCode: optionalValue(values.countryCode),
    phone: optionalValue(values.phone),
  };
}
