import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "primary" | "danger" | "ghost";
  size?: "sm" | "md";
}

export default function Button({
  children,
  variant = "default",
  size = "md",
  style,
  ...props
}: ButtonProps) {
  const colors = {
    default: {
      bg: "transparent",
      border: "var(--border)",
      color: "var(--text)",
      hoverBg: "var(--bg-hover)",
    },
    primary: {
      bg: "var(--accent)",
      border: "var(--accent)",
      color: "#0d1117",
      hoverBg: "var(--accent-hover)",
    },
    danger: {
      bg: "transparent",
      border: "var(--red)",
      color: "var(--red)",
      hoverBg: "var(--red-dim)",
    },
    ghost: {
      bg: "transparent",
      border: "transparent",
      color: "var(--text-muted)",
      hoverBg: "var(--bg-hover)",
    },
  }[variant];

  const padding = size === "sm" ? "5px 12px" : "8px 18px";
  const fontSize = size === "sm" ? "12px" : "13px";

  return (
    <button
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "var(--radius)",
        color: colors.color,
        fontSize,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = colors.hoverBg;
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = colors.bg;
        props.onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}
