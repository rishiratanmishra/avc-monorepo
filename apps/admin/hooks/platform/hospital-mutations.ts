"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateHospital, UpdateHospitalStatus } from "../../services/platform/hospital-service";
import { hospitalKeys } from "./hospital-query";

export function useCreateHospital() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CreateHospital,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: hospitalKeys.all });
    },
  });
}

export function useUpdateHospitalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      hospitalId,
      status,
    }: {
      hospitalId: string;
      status: "active" | "suspended" | "closed";
    }) => UpdateHospitalStatus(hospitalId, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: hospitalKeys.all });
    },
  });
}
