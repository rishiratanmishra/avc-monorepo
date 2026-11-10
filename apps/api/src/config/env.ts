import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "node:url";
import { z } from "zod";

loadEnv({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

const optionalTrimmedString = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().min(1).optional(),
);
const optionalEncryptionKey = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z
    .string()
    .regex(
      /^[a-fA-F0-9]{64}$/,
      "Email token encryption key must be 32 bytes encoded as 64 hex characters",
    )
    .optional(),
);

const originsSchema = z
  .string()
  .default("http://localhost:3000")
  .transform((value) =>
    value
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.url()).min(1));

const envSchema = z
  .object({
    PORT: z.coerce.number().int().min(1).max(65535).default(4000),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    CORS_ORIGINS: originsSchema,
    APP_ORIGIN: z.url().default("http://localhost:3000"),
    RESEND_API_KEY: optionalTrimmedString,
    EMAIL_FROM: optionalTrimmedString,
    EMAIL_TOKEN_ENCRYPTION_KEY: optionalEncryptionKey,
    SESSION_TTL_DAYS: z.coerce.number().int().min(1).max(30).default(7),
  })
  .superRefine((config, context) => {
    if (
      Boolean(config.RESEND_API_KEY) !== Boolean(config.EMAIL_FROM) ||
      Boolean(config.RESEND_API_KEY) !==
        Boolean(config.EMAIL_TOKEN_ENCRYPTION_KEY)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "RESEND_API_KEY, EMAIL_FROM, and EMAIL_TOKEN_ENCRYPTION_KEY must be configured together",
      });
    }

    if (config.NODE_ENV === "production") {
      if (
        !config.RESEND_API_KEY ||
        !config.EMAIL_FROM ||
        !config.EMAIL_TOKEN_ENCRYPTION_KEY
      ) {
        context.addIssue({
          code: "custom",
          message:
            "Resend email and token encryption settings are required in production",
        });
      }

      if (!config.APP_ORIGIN.startsWith("https://")) {
        context.addIssue({
          code: "custom",
          message: "APP_ORIGIN must use HTTPS in production",
        });
      }
    }
  });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Invalid API environment: ${parsedEnv.error.message}`);
}

export const env = {
  port: parsedEnv.data.PORT,
  nodeEnv: parsedEnv.data.NODE_ENV,
  corsOrigins: parsedEnv.data.CORS_ORIGINS,
  appOrigin: new URL(parsedEnv.data.APP_ORIGIN).origin,
  resendApiKey: parsedEnv.data.RESEND_API_KEY,
  emailFrom: parsedEnv.data.EMAIL_FROM,
  emailTokenEncryptionKey: parsedEnv.data.EMAIL_TOKEN_ENCRYPTION_KEY,
  sessionTtlDays: parsedEnv.data.SESSION_TTL_DAYS,
  isProduction: parsedEnv.data.NODE_ENV === "production",
};
