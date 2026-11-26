import type { Metadata } from "next";
import { AdminShell } from "../../components/admin-shell";
import { WorkspaceOverview } from "../../components/workspace-overview";
import { requireAdminArea } from "../../lib/server-access";

export const metadata: Metadata = {
  title: "Practice workspace | AVC Manage",
  robots: { index: false, follow: false },
};

export default async function PracticePage() {
  const context = await requireAdminArea("practice");
  return (
    <AdminShell context={context} area="practice" section="overview">
      <WorkspaceOverview context={context} area="practice" />
    </AdminShell>
  );
}
