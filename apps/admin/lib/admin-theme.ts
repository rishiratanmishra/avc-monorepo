import type { ThemeConfig } from "antd";

/**
 * Admin-local aliases for the AVC brand tokens defined in `apps/web/app/globals.css`.
 * They are applied as CSS custom properties in the admin root layout because
 * shared form primitives consume the same token names. A shared theme pipeline
 * can replace this mapping without changing consuming components.
 */
export const ADMIN_CSS_TOKENS: Record<string, string> = {
  "--font-family-heading": "var(--font-heading), Georgia, serif",
  "--font-family-body":
    "var(--font-body), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

  "--font-size-body-md": "15px",
  "--font-size-label-md": "12px",
  "--typescale-label-large": "600 14px/20px var(--font-family-body)",

  "--space-1": "4px",
  "--space-2": "8px",
  "--space-3": "12px",
  "--space-4": "16px",
  "--space-5": "20px",
  "--space-6": "24px",
  "--space-12": "48px",
  "--space-16": "64px",
  "--space-24": "96px",

  "--radius-sm": "8px",

  "--md-sys-color-primary": "#1b75bb",
  "--md-sys-color-primary-hover": "#155e96",
  "--md-sys-color-on-primary": "#ffffff",
  "--md-sys-color-primary-container": "#e6f1f9",

  "--md-sys-color-secondary": "#147d73",
  "--md-sys-color-on-secondary": "#ffffff",
  "--md-sys-color-secondary-container": "#e0f2f1",

  "--md-sys-color-surface": "#fbf8f3",
  "--md-sys-color-surface-container-lowest": "#ffffff",
  "--md-sys-color-surface-container": "#f5f0e6",
  "--md-sys-color-on-surface": "#2b2520",
  "--md-sys-color-on-surface-variant": "#5e5852",
  "--md-sys-color-outline": "#e2dad0",

  "--md-sys-color-error": "#ba1a1a",
  "--md-sys-color-error-container": "#fff1f0",
  "--md-sys-color-on-error": "#ffffff",
};

export const ADMIN_ANT_THEME: ThemeConfig = {
  token: {
    colorPrimary: "#1b75bb",
    colorText: "#2b2520",
    colorBgLayout: "#fbf8f3",
    colorBgContainer: "#ffffff",
    colorBorder: "#e2dad0",
    borderRadius: 8,
    fontFamily: "var(--font-family-body)",
  },
};
