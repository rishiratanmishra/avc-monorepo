import type {
  AssignableHospitalRoleCode,
  HospitalMembershipView,
  InviteMemberInput,
  MessageResponse,
  UpdateMembershipStatusInput,
} from "@repo/contracts";
import { getAdminApiClient } from "../../lib/api-client";

export function ListMemberships(hospitalId: string): Promise<HospitalMembershipView[]> {
  return getAdminApiClient().listHospitalMemberships(hospitalId);
}

export function InviteMember(
  hospitalId: string,
  input: InviteMemberInput,
): Promise<MessageResponse> {
  return getAdminApiClient().inviteHospitalMember(hospitalId, input);
}

export function UpdateMembershipStatus(
  hospitalId: string,
  membershipId: string,
  input: UpdateMembershipStatusInput,
): Promise<HospitalMembershipView> {
  return getAdminApiClient().updateHospitalMembershipStatus(hospitalId, membershipId, input);
}

export function AddMembershipRole(
  hospitalId: string,
  membershipId: string,
  roleCode: AssignableHospitalRoleCode,
): Promise<void> {
  return getAdminApiClient().addHospitalMembershipRole(hospitalId, membershipId, roleCode);
}

export function RemoveMembershipRole(
  hospitalId: string,
  membershipId: string,
  roleCode: AssignableHospitalRoleCode,
): Promise<void> {
  return getAdminApiClient().removeHospitalMembershipRole(hospitalId, membershipId, roleCode);
}
