"use client";

import type { AdminCreateUserInput, PlatformRoleCode } from "@repo/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AssignPlatformUserRole,
  CreatePlatformUser,
  RevokePlatformUserRole,
} from "../../services/platform/user-service";
import { platformUserKeys } from "./user-query";

function useInvalidatePlatformUsers() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: platformUserKeys.all });
}

export function useCreatePlatformUser() {
  const invalidate = useInvalidatePlatformUsers();
  return useMutation({
    mutationFn: (input: AdminCreateUserInput) => CreatePlatformUser(input),
    onSuccess: invalidate,
  });
}

export function usePlatformUserRoleMutation() {
  const invalidate = useInvalidatePlatformUsers();
  const assign = useMutation({
    mutationFn: ({ userId, roleCode }: { userId: string; roleCode: PlatformRoleCode }) =>
      AssignPlatformUserRole(userId, roleCode),
    onSuccess: invalidate,
  });
  const revoke = useMutation({
    mutationFn: ({ userId, roleCode }: { userId: string; roleCode: PlatformRoleCode }) =>
      RevokePlatformUserRole(userId, roleCode),
    onSuccess: invalidate,
  });
  return { assign, revoke };
}
