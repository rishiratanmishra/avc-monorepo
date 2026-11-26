import { Space, Typography } from "antd";
import type { ReactNode } from "react";

export function AdminPage({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Space orientation="vertical" size="large" style={{ display: "flex", width: "100%" }}>
      <Space
        align="center"
        size="middle"
        style={{ display: "flex", justifyContent: "space-between", width: "100%" }}
        wrap
      >
        <div>
          <Typography.Title level={2} style={{ marginBottom: description ? 4 : 0 }}>
            {title}
          </Typography.Title>
          {description ? (
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {description}
            </Typography.Paragraph>
          ) : null}
        </div>
        {actions ? <Space size="small">{actions}</Space> : null}
      </Space>
      {children}
    </Space>
  );
}
