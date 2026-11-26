import type { Metadata } from "next";
import { AcceptInvitationScreen } from "../../components/pages/accept-invitation/accept-invitation-screen";

export const metadata: Metadata = {
  title: "Accept Invitation | AVC Pet Hospital",
  description: "Accept an invitation to join an AVC hospital workspace.",
  robots: { index: false, follow: false },
};

type AcceptInvitationPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function AcceptInvitationPage({ searchParams }: AcceptInvitationPageProps) {
  const query = await searchParams;
  const token = typeof query.token === "string" ? query.token : undefined;

  return <AcceptInvitationScreen initialToken={token} />;
}
