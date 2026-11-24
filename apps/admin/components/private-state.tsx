import type { ReactNode } from "react";

export function PrivateState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <main
      style={{
        maxWidth: 560,
        margin: "80px auto",
        padding: 28,
        border: "1px solid currentColor",
        borderRadius: 10,
        textAlign: "center",
      }}
    >
      <h1 style={{ margin: "0 0 10px" }}>{title}</h1>
      <p style={{ margin: "0 0 18px", lineHeight: 1.6, opacity: 0.75 }}>{description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {children}
      </div>
    </main>
  );
}
