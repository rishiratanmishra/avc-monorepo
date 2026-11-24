import { PrivateState } from "../../components/private-state";

export default function Loading() {
  return (
    <PrivateState
      title="Loading platform workspace…"
      description="Checking the authorized session with the API."
    />
  );
}
