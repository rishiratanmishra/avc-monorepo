import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoutButton } from "../components/logout-button";
import { PrivateState } from "../components/private-state";
import { readOptionalAccessContext, webUrl } from "../lib/server-access";

export const metadata: Metadata = {
  title: "AVC Manage",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  const context = await readOptionalAccessContext();
  const adminDestination = context?.activeDestination?.path.startsWith("/manage/")
    ? context.activeDestination
    : null;

  if (adminDestination) {
    redirect(adminDestination.path.slice("/manage".length) || "/");
  }

  return (
    <PrivateState
      title={context ? "No active management workspace" : "Sign in required"}
      description={
        context
          ? "Select an authorized hospital or platform workspace to continue."
          : "Your session is not available. Sign in on the main website first."
      }
    >
      <a href={webUrl("/workspace?switch=1")}>Choose workspace</a>
      <a href={webUrl("/login")}>Sign in</a>
      {context ? <LogoutButton /> : null}
    </PrivateState>
  );
}
