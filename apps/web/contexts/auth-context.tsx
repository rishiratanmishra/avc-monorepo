"use client";

import type { AccessContext } from "@repo/contracts";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { accessContextQueryKey, useAccessContext } from "../hooks/auth/auth-query";
import { GetAccessContext } from "../services/auth/auth-service";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  context: AccessContext | null;
  isAuthenticated: boolean;
  refresh: () => Promise<AccessContext | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialContext,
}: {
  children: ReactNode;
  initialContext: AccessContext | null;
}) {
  const queryClient = useQueryClient();
  const { data, isPending } = useAccessContext(initialContext);
  const context = data ?? null;
  const status: AuthStatus = context ? "authenticated" : isPending ? "loading" : "unauthenticated";

  const refresh = useCallback(async () => {
    try {
      return await queryClient.fetchQuery({
        queryKey: accessContextQueryKey,
        queryFn: GetAccessContext,
        staleTime: 0,
        retry: false,
      });
    } catch {
      return null;
    }
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      context,
      isAuthenticated: status === "authenticated",
      refresh,
    }),
    [status, context, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}
