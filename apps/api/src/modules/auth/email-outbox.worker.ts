import {
  authSessions,
  authTokens,
  emailOutbox,
  getDatabase,
} from "@repo/database";
import { and, asc, eq, isNull, lte, lt, or, sql } from "drizzle-orm";
import { ResendEmailService } from "./resend-email.service.js";

type Database = ReturnType<typeof getDatabase>;

const pollIntervalMs = 5_000;
const staleLockMs = 5 * 60 * 1000;
const maxAttempts = 8;
const batchSize = 10;
const cleanupIntervalMs = 60 * 60 * 1000;
const terminalJobRetentionMs = 30 * 24 * 60 * 60 * 1000;

export class EmailOutboxWorker {
  private interval: NodeJS.Timeout | undefined;
  private activeBatch: Promise<void> | undefined;
  private lastCleanupAt = 0;

  constructor(
    private readonly database: Database = getDatabase(),
    private readonly email = new ResendEmailService(),
  ) {}

  start(): void {
    if (this.interval) {
      return;
    }

    this.runBatch();
    this.interval = setInterval(() => {
      this.runBatch();
    }, pollIntervalMs);
    this.interval.unref();
  }

  async stop(): Promise<void> {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }

    await this.activeBatch;
  }

  private runBatch(): void {
    if (this.activeBatch) {
      return;
    }

    this.activeBatch = this.processBatch().finally(() => {
      this.activeBatch = undefined;
    });
  }

  private async processBatch(): Promise<void> {
    try {
      if (Date.now() - this.lastCleanupAt >= cleanupIntervalMs) {
        await this.cleanupExpiredData();
        this.lastCleanupAt = Date.now();
      }

      for (let index = 0; index < batchSize; index += 1) {
        const job = await this.claimNext();
        if (!job) {
          break;
        }

        await this.process(job);
      }
    } catch (error) {
      console.error("Email outbox worker failed", {
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
    }
  }

  private async cleanupExpiredData(): Promise<void> {
    const now = new Date();
    const terminalJobCutoff = new Date(now.getTime() - terminalJobRetentionMs);

    await this.database
      .delete(authSessions)
      .where(lt(authSessions.expiresAt, now));
    await this.database.delete(authTokens).where(lt(authTokens.expiresAt, now));
    await this.database
      .delete(emailOutbox)
      .where(
        and(
          lt(emailOutbox.createdAt, terminalJobCutoff),
          or(eq(emailOutbox.status, "sent"), eq(emailOutbox.status, "failed")),
        ),
      );
  }

  private async claimNext() {
    const now = new Date();
    const staleLock = new Date(now.getTime() - staleLockMs);

    return this.database.transaction(async (transaction) => {
      const [job] = await transaction
        .select()
        .from(emailOutbox)
        .where(
          or(
            and(
              eq(emailOutbox.status, "pending"),
              lte(emailOutbox.availableAt, now),
            ),
            and(
              eq(emailOutbox.status, "processing"),
              or(
                isNull(emailOutbox.lockedAt),
                lt(emailOutbox.lockedAt, staleLock),
              ),
            ),
          ),
        )
        .orderBy(asc(emailOutbox.createdAt))
        .for("update", { skipLocked: true })
        .limit(1);

      if (!job) {
        return undefined;
      }

      await transaction
        .update(emailOutbox)
        .set({
          status: "processing",
          attempts: sql`${emailOutbox.attempts} + 1`,
          lockedAt: now,
        })
        .where(eq(emailOutbox.id, job.id));

      return {
        ...job,
        status: "processing" as const,
        attempts: job.attempts + 1,
        lockedAt: now,
      };
    });
  }

  private async process(
    job: NonNullable<Awaited<ReturnType<typeof this.claimNext>>>,
  ): Promise<void> {
    try {
      await this.email.send(job);
      await this.database
        .update(emailOutbox)
        .set({
          status: "sent",
          sentAt: new Date(),
          lockedAt: null,
          lastError: null,
          encryptedPayload: "",
        })
        .where(
          and(eq(emailOutbox.id, job.id), eq(emailOutbox.status, "processing")),
        );
    } catch (error) {
      const attempts = job.attempts;
      const permanentlyFailed = attempts >= maxAttempts;
      const retryDelayMs = Math.min(
        30_000 * 2 ** (attempts - 1),
        6 * 60 * 60 * 1000,
      );

      await this.database
        .update(emailOutbox)
        .set({
          status: permanentlyFailed ? "failed" : "pending",
          availableAt: new Date(Date.now() + retryDelayMs),
          lockedAt: null,
          lastError: "Email provider delivery failed",
        })
        .where(
          and(eq(emailOutbox.id, job.id), eq(emailOutbox.status, "processing")),
        );

      console.error("Email outbox delivery failed", {
        outboxId: job.id,
        attempts,
        permanentlyFailed,
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
    }
  }
}
