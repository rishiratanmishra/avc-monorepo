"use client";

import type { AssignableHospitalRoleCode, UpdateMembershipStatusInput } from "@repo/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AddMembershipRole,
  InviteMember,
  RemoveMembershipRole,
  UpdateMembershipStatus,
} from "../../services/practice/staff-service";
import { staffKeys } from "./staff-query";

function useInvalidateStaff(hospitalId: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: staffKeys.list(hospitalId) });
}

export function useInviteMember(hospitalId: string) {
  const invalidate = useInvalidateStaff(hospitalId);
  return useMutation({
    mutationFn: (input: { email: string; roleCode: AssignableHospitalRoleCode }) =>
      InviteMember(hospitalId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateMembershipStatus(hospitalId: string) {
  const invalidate = useInvalidateStaff(hospitalId);
  return useMutation({
    mutationFn: ({
      membershipId,
      status,
    }: {
      membershipId: string;
      status: UpdateMembershipStatusInput["status"];
    }) => UpdateMembershipStatus(hospitalId, membershipId, { status }),
    onSuccess: invalidate,
  });
}

export function useMembershipRoleMutation(hospitalId: string) {
  const invalidate = useInvalidateStaff(hospitalId);
  const add = useMutation({
    mutationFn: ({
      membershipId,
      roleCode,
    }: {
      membershipId: string;
      roleCode: AssignableHospitalRoleCode;
    }) => AddMembershipRole(hospitalId, membershipId, roleCode),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: ({
      membershipId,
      roleCode,
    }: {
      membershipId: string;
      roleCode: AssignableHospitalRoleCode;
    }) => RemoveMembershipRole(hospitalId, membershipId, roleCode),
    onSuccess: invalidate,
  });
  return { add, remove };
}
