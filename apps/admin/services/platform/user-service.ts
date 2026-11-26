import type { AdminCreateUserInput, AdminUserView, PlatformRoleCode } from "@repo/contracts";
import { getAdminApiClient } from "../../lib/api-client";

export function ListPlatformUsers(): Promise<AdminUserView[]> {
  return getAdminApiClient().listPlatformUsers();
}

export function CreatePlatformUser(input: AdminCreateUserInput): Promise<AdminUserView> {
  return getAdminApiClient().createPlatformUser(input);
}

export function AssignPlatformUserRole(userId: string, roleCode: PlatformRoleCode): Promise<void> {
  return getAdminApiClient().assignPlatformUserRole(userId, roleCode);
}

export function RevokePlatformUserRole(userId: string, roleCode: PlatformRoleCode): Promise<void> {
  return getAdminApiClient().revokePlatformUserRole(userId, roleCode);
}
