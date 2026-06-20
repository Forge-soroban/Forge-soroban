"use client";

import { useState } from "react";
import { DIFFS } from "@/data/diffs";

export default function DiffPage() {
  const [selected, setSelected] = useState(DIFFS[0].id);
  const diff = DIFFS.find((d) => d.id === selected) ?? DIFFS[0];

  return (
    <div style={{ display: "flex", height: "calc(100vh - 57px)", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          minWidth: "200px",
          borderRight: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid var(--border-subtle)",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "var(--text-muted)",
          }}
        >
          Patterns
        </div>
        {DIFFS.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelected(d.id)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px 16px",
              background: selected === d.id ? "var(--bg-hover)" : "transparent",
              borderLeft: selected === d.id ? "2px solid var(--purple)" : "2px solid transparent",
              borderTop: "none",
              borderRight: "none",
              borderBottom: "1px solid var(--border-subtle)",
              cursor: "pointer",
              color: selected === d.id ? "var(--text)" : "var(--text-muted)",
              fontSize: "13px",
              fontWeight: selected === d.id ? 600 : 400,
            }}
          >
            {d.title}
          </button>
        ))}
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            flexShrink: 0,
          }}
        >
          <h1 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>
            {diff.title}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {diff.description}
          </p>
        </div>

        {/* Column headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid var(--border-subtle)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "10px 24px",
              borderRight: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#f6c90e",
                background: "rgba(246, 201, 14, 0.1)",
                border: "1px solid rgba(246, 201, 14, 0.3)",
                padding: "2px 10px",
                borderRadius: "20px",
              }}
            >
              Solidity (EVM)
            </span>
          </div>
          <div
            style={{
              padding: "10px 24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--accent)",
                background: "var(--accent-dim)",
                border: "1px solid rgba(90, 169, 230, 0.3)",
                padding: "2px 10px",
                borderRadius: "20px",
              }}
            >
              Rust (Soroban)
            </span>
          </div>
        </div>

        {/* Code panes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {/* Solidity */}
          <div
            style={{
              borderRight: "1px solid var(--border-subtle)",
              overflow: "auto",
              background: "rgba(246, 201, 14, 0.02)",
            }}
          >
            <pre
              style={{
                margin: 0,
                padding: "20px 24px",
                fontFamily: "var(--font-mono)",
                fontSize: "12.5px",
                lineHeight: "1.75",
                color: "var(--text)",
                whiteSpace: "pre",
              }}
            >
              {diff.solidity}
            </pre>
          </div>

          {/* Soroban */}
          <div style={{ overflow: "auto", background: "var(--bg)" }}>
            <pre
              style={{
                margin: 0,
                padding: "20px 24px",
                fontFamily: "var(--font-mono)",
                fontSize: "12.5px",
                lineHeight: "1.75",
                color: "var(--text)",
                whiteSpace: "pre",
              }}
            >
              {diff.soroban}
            </pre>
          </div>
        </div>

        {/* Notes */}
        {diff.notes && (
          <div
            style={{
              padding: "14px 24px",
              borderTop: "1px solid var(--border-subtle)",
              background: "var(--bg-surface)",
              flexShrink: 0,
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: "var(--amber)", fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>ℹ</span>
            <span style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
              {diff.notes}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
