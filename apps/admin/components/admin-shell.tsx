"use client";

import type { AccessContext } from "@repo/contracts";
import {
  AppstoreOutlined,
  AuditOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Space, Tag, Typography } from "antd";
import Link from "next/link";
import type { ReactNode } from "react";
import { visibleAdminNav, type AdminArea, type AdminNavIcon } from "../lib/admin-nav";
import { siteUrl } from "../lib/site-url";
import { LogoutButton } from "./logout-button";

const NAV_ICONS: Record<AdminNavIcon, ReactNode> = {
  overview: <AppstoreOutlined />,
  hospitals: <BankOutlined />,
  staff: <TeamOutlined />,
  users: <SafetyCertificateOutlined />,
  audit: <AuditOutlined />,
};

export function AdminShell({
  context,
  area,
  section,
  children,
}: {
  context: AccessContext;
  area: AdminArea;
  section?: string;
  children: ReactNode;
}) {
  const navItems = visibleAdminNav(area, context.activeWorkspace.permissions).map((item) => ({
    key: item.key,
    icon: NAV_ICONS[item.icon],
    label: <Link href={item.href}>{item.label}</Link>,
  }));

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        style={{ borderRight: "1px solid var(--md-sys-color-outline)" }}
      >
        <div style={{ padding: "var(--space-5) var(--space-4)" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            AVC Manage
          </Typography.Title>
          <Typography.Text type="secondary">Authorized workspace</Typography.Text>
        </div>
        <Menu mode="inline" selectedKeys={section ? [section] : []} items={navItems} />
      </Layout.Sider>
      <Layout>
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            background: "var(--md-sys-color-surface-container-lowest)",
            borderBottom: "1px solid var(--md-sys-color-outline)",
          }}
        >
          <Space size="middle" wrap>
            <Typography.Text strong>{context.email}</Typography.Text>
            <Tag color="blue">{context.activeDestination?.label ?? "No active destination"}</Tag>
            {context.activeWorkspace.hospitalName ? (
              <Typography.Text type="secondary">
                {context.activeWorkspace.hospitalName}
              </Typography.Text>
            ) : null}
          </Space>
          <Space size="small">
            <Button type="text" href={siteUrl("/workspace?switch=1")}>
              Switch workspace
            </Button>
            <LogoutButton />
          </Space>
        </Layout.Header>
        <Layout.Content style={{ padding: "var(--space-6)" }}>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
}
