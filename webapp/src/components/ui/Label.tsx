import type { ReactNode } from "react";

export default function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        fontSize: "13px",
        fontWeight: 500,
        color: "var(--text-muted)",
        marginBottom: "6px",
      }}
    >
      {children}
    </label>
  );
}
