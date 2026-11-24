"use client";

import type { AccessContext } from "@repo/contracts";
import { AppstoreOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button, Card, Layout, Menu, Space, Tag, Typography } from "antd";
import { siteUrl } from "../lib/site-url";
import { LogoutButton } from "./logout-button";

const { Content, Header, Sider } = Layout;
const { Paragraph, Text, Title } = Typography;

export function AdminShell({
  context,
  area,
}: {
  context: AccessContext;
  area: "practice" | "platform";
}) {
  const isPractice = area === "practice";
  const permissionPrefix = isPractice ? "hospital." : "platform.";
  const permissions = context.activeWorkspace.permissions.filter((permission) =>
    permission.startsWith(permissionPrefix),
  );
  const destination = context.activeDestination;
  const menuItems = [
    {
      key: area,
      icon: isPractice ? <AppstoreOutlined /> : <SafetyCertificateOutlined />,
      label: isPractice ? "Practice overview" : "Platform overview",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" breakpoint="lg" collapsedWidth="0">
        <div style={{ padding: "20px 16px" }}>
          <Title level={4} style={{ margin: 0 }}>
            AVC Manage
          </Title>
          <Text type="secondary">Authorized workspace</Text>
        </div>
        <Menu mode="inline" selectedKeys={[area]} items={menuItems} />
      </Sider>
      <Layout>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "transparent",
          }}
        >
          <Space size="middle" wrap>
            <Text strong>{context.email}</Text>
            <Tag>{destination?.label ?? "No active destination"}</Tag>
          </Space>
          <Space size="small">
            <Button
              type="text"
              onClick={() => window.location.assign(siteUrl("/workspace?switch=1"))}
            >
              Switch workspace
            </Button>
            <LogoutButton />
          </Space>
        </Header>
        <Content style={{ padding: 24 }}>
          <Card>
            <Title level={2}>{isPractice ? "Practice workspace" : "Platform workspace"}</Title>
            <Paragraph>
              This page is available because the API confirmed an active {area} destination for
              this session. Every protected request is revalidated server-side.
            </Paragraph>
            <Paragraph>
              <Text strong>Active hospital:</Text>{" "}
              {context.activeWorkspace.hospitalName ?? "Not applicable"}
            </Paragraph>
            <Title level={5}>Effective permissions</Title>
            <Space size={[8, 8]} wrap>
              {permissions.length > 0 ? (
                permissions.map((permission) => <Tag key={permission}>{permission}</Tag>)
              ) : (
                <Text type="secondary">No {area} permissions are active.</Text>
              )}
            </Space>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
