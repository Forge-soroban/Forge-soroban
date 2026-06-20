import type { ReactNode, CSSProperties } from "react";

type BadgeVariant = "blue" | "green" | "amber" | "red" | "purple" | "default";

const VARIANT_STYLES: Record<BadgeVariant, { color: string; bg: string; border: string }> = {
  blue:    { color: "var(--accent)",  bg: "var(--accent-dim)",  border: "rgba(90,169,230,0.3)" },
  green:   { color: "var(--green)",   bg: "var(--green-dim)",   border: "rgba(63,185,80,0.3)" },
  amber:   { color: "var(--amber)",   bg: "var(--amber-dim)",   border: "rgba(227,179,65,0.3)" },
  red:     { color: "var(--red)",     bg: "var(--red-dim)",     border: "rgba(248,81,73,0.3)" },
  purple:  { color: "var(--purple)",  bg: "var(--purple-dim)",  border: "rgba(188,140,255,0.3)" },
  default: { color: "var(--text-muted)", bg: "var(--bg-hover)", border: "var(--border-subtle)" },
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  style?: CSSProperties;
}

export default function Badge({ children, variant = "default", style }: BadgeProps) {
  const v = VARIANT_STYLES[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: "11px",
        fontWeight: 600,
        color: v.color,
        background: v.bg,
        border: `1px solid ${v.border}`,
        borderRadius: "20px",
        padding: "2px 8px",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
