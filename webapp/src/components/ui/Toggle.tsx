"use client";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export default function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      style={{
        width: "40px",
        height: "22px",
        borderRadius: "11px",
        background: checked ? "var(--accent)" : "var(--bg-hover)",
        border: `1px solid ${checked ? "var(--accent)" : "var(--border)"}`,
        position: "relative",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background 0.2s, border-color 0.2s",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "2px",
          left: checked ? "20px" : "2px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: checked ? "#0d1117" : "var(--text-muted)",
          transition: "left 0.2s",
          display: "block",
        }}
      />
    </button>
  );
}
