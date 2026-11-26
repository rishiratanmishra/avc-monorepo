import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { HospitalSummary } from "@repo/contracts";
import { ListHospitals } from "../../services/platform/hospital-service";

export const hospitalKeys = {
  all: ["hospitals"] as const,
  list: () => [...hospitalKeys.all, "list"] as const,
};

export function useHospitals(): UseQueryResult<HospitalSummary[], Error> {
  return useQuery({
    queryKey: hospitalKeys.list(),
    queryFn: ListHospitals,
  });
}
