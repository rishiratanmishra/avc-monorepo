import { z } from "zod";

export const signInFormSchema = z.object({
  email: z
    .string()
    .trim()
    .regex(/^\S+@\S+\.\S+$/, "Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const registrationFormSchema = z
  .object({
    firstName: z.string().trim().min(1, "Enter your first name."),
    lastName: z.string().trim().min(1, "Enter your last name."),
    email: z
      .string()
      .trim()
      .regex(/^\S+@\S+\.\S+$/, "Enter a valid email address."),
    password: z.string().min(15, "Use at least 15 characters."),
    confirmPassword: z.string(),
  })
  .superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export type AuthFormValues = z.infer<typeof registrationFormSchema>;

export const authFormInitialValues: AuthFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};
