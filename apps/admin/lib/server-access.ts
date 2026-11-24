import { API_SESSION_COOKIE, ApiError, createServerApiClient } from "@repo/api-client";
import type { AccessContext } from "@repo/contracts";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const appOrigin = process.env.APP_ORIGIN ?? "http://localhost:3000";

export function webUrl(path: string, reason?: string): string {
  const url = new URL(path, appOrigin);
  if (reason) {
    url.searchParams.set("reason", reason);
  }
  return url.toString();
}

function webRedirect(path: string, reason?: string): string {
  return webUrl(path, reason);
}

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
      redirect(webRedirect("/login", "expired"));
    }
    if (error instanceof ApiError && error.status === 0) {
      redirect(webRedirect("/login", "unavailable"));
    }
    throw error;
  }

  if (!context) {
    redirect(webRedirect("/login", "expired"));
  }

  if (!context.activeDestination?.path.startsWith(prefix)) {
    redirect(webRedirect("/workspace", "forbidden"));
  }

  return context;
}
