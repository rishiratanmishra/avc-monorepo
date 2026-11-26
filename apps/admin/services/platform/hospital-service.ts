import type {
  CreateHospitalInput,
  HospitalSummary,
  UpdateHospitalStatusInput,
} from "@repo/contracts";
import { getAdminApiClient } from "../../lib/api-client";

export function ListHospitals(): Promise<HospitalSummary[]> {
  return getAdminApiClient().listHospitals();
}

export function CreateHospital(input: CreateHospitalInput): Promise<HospitalSummary> {
  return getAdminApiClient().createHospital(input);
}

export function UpdateHospitalStatus(
  hospitalId: string,
  input: UpdateHospitalStatusInput,
): Promise<void> {
  return getAdminApiClient().updateHospitalStatus(hospitalId, input);
}
