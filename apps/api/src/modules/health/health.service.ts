import { checkDatabaseConnection } from "@repo/database";

export function getHealth() {
  return {
    status: "ok" as const,
    service: "avc-api",
    timestamp: new Date().toISOString(),
  };
}

export async function checkReadiness(): Promise<void> {
  await checkDatabaseConnection();
}
