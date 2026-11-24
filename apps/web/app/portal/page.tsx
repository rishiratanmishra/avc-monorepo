import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Portal moved | AVC Pet Hospital",
  robots: { index: false, follow: false },
};

export default function LegacyPortalPage() {
  redirect("/workspace");
}
