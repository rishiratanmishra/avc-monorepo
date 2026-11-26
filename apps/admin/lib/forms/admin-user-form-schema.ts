import { ADMIN_CREATABLE_ROLE_CODES, type AdminCreateUserInput } from "@repo/contracts";
import { z } from "zod";

export const createUserFormSchema = z
  .strictObject({
    firstName: z
      .string()
      .trim()
      .min(1, "Enter the first name.")
      .max(100, "First name is too long."),
    lastName: z.string().trim().min(1, "Enter the last name.").max(100, "Last name is too long."),
    email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
    password: z.string().min(15, "Use at least 15 characters.").max(128, "Password is too long."),
    confirmPassword: z.string().min(1, "Confirm the password."),
    roleCode: z.enum(ADMIN_CREATABLE_ROLE_CODES),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;

export const emptyCreateUserValues: CreateUserFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  roleCode: "pet_owner",
};

export function toAdminCreateUserInput(values: CreateUserFormValues): AdminCreateUserInput {
  return {
    email: values.email,
    password: values.password,
    profile: {
      firstName: values.firstName,
      lastName: values.lastName,
      locale: "en-IN",
      timeZone: "Asia/Kolkata",
    },
    roleCode: values.roleCode,
  };
}
