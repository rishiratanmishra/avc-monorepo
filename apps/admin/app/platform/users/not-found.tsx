import { PrivateState } from "../../../components/private-state";
import { webUrl } from "../../../lib/server-access";

export default function NotFound() {
  return (
    <PrivateState
      title="User management not available"
      description="This workspace does not have platform user permissions."
    >
      <a href={webUrl("/workspace?switch=1")}>Choose another workspace</a>
    </PrivateState>
  );
}
