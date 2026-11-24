import { PrivateState } from "../../components/private-state";
import { webUrl } from "../../lib/server-access";

export default function NotFound() {
  return (
    <PrivateState
      title="Workspace not found"
      description="This platform workspace is not available for your account."
    >
      <a href={webUrl("/workspace?switch=1")}>Choose another workspace</a>
    </PrivateState>
  );
}
