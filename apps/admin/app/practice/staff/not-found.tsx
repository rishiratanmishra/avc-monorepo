import { PrivateState } from "../../../components/private-state";
import { webUrl } from "../../../lib/server-access";

export default function NotFound() {
  return (
    <PrivateState
      title="Staff management not available"
      description="This workspace does not have hospital membership permissions."
    >
      <a href={webUrl("/workspace?switch=1")}>Choose another workspace</a>
    </PrivateState>
  );
}
