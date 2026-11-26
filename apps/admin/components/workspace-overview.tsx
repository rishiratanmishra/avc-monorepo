import type { AccessContext } from "@repo/contracts";
import { Card, Space, Tag, Typography } from "antd";
import { AdminPage } from "./admin-page";
import { permissionsForArea, type AdminArea } from "../lib/admin-nav";

export function WorkspaceOverview({ context, area }: { context: AccessContext; area: AdminArea }) {
  const permissions = permissionsForArea(area, context.activeWorkspace.permissions);

  return (
    <AdminPage
      title={area === "practice" ? "Practice overview" : "Platform overview"}
      description="This workspace was authorized by the API for the active session. Every protected request is revalidated server-side."
    >
      <Card>
        <Space orientation="vertical" size="middle" style={{ display: "flex" }}>
          <Typography.Paragraph>
            <Typography.Text strong>Active hospital:</Typography.Text>{" "}
            {context.activeWorkspace.hospitalName ?? "Not applicable"}
          </Typography.Paragraph>
          <div>
            <Typography.Text strong>Effective permissions</Typography.Text>
            <div style={{ marginTop: "var(--space-2)" }}>
              <Space size={[8, 8]} wrap>
                {permissions.length > 0 ? (
                  permissions.map((permission) => <Tag key={permission}>{permission}</Tag>)
                ) : (
                  <Typography.Text type="secondary">
                    No permissions are active for this area.
                  </Typography.Text>
                )}
              </Space>
            </div>
          </div>
        </Space>
      </Card>
    </AdminPage>
  );
}
