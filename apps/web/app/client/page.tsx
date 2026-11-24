import type { Metadata } from "next";
import { ClientHome } from "../../components/pages/client/client-home";
import { requireDestination } from "../../lib/server-access";

export const metadata: Metadata = {
  title: "Client workspace | AVC Pet Hospital",
  description: "Authorized pet parent workspace.",
  robots: { index: false, follow: false },
};

export default async function ClientPage() {
  const context = await requireDestination("/client");
  return <ClientHome context={context} />;
}
