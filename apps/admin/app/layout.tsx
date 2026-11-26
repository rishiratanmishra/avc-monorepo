import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { Laila, Plus_Jakarta_Sans } from "next/font/google";
import type { CSSProperties } from "react";
import { ADMIN_ANT_THEME, ADMIN_CSS_TOKENS } from "../lib/admin-theme";
import { QueryProvider } from "../providers/query-provider";
import "antd/dist/reset.css";
import "./globals.css";

const laila = Laila({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AVC Admin",
  description: "AVC Pet Hospital management workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${laila.variable} ${plusJakartaSans.variable}`}
        style={ADMIN_CSS_TOKENS as CSSProperties}
      >
        <AntdRegistry>
          <ConfigProvider theme={ADMIN_ANT_THEME}>
            <QueryProvider>{children}</QueryProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
