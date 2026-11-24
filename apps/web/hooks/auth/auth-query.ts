"use client";

import { ApiError } from "@repo/api-client";
import type { AccessContext } from "@repo/contracts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { GetAccessContext, SelectWorkspace } from "../../services/auth/auth-service";

export const accessContextQueryKey = ["auth", "access-context"] as const;

/** The root layout seeds this cache from the server; it never auto-fetches. */
export function accessContextQueryOptions(initialContext?: AccessContext | null) {
  return {
    queryKey: accessContextQueryKey,
    queryFn: GetAccessContext,
    initialData: initialContext ?? null,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  };
}

/** Auth mutations and explicit refresh must re-read the authoritative context. */
function accessContextFetchOptions() {
  return {
    queryKey: accessContextQueryKey,
    queryFn: GetAccessContext,
    retry: false,
    staleTime: 0,
  };
}

export function useAccessContext(initialContext: AccessContext | null) {
  return useQuery(accessContextQueryOptions(initialContext));
}

/**
 * Re-reads the authoritative session context after an auth mutation,
 * resolves a single available workspace, and routes into it.
 */
export function useAuthSessionSync() {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    let nextContext: AccessContext | null = null;
    try {
      nextContext = await queryClient.fetchQuery(accessContextFetchOptions());
    } catch {
      // A missing or expired session is handled as an unauthenticated context below.
    }

    if (!nextContext) {
      throw new ApiError(401, "SESSION_NOT_READY", "The session could not be loaded");
    }

    let current = nextContext;
    const [onlyDestination] = current.destinations;
    if (!current.activeDestination && current.destinations.length === 1 && onlyDestination) {
      current = await SelectWorkspace({
        scope: onlyDestination.scope,
        hospitalId: onlyDestination.hospitalId,
      });
    }
    queryClient.setQueryData(accessContextQueryKey, current);
    window.location.assign(current.activeDestination?.path ?? "/workspace");
    return current;
  }, [queryClient]);
}
