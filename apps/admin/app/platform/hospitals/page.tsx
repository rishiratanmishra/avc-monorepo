import type { Metadata } from "next";
import { AdminShell } from "../../../components/admin-shell";
import { HospitalList } from "../../../components/pages/platform/hospital-list";
import { requireAdminPermission } from "../../../lib/server-access";

export const metadata: Metadata = {
  title: "Hospitals | AVC Manage",
  robots: { index: false, follow: false },
};

export default async function HospitalsPage() {
  const context = await requireAdminPermission("platform", "platform.hospitals.manage");
  return (
    <AdminShell context={context} area="platform" section="hospitals">
      <HospitalList />
    </AdminShell>
  );
}
