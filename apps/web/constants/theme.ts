/**
 * Brand color schema and typography tokens
 * Maintained in sync with apps/admin theme tokens
 */
export const THEME = {
  colors: {
    primary: "#147d73",
    primaryHover: "#0f6159",
    primaryLight: "#e6f4f2",
    primarySubtle: "#b2dfdb",
    textPrimary: "#172b4d",
    textSecondary: "#5e6c84",
    textMuted: "#8a97a8",
    background: "#f5f7fa",
    cardBackground: "#ffffff",
    border: "#e8edf2",
    emergency: "#d9383a",
    success: "#107c41",
    warning: "#d97706",
  },
  fonts: {
    body: 'Arial, Helvetica, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  borderRadius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    full: "9999px",
  },
} as const;
