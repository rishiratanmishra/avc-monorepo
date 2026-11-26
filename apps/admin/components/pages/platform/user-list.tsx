"use client";

import type { AdminUserView, UserStatus } from "@repo/contracts";
import { Alert, Button, Card, Dropdown, Input, Space, Table, Tag, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { useMemo, useState } from "react";
import { usePlatformUserRoleMutation } from "../../../hooks/platform/user-mutations";
import { usePlatformUsers } from "../../../hooks/platform/user-query";
import { apiErrorMessage } from "../../../lib/errors/api-error-message";
import { AdminPage } from "../../admin-page";
import { CreateUserForm } from "./create-user-form";

const STATUS_COLORS: Record<UserStatus, string> = {
  pending_verification: "orange",
  active: "green",
  suspended: "red",
  deactivated: "default",
};

function roleLabel(roleCode: string): string {
  return roleCode
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
}

export function UserManagement({ currentUserId }: { currentUserId: string }) {
  const users = usePlatformUsers();
  const roleMutation = usePlatformUserRoleMutation();
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const allRows = useMemo(() => users.data ?? [], [users.data]);
  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return allRows;
    }
    return allRows.filter((user) =>
      `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(query),
    );
  }, [allRows, search]);

  const adminCount = allRows.filter((user) => user.roles.includes("admin")).length;
  const isBusy = roleMutation.assign.isPending || roleMutation.revoke.isPending;

  function beginAction() {
    setError(null);
    setNotice(null);
  }

  async function assignAdmin(user: AdminUserView) {
    beginAction();
    try {
      await roleMutation.assign.mutateAsync({ userId: user.id, roleCode: "admin" });
      setNotice(`Platform administrator role assigned to ${user.email}.`);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    }
  }

  async function revokeAdmin(user: AdminUserView) {
    beginAction();
    try {
      await roleMutation.revoke.mutateAsync({ userId: user.id, roleCode: "admin" });
      setNotice(`Platform administrator role removed from ${user.email}.`);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    }
  }

  const columns: TableColumnsType<AdminUserView> = [
    {
      title: "Name",
      key: "name",
      width: 220,
      render: (_value, user) => (
        <Typography.Text strong>
          {user.firstName} {user.lastName}
        </Typography.Text>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 260,
      render: (email: string) => <Typography.Text>{email}</Typography.Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 170,
      render: (status: UserStatus) => (
        <Tag color={STATUS_COLORS[status]}>{status.replaceAll("_", " ").toUpperCase()}</Tag>
      ),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roleCodes: string[], user) => {
        const hasAdmin = roleCodes.includes("admin");
        const canRemoveAdmin = hasAdmin && user.id !== currentUserId && adminCount > 1;
        return (
          <Space size={[4, 4]} wrap>
            {roleCodes.map((roleCode) => (
              <Tag
                key={roleCode}
                closable={roleCode === "admin" && canRemoveAdmin && !isBusy}
                onClose={() => {
                  if (roleCode === "admin") {
                    void revokeAdmin(user);
                  }
                }}
              >
                {roleLabel(roleCode)}
              </Tag>
            ))}
            {!hasAdmin ? (
              <Dropdown
                menu={{
                  items: [{ key: "admin", label: "Platform administrator" }],
                  onClick: () => void assignAdmin(user),
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
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (createdAt: string) => formatDate(createdAt),
    },
  ];

  return (
    <AdminPage
      title="Users"
      description="Create accounts and manage platform administrator access. Hospital roles are managed through staff memberships."
    >
      <Card title="Create user">
        <CreateUserForm />
      </Card>

      {error ? <Alert type="error" showIcon title={error} role="alert" /> : null}
      {notice ? <Alert type="success" showIcon title={notice} role="status" /> : null}
      {users.isError ? (
        <Alert
          type="error"
          showIcon
          role="alert"
          title="Users could not be loaded."
          description={apiErrorMessage(users.error)}
        />
      ) : null}

      <Card title="Accounts">
        <Input
          aria-label="Search users"
          allowClear
          placeholder="Search by name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ maxWidth: 320, marginBottom: 16 }}
        />
        <Table<AdminUserView>
          rowKey="id"
          columns={columns}
          dataSource={rows}
          loading={users.isPending}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 900 }}
          locale={{ emptyText: "No users match this search." }}
        />
      </Card>
    </AdminPage>
  );
}
