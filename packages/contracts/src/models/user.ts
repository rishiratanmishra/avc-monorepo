import { z } from "zod";

export const USER_STATUSES = [
  "pending_verification",
  "active",
  "suspended",
  "deactivated",
] as const;

export const USER_ROLE_CODES = [
  "pet_owner",
  "veterinarian",
  "receptionist",
  "staff",
  "admin",
] as const;

export const UserStatusSchema = z.enum(USER_STATUSES);
export const UserRoleCodeSchema = z.enum(USER_ROLE_CODES);

const emailSchema = z.string().trim().toLowerCase().pipe(z.email());
const passwordSchema = z
  .string()
  .min(15, "Password must be at least 15 characters")
  .max(128, "Password must be at most 128 characters")
  .refine((password) => password.trim().length > 0, "Password cannot be blank");
const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, "Phone number must use E.164 format")
  .nullable();

export const UserSchema = z.strictObject({
  id: z.uuid(),
  email: emailSchema,
  status: UserStatusSchema,
  emailVerifiedAt: z.iso.datetime().nullable(),
  passwordChangedAt: z.iso.datetime().nullable(),
  lastLoginAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const UserProfileSchema = z.strictObject({
  userId: z.uuid(),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  preferredName: z.string().trim().min(1).max(100).nullable(),
  phone: phoneSchema,
  phoneVerifiedAt: z.iso.datetime().nullable(),
  avatarUrl: z.url().max(2048).nullable(),
  addressLine1: z.string().trim().min(1).max(255).nullable(),
  addressLine2: z.string().trim().min(1).max(255).nullable(),
  city: z.string().trim().min(1).max(100).nullable(),
  state: z.string().trim().min(1).max(100).nullable(),
  postalCode: z.string().trim().min(1).max(20).nullable(),
  countryCode: z
    .string()
    .regex(/^[A-Z]{2}$/)
    .nullable(),
  locale: z.string().trim().min(2).max(20),
  timeZone: z.string().trim().min(1).max(64),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const CreateUserProfileSchema = UserProfileSchema.omit({
  userId: true,
  phoneVerifiedAt: true,
  createdAt: true,
  updatedAt: true,
})
  .extend({
    preferredName: z.string().trim().min(1).max(100).nullable().optional(),
    phone: phoneSchema.optional(),
    avatarUrl: z.url().max(2048).nullable().optional(),
    addressLine1: z.string().trim().min(1).max(255).nullable().optional(),
    addressLine2: z.string().trim().min(1).max(255).nullable().optional(),
    city: z.string().trim().min(1).max(100).nullable().optional(),
    state: z.string().trim().min(1).max(100).nullable().optional(),
    postalCode: z.string().trim().min(1).max(20).nullable().optional(),
    countryCode: z
      .string()
      .regex(/^[A-Z]{2}$/)
      .nullable()
      .optional(),
    locale: z.string().trim().min(2).max(20).default("en-IN"),
    timeZone: z.string().trim().min(1).max(64).default("Asia/Kolkata"),
  })
  .strict();

export const UpdateUserProfileSchema = UserProfileSchema.omit({
  userId: true,
  phoneVerifiedAt: true,
  createdAt: true,
  updatedAt: true,
})
  .partial()
  .strict()
  .refine((profile) => Object.keys(profile).length > 0, {
    message: "At least one profile field must be provided",
  });

export const CreateAccountSchema = z.strictObject({
  email: emailSchema,
  password: passwordSchema,
  profile: CreateUserProfileSchema,
});

export const LoginSchema = z.strictObject({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const EmailInputSchema = z.strictObject({
  email: emailSchema,
});

export const VerifyEmailSchema = z.strictObject({
  token: z.string().min(40).max(256),
});

export const ResetPasswordSchema = z.strictObject({
  token: z.string().min(40).max(256),
  password: passwordSchema,
});

export const UserRoleSchema = z.strictObject({
  code: UserRoleCodeSchema,
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).nullable(),
});

export const UserWithRolesSchema = UserSchema.extend({
  roles: z.array(UserRoleCodeSchema),
}).strict();

export const AuthenticatedUserSchema = z.strictObject({
  user: UserSchema,
  profile: UserProfileSchema,
  roles: z.array(UserRoleCodeSchema),
});

export type UserStatus = z.infer<typeof UserStatusSchema>;
export type UserRoleCode = z.infer<typeof UserRoleCodeSchema>;
export type User = z.infer<typeof UserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type CreateUserProfileInput = z.infer<typeof CreateUserProfileSchema>;
export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>;
export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type EmailInput = z.infer<typeof EmailInputSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserWithRoles = z.infer<typeof UserWithRolesSchema>;
export type AuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;
