"use client";

import type { HospitalStatus, HospitalSummary } from "@repo/contracts";
import { Alert, Card, Input, Select, Space, Table, Tag, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { useMemo, useState } from "react";
import { useHospitals } from "../../../hooks/platform/hospital-query";
import { useUpdateHospitalStatus } from "../../../hooks/platform/hospital-mutations";
import { apiErrorMessage } from "../../../lib/errors/api-error-message";
import { AdminPage } from "../../admin-page";
import { CreateHospitalForm } from "./create-hospital-form";

const STATUS_COLORS: Record<HospitalStatus, string> = {
  active: "green",
  suspended: "orange",
  closed: "default",
};

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "closed", label: "Closed" },
] as const;

export function HospitalList() {
  const hospitals = useHospitals();
  const updateStatus = useUpdateHospitalStatus();
  const [search, setSearch] = useState("");
  const [statusError, setStatusError] = useState<string | null>(null);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return hospitals.data ?? [];
    }
    return (hospitals.data ?? []).filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(term) || hospital.slug.toLowerCase().includes(term),
    );
  }, [hospitals.data, search]);

  const columns: TableColumnsType<HospitalSummary> = [
    {
      title: "Hospital",
      dataIndex: "name",
      key: "name",
      sorter: (left, right) => left.name.localeCompare(right.name),
      render: (name: string, hospital) => (
        <Space orientation="vertical" size={0}>
          <Typography.Text strong>{name}</Typography.Text>
          <Typography.Text type="secondary">{hospital.slug}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 160,
      sorter: (left, right) => left.status.localeCompare(right.status),
      render: (status: HospitalStatus) => (
        <Tag color={STATUS_COLORS[status]}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Status action",
      key: "statusAction",
      width: 180,
      render: (_value, hospital) => (
        <Select<HospitalStatus>
          aria-label={`Change status for ${hospital.name}`}
          value={hospital.status}
          options={STATUS_OPTIONS.map((option) => ({ ...option }))}
          style={{ width: 140 }}
          disabled={updateStatus.isPending}
          onChange={async (status) => {
            setStatusError(null);
            if (status === hospital.status) {
              return;
            }
            try {
              await updateStatus.mutateAsync({ hospitalId: hospital.id, status });
            } catch (error) {
              setStatusError(apiErrorMessage(error));
            }
          }}
        />
      ),
    },
  ];

  return (
    <AdminPage
      title="Hospitals"
      description="Create hospitals and manage their operational status. A suspended hospital revokes active hospital sessions."
    >
      <Card title="Create hospital">
        <CreateHospitalForm />
      </Card>

      {statusError ? <Alert type="error" showIcon role="alert" title={statusError} /> : null}

      <Card title="All hospitals">
        <Space orientation="vertical" size="middle" style={{ display: "flex", width: "100%" }}>
          <Input.Search
            allowClear
            placeholder="Search by hospital name or slug"
            aria-label="Search hospitals"
            onChange={(event) => setSearch(event.target.value)}
            style={{ maxWidth: 320 }}
          />
          <Table<HospitalSummary>
            rowKey="id"
            columns={columns}
            dataSource={rows}
            loading={hospitals.isPending}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            locale={{
              emptyText: hospitals.isError
                ? "Hospitals could not be loaded."
                : "No hospitals have been created yet.",
            }}
          />
        </Space>
      </Card>
    </AdminPage>
  );
}
