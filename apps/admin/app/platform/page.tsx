import type { Metadata } from "next";
import { AdminShell } from "../../components/admin-shell";
import { WorkspaceOverview } from "../../components/workspace-overview";
import { requireAdminArea } from "../../lib/server-access";

export const metadata: Metadata = {
  title: "Platform workspace | AVC Manage",
  robots: { index: false, follow: false },
};

export default async function PlatformPage() {
  const context = await requireAdminArea("platform");
  return (
    <AdminShell context={context} area="platform" section="overview">
      <WorkspaceOverview context={context} area="platform" />
    </AdminShell>
  );
}
