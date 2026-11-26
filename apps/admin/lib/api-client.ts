import { createApiClient } from "@repo/api-client";

/** Same-origin browser client. Server pages use `createServerApiClient` instead. */
export function getAdminApiClient() {
  return createApiClient({ baseUrl: "" });
}
