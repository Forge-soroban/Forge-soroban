import type { CSSProperties } from "react";

interface DividerProps {
  label?: string;
  style?: CSSProperties;
}

export default function Divider({ label, style }: DividerProps) {
  if (!label) {
    return (
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--border-subtle)",
          margin: "20px 0",
          ...style,
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        margin: "20px 0",
        ...style,
      }}
    >
      <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--border-subtle)" }} />
      <span style={{ fontSize: "12px", color: "var(--text-subtle)", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--border-subtle)" }} />
    </div>
  );
}
