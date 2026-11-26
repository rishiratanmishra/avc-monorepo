import type { Metadata } from "next";
import { AdminShell } from "../../../components/admin-shell";
import { UserManagement } from "../../../components/pages/platform/user-list";
import { requireAdminPermission } from "../../../lib/server-access";

export const metadata: Metadata = {
  title: "Users | AVC Manage",
  robots: { index: false, follow: false },
};

export default async function UsersPage() {
  const context = await requireAdminPermission("platform", "platform.users.manage");
  return (
    <AdminShell context={context} area="platform" section="users">
      <UserManagement currentUserId={context.userId} />
    </AdminShell>
  );
}
