import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  title: string;
  icon?: React.ElementType;
  children: ReactNode;
  danger?: boolean;
  style?: CSSProperties;
}

export default function Card({ title, icon: Icon, children, danger, style }: CardProps) {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: `1px solid ${danger ? "rgba(248,81,73,0.35)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        marginBottom: "20px",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {Icon && (
          <Icon size={16} color={danger ? "var(--red)" : "var(--accent)"} />
        )}
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 600,
            margin: 0,
            color: danger ? "var(--red)" : "var(--text)",
          }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
