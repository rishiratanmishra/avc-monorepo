import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { type EmailOutboxRecord, type NewEmailOutboxRecord } from "@repo/database";
import { Resend } from "resend";
import { env } from "../../config/env.js";
import { AppError } from "../../errors/app-error.js";

export class ResendEmailService {
  private readonly client = env.resendApiKey ? new Resend(env.resendApiKey) : undefined;

  assertConfigured(): void {
    this.getConfiguration();
  }

  prepareVerificationEmail(recipient: string, token: string): NewEmailOutboxRecord {
    return this.prepare(recipient, "email_verification", token);
  }

  preparePasswordResetEmail(recipient: string, token: string): NewEmailOutboxRecord {
    return this.prepare(recipient, "password_reset", token);
  }

  prepareHospitalInvitationEmail(recipient: string, token: string): NewEmailOutboxRecord {
    return this.prepare(recipient, "hospital_invitation", token);
  }

  async send(outboxRecord: EmailOutboxRecord): Promise<void> {
    const { client, from } = this.getConfiguration();
    const token = this.decryptToken(outboxRecord.encryptedPayload);
    const path = {
      email_verification: "/verify-email",
      password_reset: "/reset-password",
      hospital_invitation: "/accept-invitation",
    }[outboxRecord.type];
    const link = new URL(path, env.appOrigin);
    link.hash = `token=${encodeURIComponent(token)}`;

    const subject = {
      email_verification: "Verify your AVC Pet Hospital account",
      password_reset: "Reset your AVC Pet Hospital password",
      hospital_invitation: "You are invited to AVC Pet Hospital",
    }[outboxRecord.type];
    const intro = {
      email_verification: "Verify your email address to activate your AVC Pet Hospital account.",
      password_reset: "A password reset was requested for your AVC Pet Hospital account.",
      hospital_invitation: "You have been invited to join an AVC Pet Hospital workspace.",
    }[outboxRecord.type];
    const action = {
      email_verification: "Verify email",
      password_reset: "Reset password",
      hospital_invitation: "Accept invitation",
    }[outboxRecord.type];
    const ignore = {
      email_verification: "If you did not create an account, you can ignore this email.",
      password_reset: "If you did not request this, you can ignore this email.",
      hospital_invitation: "If you were not expecting this invitation, you can ignore this email.",
    }[outboxRecord.type];

    try {
      const result = await client.emails.send(
        {
          from,
          to: outboxRecord.recipient,
          subject,
          text: `${intro}\n\n${action}: ${link.toString()}\n\n${ignore}`,
          html: `<p>${intro}</p><p><a href="${link.toString()}">${action}</a></p><p>${ignore}</p>`,
        },
        { idempotencyKey: outboxRecord.id },
      );

      if (result.error) {
        console.error("Resend rejected an email delivery request", {
          outboxId: outboxRecord.id,
          errorName: result.error.name,
        });
        throw new AppError(503, "EMAIL_DELIVERY_FAILED", "Email could not be delivered");
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error("Resend email delivery request failed", {
        outboxId: outboxRecord.id,
      });
      throw new AppError(503, "EMAIL_DELIVERY_FAILED", "Email could not be delivered");
    }
  }

  private prepare(
    recipient: string,
    type: "email_verification" | "password_reset" | "hospital_invitation",
    token: string,
  ): NewEmailOutboxRecord {
    this.assertConfigured();
    return {
      id: randomBytes(16).toString("hex"),
      recipient,
      type,
      encryptedPayload: this.encryptToken(token),
    };
  }

  private encryptToken(token: string): string {
    const key = this.getEncryptionKey();
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);

    return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString("base64url");
  }

  private decryptToken(payload: string): string {
    const encrypted = Buffer.from(payload, "base64url");
    const iv = encrypted.subarray(0, 12);
    const authTag = encrypted.subarray(12, 28);
    const ciphertext = encrypted.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", this.getEncryptionKey(), iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  }

  private getEncryptionKey(): Buffer {
    if (!env.emailTokenEncryptionKey) {
      throw new AppError(
        503,
        "EMAIL_DELIVERY_UNAVAILABLE",
        "Email token encryption is not configured",
      );
    }

    return Buffer.from(env.emailTokenEncryptionKey, "hex");
  }

  private getConfiguration(): { client: Resend; from: string } {
    if (!this.client || !env.emailFrom || !env.emailTokenEncryptionKey) {
      throw new AppError(503, "EMAIL_DELIVERY_UNAVAILABLE", "Email delivery is not configured");
    }

    return { client: this.client, from: env.emailFrom };
  }
}
