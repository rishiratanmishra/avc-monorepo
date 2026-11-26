"use client";

import { PrivateState } from "../../../components/private-state";
import { siteUrl } from "../../../lib/site-url";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PrivateState
      title="Unable to load users"
      description="The API could not confirm this session. Try again."
    >
      <button type="button" onClick={reset}>
        Try again
      </button>
      <a href={siteUrl("/workspace?switch=1")}>Choose another workspace</a>
    </PrivateState>
  );
}
