import type { Metadata } from "next";
import { AdminShell } from "../../components/admin-shell";
import { requireDestination } from "../../lib/server-access";

export const metadata: Metadata = {
  title: "Platform workspace | AVC Manage",
  robots: { index: false, follow: false },
};

export default async function PlatformPage() {
  const context = await requireDestination("/manage/platform");
  return <AdminShell context={context} area="platform" />;
}
