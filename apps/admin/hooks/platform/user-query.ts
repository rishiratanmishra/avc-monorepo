import type { AdminUserView } from "@repo/contracts";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { ListPlatformUsers } from "../../services/platform/user-service";

export const platformUserKeys = {
  all: ["platform-users"] as const,
  list: () => [...platformUserKeys.all, "list"] as const,
};

export function usePlatformUsers(): UseQueryResult<AdminUserView[], Error> {
  return useQuery({
    queryKey: platformUserKeys.list(),
    queryFn: ListPlatformUsers,
  });
}
