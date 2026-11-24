import { API_SESSION_COOKIE, ApiError, createServerApiClient } from "@repo/api-client";
import type { AccessContext } from "@repo/contracts";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function cookieHeader(): Promise<string | undefined> {
  const store = await cookies();
  const token = store.get(API_SESSION_COOKIE)?.value;
  return token ? `${API_SESSION_COOKIE}=${token}` : undefined;
}

export async function readAccessContext(): Promise<AccessContext> {
  return createServerApiClient().getAccessContext(await cookieHeader());
}

export async function readOptionalAccessContext(): Promise<AccessContext | null> {
  try {
    return await readAccessContext();
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 0)) {
      return null;
    }
    throw error;
  }
}

export async function requireDestination(prefix: string): Promise<AccessContext> {
  let context: AccessContext | null;
  try {
    context = await readAccessContext();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login?reason=expired");
    }
    if (error instanceof ApiError && error.status === 0) {
      redirect("/login?reason=unavailable");
    }
    throw error;
  }

  if (!context) {
    redirect("/login?reason=expired");
  }

  if (!context.activeDestination?.path.startsWith(prefix)) {
    redirect("/workspace?reason=forbidden");
  }

  return context;
}
