import { API_SESSION_COOKIE, ApiError, createServerApiClient } from "@repo/api-client";
import type { AccessContext, PermissionCode } from "@repo/contracts";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { AdminArea } from "./admin-nav";

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

export interface AdminLandingState {
  context: AccessContext | null;
  unavailable: boolean;
}

export async function readOptionalAccessContext(): Promise<AdminLandingState> {
  try {
    return { context: await readAccessContext(), unavailable: false };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { context: null, unavailable: false };
    }
    if (error instanceof ApiError && error.status === 0) {
      return { context: null, unavailable: true };
    }
    throw error;
  }
}

export async function requireDestination(prefix: string): Promise<AccessContext> {
  let context: AccessContext | null;
  const cookie = await cookieHeader();
  try {
    context = await createServerApiClient().getAccessContext(cookie);
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

  if (!context.activeDestination) {
    const matchingDestination = context.destinations.find(
      (d) => d.path === prefix || prefix.startsWith(`${d.path}/`),
    );
    if (matchingDestination) {
      try {
        context = await createServerApiClient().selectWorkspace(
          { scope: matchingDestination.scope, hospitalId: matchingDestination.hospitalId },
          cookie,
        );
      } catch {
        // Fall through to destination check
      }
    }
  }

  const destinationPath = context.activeDestination?.path;
  if (destinationPath !== prefix && !destinationPath?.startsWith(`${prefix}/`)) {
    redirect(webRedirect("/workspace", "forbidden"));
  }

  return context;
}

/**
 * Guards every nested route in an area. The API emits only base destinations,
 * so nested paths must not be passed as the destination prefix.
 */
export function requireAdminArea(area: AdminArea): Promise<AccessContext> {
  return requireDestination(`/manage/${area}`);
}

/** Server-side UX guard; the API still rechecks every protected request. */
export async function requireAdminPermission(
  area: AdminArea,
  permission: PermissionCode,
): Promise<AccessContext> {
  const context = await requireAdminArea(area);
  if (!context.activeWorkspace.permissions.includes(permission)) {
    notFound();
  }
  return context;
}
