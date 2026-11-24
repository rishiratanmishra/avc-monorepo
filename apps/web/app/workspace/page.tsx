import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WorkspaceSelector } from "../../components/pages/workspace/workspace-selector";
import { readOptionalAccessContext } from "../../lib/server-access";

export const metadata: Metadata = {
  title: "Choose workspace | AVC Pet Hospital",
  description: "Choose the authorized AVC workspace for this session.",
  robots: { index: false, follow: false },
};

type WorkspacePageProps = {
  searchParams: Promise<{ reason?: string | string[]; switch?: string | string[] }>;
};

const reasonMessages: Record<string, string> = {
  forbidden: "That area is not available for the current workspace.",
  revoked: "Your previous workspace is no longer available. Choose another one.",
  expired: "Your session expired. Sign in again to continue.",
};

export default async function WorkspacePage({ searchParams }: WorkspacePageProps) {
  const query = await searchParams;
  const context = await readOptionalAccessContext();

  if (!context) {
    redirect("/login?reason=expired");
  }

  const reason = typeof query.reason === "string" ? query.reason : undefined;
  const forceSelector = query.switch === "1" || reason !== undefined;
  if (context.activeDestination && !forceSelector) {
    redirect(context.activeDestination.path);
  }

  return (
    <WorkspaceSelector
      destinations={context.destinations}
      email={context.email}
      notice={reason ? reasonMessages[reason] ?? null : null}
    />
  );
}
