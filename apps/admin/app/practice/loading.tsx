import { PrivateState } from "../../components/private-state";

export default function Loading() {
  return (
    <PrivateState
      title="Loading practice workspace…"
      description="Checking the authorized session with the API."
    />
  );
}
