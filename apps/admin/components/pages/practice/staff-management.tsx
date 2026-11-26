"use client";

import {
  ASSIGNABLE_HOSPITAL_ROLE_CODES,
  type AssignableHospitalRoleCode,
  type HospitalMembershipView,
  type HospitalRoleCode,
  type MembershipStatus,
} from "@repo/contracts";
import { Alert, Button, Card, Dropdown, Select, Space, Table, Tag, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { useState } from "react";
import {
  useMembershipRoleMutation,
  useUpdateMembershipStatus,
} from "../../../hooks/practice/staff-mutations";
import { useMemberships } from "../../../hooks/practice/staff-query";
import { apiErrorMessage } from "../../../lib/errors/api-error-message";
import { AdminPage } from "../../admin-page";
import { InviteMemberForm } from "./invite-member-form";

const STATUS_COLORS: Record<MembershipStatus, string> = {
  invited: "blue",
  active: "green",
  suspended: "orange",
  revoked: "default",
};

const STATUS_OPTIONS: ReadonlyArray<{ value: MembershipStatus; label: string }> = [
  { value: "invited", label: "Invited" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "revoked", label: "Revoked" },
];

function roleLabel(roleCode: HospitalRoleCode): string {
  return roleCode
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function StaffManagement({
  hospitalId,
  currentUserId,
}: {
  hospitalId: string;
  currentUserId: string;
}) {
  const memberships = useMemberships(hospitalId);
  const updateStatus = useUpdateMembershipStatus(hospitalId);
  const roleMutation = useMembershipRoleMutation(hospitalId);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const rows = memberships.data ?? [];
  const currentMembership = rows.find((membership) => membership.userId === currentUserId);
  const canAssignOwner = currentMembership?.roles.includes("hospital_owner") ?? false;
  const ownerCount = rows.filter((membership) =>
    membership.roles.includes("hospital_owner"),
  ).length;
  const isBusy =
    updateStatus.isPending || roleMutation.add.isPending || roleMutation.remove.isPending;

  function beginAction() {
    setError(null);
    setNotice(null);
  }

  async function changeStatus(membership: HospitalMembershipView, status: MembershipStatus) {
    if (status === membership.status || status === "invited") {
      return;
    }
    beginAction();
    try {
      await updateStatus.mutateAsync({ membershipId: membership.id, status });
      setNotice(`Membership status changed to ${status}.`);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    }
  }

  async function addRole(membership: HospitalMembershipView, roleCode: AssignableHospitalRoleCode) {
    beginAction();
    try {
      await roleMutation.add.mutateAsync({ membershipId: membership.id, roleCode });
      setNotice(`${roleLabel(roleCode)} role added.`);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    }
  }

  async function removeRole(
    membership: HospitalMembershipView,
    roleCode: AssignableHospitalRoleCode,
  ) {
    beginAction();
    try {
      await roleMutation.remove.mutateAsync({ membershipId: membership.id, roleCode });
      setNotice(`${roleLabel(roleCode)} role removed.`);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    }
  }

  const columns: TableColumnsType<HospitalMembershipView> = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 240,
      render: (userId: string) => <Typography.Text code>{userId}</Typography.Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: MembershipStatus) => (
        <Tag color={STATUS_COLORS[status]}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (_value: AssignableHospitalRoleCode[], membership) => {
        const isLastOwner = membership.roles.includes("hospital_owner") && ownerCount <= 1;
        const availableRoles = ASSIGNABLE_HOSPITAL_ROLE_CODES.filter(
          (roleCode) =>
            !membership.roles.includes(roleCode) &&
            (roleCode !== "hospital_owner" || canAssignOwner),
        );

        return (
          <Space size={[4, 4]} wrap>
            {membership.roles.map((roleCode) => {
              const isAssignable = (ASSIGNABLE_HOSPITAL_ROLE_CODES as readonly string[]).includes(
                roleCode,
              );
              const removable =
                isAssignable &&
                (roleCode === "hospital_owner" ? canAssignOwner && !isLastOwner : true);
              return (
                <Tag
                  key={roleCode}
                  closable={removable && !isBusy}
                  onClose={() => {
                    if (isAssignable) {
                      void removeRole(membership, roleCode as AssignableHospitalRoleCode);
                    }
                  }}
                >
                  {roleLabel(roleCode)}
                </Tag>
              );
            })}
            {availableRoles.length > 0 ? (
              <Dropdown
                menu={{
                  items: availableRoles.map((roleCode) => ({
                    key: roleCode,
                    label: roleLabel(roleCode),
                  })),
                  onClick: ({ key }) => {
                    void addRole(membership, key as AssignableHospitalRoleCode);
                  },
                }}
              >
                <Button size="small" type="dashed" disabled={isBusy}>
                  Add role
                </Button>
              </Dropdown>
            ) : null}
          </Space>
        );
      },
    },
    {
      title: "Status action",
      key: "statusAction",
      width: 160,
      render: (_value, membership) => {
        const isSelf = membership.userId === currentUserId;
        const isLastOwner = membership.roles.includes("hospital_owner") && ownerCount <= 1;
        const locked = isSelf || isLastOwner;
        return (
          <Select<MembershipStatus>
            aria-label={`Change status for user ${membership.userId}`}
            value={membership.status}
            options={STATUS_OPTIONS.map((option) => ({
              ...option,
              disabled: option.value !== "active" && locked,
            }))}
            style={{ width: 140 }}
            disabled={isBusy}
            onChange={(status) => void changeStatus(membership, status)}
          />
        );
      },
    },
  ];

  return (
    <AdminPage
      title="Staff"
      description="Invite members, change membership status, and assign hospital roles. The API enforces owner protection and workspace scope."
    >
      <Card title="Invite a member">
        <InviteMemberForm hospitalId={hospitalId} />
      </Card>

      {error ? <Alert type="error" showIcon role="alert" title={error} /> : null}
      {notice ? <Alert type="success" showIcon title={notice} /> : null}
      {memberships.isError ? (
        <Alert
          type="error"
          showIcon
          role="alert"
          title="Staff could not be loaded."
          description={apiErrorMessage(memberships.error)}
        />
      ) : null}

      <Card title="Members">
        <Table<HospitalMembershipView>
          rowKey="id"
          columns={columns}
          dataSource={rows}
          loading={memberships.isPending}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 760 }}
          locale={{ emptyText: "No memberships are visible for this hospital." }}
        />
      </Card>
    </AdminPage>
  );
}
