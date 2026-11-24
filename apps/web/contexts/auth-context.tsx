"use client";

import { ApiError, createApiClient } from "@repo/api-client";
import type {
  AccessContext,
  ApplicationDestination,
  AuthenticatedUser,
  CreateAccountInput,
} from "@repo/contracts";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  context: AccessContext | null;
  isAuthenticated: boolean;
  refresh: () => Promise<AccessContext | null>;
  login: (email: string, password: string) => Promise<AuthenticatedUser>;
  register: (input: CreateAccountInput) => Promise<string>;
  logout: () => Promise<void>;
  selectWorkspace: (destination: ApplicationDestination) => Promise<AccessContext>;
  requestPasswordReset: (email: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const api = createApiClient({ baseUrl: "" });

export function AuthProvider({
  children,
  initialContext,
}: {
  children: ReactNode;
  initialContext: AccessContext | null;
}) {
  const router = useRouter();
  const [context, setContext] = useState<AccessContext | null>(initialContext);
  const [status, setStatus] = useState<AuthStatus>(
    initialContext ? "authenticated" : "unauthenticated",
  );

  const refresh = useCallback(async () => {
    try {
      const nextContext = await api.getAccessContext();
      setContext(nextContext);
      setStatus("authenticated");
      return nextContext;
    } catch (error) {
      setContext(null);
      setStatus("unauthenticated");
      if (error instanceof ApiError && error.status === 0) {
        return null;
      }
      return null;
    }
  }, []);

  const routeFromContext = useCallback(
    async (nextContext: AccessContext) => {
      let current = nextContext;

      const [onlyDestination] = current.destinations;
      if (!current.activeDestination && current.destinations.length === 1 && onlyDestination) {
        current = await api.selectWorkspace({
          scope: onlyDestination.scope,
          hospitalId: onlyDestination.hospitalId,
        });
        setContext(current);
      }

      window.location.assign(current.activeDestination?.path ?? "/workspace");
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const user = await api.login({ email, password });
      const nextContext = await refresh();
      if (!nextContext) {
        throw new ApiError(401, "SESSION_NOT_READY", "The session could not be loaded");
      }
      await routeFromContext(nextContext);
      return user;
    },
    [refresh, routeFromContext],
  );

  const register = useCallback(async (input: CreateAccountInput) => {
    const result = await api.register(input);
    return result.message;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setContext(null);
    setStatus("unauthenticated");
    router.replace("/");
  }, [router]);

  const requestPasswordReset = useCallback(async (email: string) => {
    const result = await api.requestPasswordReset(email);
    return result.message;
  }, []);

  const selectWorkspace = useCallback(
    async (destination: ApplicationDestination) => {
      const nextContext = await api.selectWorkspace({
        scope: destination.scope,
        hospitalId: destination.hospitalId,
      });
      setContext(nextContext);
      setStatus("authenticated");
      window.location.assign(nextContext.activeDestination?.path ?? "/workspace");
      return nextContext;
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      context,
      isAuthenticated: status === "authenticated" && context !== null,
      refresh,
      login,
      register,
      logout,
      selectWorkspace,
      requestPasswordReset,
    }),
    [status, context, refresh, login, register, logout, selectWorkspace, requestPasswordReset],
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
