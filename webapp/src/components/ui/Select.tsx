import type { SelectHTMLAttributes } from "react";

export default function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { style, children, ...rest } = props;
  return (
    <select
      {...rest}
      style={{
        width: "100%",
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "8px 12px",
        color: "var(--text)",
        fontSize: "14px",
        marginBottom: "16px",
        outline: "none",
        fontFamily: "var(--font-sans)",
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </select>
  );
}
