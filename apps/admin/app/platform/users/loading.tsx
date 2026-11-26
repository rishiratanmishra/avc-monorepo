import { PrivateState } from "../../../components/private-state";

export default function Loading() {
  return (
    <PrivateState
      title="Loading users…"
      description="Checking the authorized session with the API."
    />
  );
}
