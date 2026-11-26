import { ASSIGNABLE_HOSPITAL_ROLE_CODES, type AssignableHospitalRoleCode } from "@repo/contracts";
import { z } from "zod";

export const inviteMemberFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter the invitee's email address.")
    .toLowerCase()
    .regex(/^\S+@\S+\.\S+$/, "Enter a valid email address."),
  roleCode: z.enum(ASSIGNABLE_HOSPITAL_ROLE_CODES, {
    error: "Choose an assignable hospital role.",
  }),
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberFormSchema>;

export const emptyInviteMemberValues: InviteMemberFormValues = {
  email: "",
  roleCode: "receptionist",
};

export function toInviteMemberInput(values: InviteMemberFormValues): {
  email: string;
  roleCode: AssignableHospitalRoleCode;
} {
  return { email: values.email, roleCode: values.roleCode };
}
