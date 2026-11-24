"use client";

import { createApiClient } from "@repo/api-client";
import { Button } from "antd";
import { useState } from "react";
import { siteUrl } from "../lib/site-url";

const api = createApiClient({ baseUrl: "" });

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await api.logout();
    } finally {
      window.location.assign(siteUrl("/"));
    }
  }

  return (
    <Button type="text" onClick={() => void logout()} loading={pending}>
      Sign out
    </Button>
  );
}
