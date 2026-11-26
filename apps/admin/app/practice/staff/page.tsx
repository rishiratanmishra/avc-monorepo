import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "../../../components/admin-shell";
import { StaffManagement } from "../../../components/pages/practice/staff-management";
import { requireAdminPermission } from "../../../lib/server-access";

export const metadata: Metadata = {
  title: "Staff | AVC Manage",
  robots: { index: false, follow: false },
};

export default async function StaffPage() {
  const context = await requireAdminPermission("practice", "hospital.members.manage");
  const hospitalId = context.activeWorkspace.hospitalId;
  if (!hospitalId) {
    notFound();
  }

  return (
    <AdminShell context={context} area="practice" section="staff">
      <StaffManagement hospitalId={hospitalId} currentUserId={context.userId} />
    </AdminShell>
  );
}
