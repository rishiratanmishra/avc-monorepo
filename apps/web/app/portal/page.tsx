"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getPanelPath } from "../../contexts/auth-context";

export default function PortalIndexPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/login");
    } else {
      router.replace(getPanelPath(user.role));
    }
  }, [user, isAuthenticated, router]);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <p style={{ color: "var(--md-sys-color-primary)", fontWeight: 600 }}>
        Routing to your dedicated clinical panel...
      </p>
    </div>
  );
}
