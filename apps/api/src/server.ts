import { app } from "./app.js";
import { env } from "./config/env.js";
import { closeDatabase } from "@repo/database";
import { EmailOutboxWorker } from "./modules/auth/email-outbox.worker.js";

const server = app.listen(env.port, () => {
  console.info(`AVC API listening on http://localhost:${env.port}`);
});
const emailOutboxWorker = new EmailOutboxWorker();

emailOutboxWorker.start();

let isShuttingDown = false;

function shutdown(signal: NodeJS.Signals) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.info(`${signal} received; shutting down AVC API`);

  void emailOutboxWorker
    .stop()
    .then(
      () =>
        new Promise<void>((resolve, reject) => {
          server.close((serverError) => {
            if (serverError) {
              reject(serverError);
              return;
            }

            resolve();
          });
        }),
    )
    .then(() => closeDatabase())
    .catch((error: unknown) => {
      console.error("Failed to shut down AVC API cleanly", {
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
      process.exitCode = 1;
    });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
