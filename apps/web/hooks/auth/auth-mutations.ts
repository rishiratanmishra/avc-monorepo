"use client";

import type { ApplicationDestination } from "@repo/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  AcceptInvitation,
  LoginUser,
  LogoutUser,
  RegisterUser,
  RequestPasswordReset,
  SelectWorkspace,
} from "../../services/auth/auth-service";
import { accessContextQueryKey, useAuthSessionSync } from "./auth-query";

export const useLoginUser = () => {
  const syncSession = useAuthSessionSync();
  return useMutation({
    mutationFn: LoginUser,
    onSuccess: () => syncSession(),
  });
};

export const useLogoutUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: LogoutUser,
    onSuccess: async () => {
      queryClient.setQueryData(accessContextQueryKey, null);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== accessContextQueryKey[0],
      });
      router.replace("/");
    },
  });
};

export const useRegisterUser = () =>
  useMutation({
    mutationFn: RegisterUser,
  });

export const useRequestPasswordReset = () =>
  useMutation({
    mutationFn: RequestPasswordReset,
  });

export const useSelectWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SelectWorkspace,
    onSuccess: (nextContext) => {
      queryClient.setQueryData(accessContextQueryKey, nextContext);
      window.location.assign(nextContext.activeDestination?.path ?? "/workspace");
    },
  });
};

export function selectWorkspaceInput(destination: ApplicationDestination) {
  return { scope: destination.scope, hospitalId: destination.hospitalId };
}

export const useAcceptInvitation = () => {
  const syncSession = useAuthSessionSync();
  return useMutation({
    mutationFn: AcceptInvitation,
    onSuccess: () => syncSession(),
  });
};
