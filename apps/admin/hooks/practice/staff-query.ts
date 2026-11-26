import type { HospitalMembershipView } from "@repo/contracts";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { ListMemberships } from "../../services/practice/staff-service";

export const staffKeys = {
  all: ["staff"] as const,
  list: (hospitalId: string) => [...staffKeys.all, "list", hospitalId] as const,
};

export function useMemberships(
  hospitalId: string | null,
): UseQueryResult<HospitalMembershipView[], Error> {
  return useQuery({
    queryKey: staffKeys.list(hospitalId ?? "none"),
    queryFn: hospitalId
      ? () => ListMemberships(hospitalId)
      : () => Promise.resolve([] as HospitalMembershipView[]),
    enabled: hospitalId !== null,
  });
}
