import type { PermissionCode } from "@repo/contracts";

export type AdminArea = "practice" | "platform";

export type AdminNavIcon = "overview" | "hospitals" | "staff" | "users" | "audit";

export interface AdminNavItem {
  key: string;
  label: string;
  /** App-relative path; Next.js adds the `/manage` basePath automatically. */
  href: `/${AdminArea}` | `/${AdminArea}/${string}`;
  permission?: PermissionCode;
  icon: AdminNavIcon;
}

/**
 * Navigation is derived from server-provided permissions for UX only.
 * Every destination is independently protected on the server and API.
 */
export const ADMIN_NAV: Readonly<Record<AdminArea, readonly AdminNavItem[]>> = {
  practice: [
    { key: "overview", label: "Overview", href: "/practice", icon: "overview" },
    {
      key: "staff",
      label: "Staff",
      href: "/practice/staff",
      permission: "hospital.members.manage",
      icon: "staff",
    },
  ],
  platform: [
    { key: "overview", label: "Overview", href: "/platform", icon: "overview" },
    {
      key: "hospitals",
      label: "Hospitals",
      href: "/platform/hospitals",
      permission: "platform.hospitals.manage",
      icon: "hospitals",
    },
    {
      key: "users",
      label: "Users",
      href: "/platform/users",
      permission: "platform.users.manage",
      icon: "users",
    },
  ],
};

export function visibleAdminNav(
  area: AdminArea,
  permissions: readonly PermissionCode[],
): AdminNavItem[] {
  return ADMIN_NAV[area].filter(
    (item) => item.permission === undefined || permissions.includes(item.permission),
  );
}

export function permissionsForArea(
  area: AdminArea,
  permissions: readonly PermissionCode[],
): PermissionCode[] {
  const prefix = `${area === "practice" ? "hospital" : "platform"}.`;
  return permissions.filter((permission) => permission.startsWith(prefix));
}
