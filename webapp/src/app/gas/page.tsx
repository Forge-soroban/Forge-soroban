"use client";

import { useState } from "react";
import { GAS_EXAMPLES } from "@/data/gas";
import { Zap, Database, Clock, HardDrive } from "lucide-react";

function Meter({ label, value, max, color, icon: Icon }: {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: React.ElementType;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const level = pct < 30 ? "low" : pct < 70 ? "mid" : "high";
  const statusColor = level === "low" ? "var(--green)" : level === "mid" ? "var(--amber)" : "var(--red)";

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Icon size={16} color={color} />
          <span style={{ fontWeight: 600, fontSize: "14px" }}>{label}</span>
        </div>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: statusColor,
          }}
        >
          {value.toLocaleString()}
        </span>
      </div>

      {/* Bar */}
      <div
        style={{
          height: "6px",
          background: "var(--bg-hover)",
          borderRadius: "3px",
          overflow: "hidden",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: statusColor,
            borderRadius: "3px",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)" }}>
        <span>{pct.toFixed(0)}% of typical limit</span>
        <span style={{ color: statusColor, fontWeight: 600 }}>
          {level === "low" ? "✓ Cheap" : level === "mid" ? "⚠ Moderate" : "✗ Expensive"}
        </span>
      </div>
    </div>
  );
}

export default function GasPage() {
  const [selected, setSelected] = useState(GAS_EXAMPLES[0].id);
  const example = GAS_EXAMPLES.find((g) => g.id === selected) ?? GAS_EXAMPLES[0];

  const totalScore =
    (example.computeUnits / 100_000_000) * 40 +
    (example.ledgerReads / 20) * 30 +
    (example.ledgerWrites / 20) * 30;

  const overallLevel =
    totalScore < 1.5 ? "low" : totalScore < 3 ? "mid" : "high";

  const overallColor =
    overallLevel === "low"
      ? "var(--green)"
      : overallLevel === "mid"
      ? "var(--amber)"
      : "var(--red)";

  const overallLabel =
    overallLevel === "low"
      ? "Low cost"
      : overallLevel === "mid"
      ? "Moderate cost"
      : "High cost";

  return (
    <div style={{ display: "flex", height: "calc(100vh - 57px)", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "280px",
          minWidth: "220px",
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
          Contract Operations
        </div>
        {GAS_EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setSelected(ex.id)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "14px 16px",
              background: selected === ex.id ? "var(--bg-hover)" : "transparent",
              borderLeft: selected === ex.id ? "2px solid var(--amber)" : "2px solid transparent",
              borderTop: "none",
              borderRight: "none",
              borderBottom: "1px solid var(--border-subtle)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span
              style={{
                fontWeight: selected === ex.id ? 600 : 400,
                fontSize: "13px",
                color: selected === ex.id ? "var(--text)" : "var(--text-muted)",
              }}
            >
              {ex.title}
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-subtle)" }}>
              {ex.category}
            </span>
          </button>
        ))}
      </aside>

      {/* Main */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 700 }}>{example.title}</h1>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: overallColor,
                background: `${overallColor}18`,
                padding: "3px 12px",
                borderRadius: "20px",
                border: `1px solid ${overallColor}44`,
              }}
            >
              {overallLabel}
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{example.description}</p>
        </div>

        {/* Meters grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <Meter
            label="Compute Units"
            value={example.computeUnits}
            max={100_000_000}
            color="var(--accent)"
            icon={Zap}
          />
          <Meter
            label="Ledger Reads"
            value={example.ledgerReads}
            max={20}
            color="var(--green)"
            icon={Database}
          />
          <Meter
            label="Ledger Writes"
            value={example.ledgerWrites}
            max={20}
            color="var(--amber)"
            icon={HardDrive}
          />
          <Meter
            label="Ledger Bytes Written"
            value={example.bytesWritten}
            max={5000}
            color="var(--purple)"
            icon={Clock}
          />
        </div>

        {/* Breakdown table */}
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--border-subtle)",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text-muted)",
            }}
          >
            Resource Breakdown
          </div>
          {example.breakdown.map((item, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                padding: "12px 20px",
                borderBottom: i < example.breakdown.length - 1 ? "1px solid var(--border-subtle)" : "none",
                fontSize: "13px",
                alignItems: "center",
              }}
            >
              <span style={{ color: "var(--text)" }}>{item.operation}</span>
              <span style={{ color: "var(--text-muted)" }}>{item.cost}</span>
              <span
                style={{
                  color:
                    item.impact === "high"
                      ? "var(--red)"
                      : item.impact === "medium"
                      ? "var(--amber)"
                      : "var(--green)",
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              >
                {item.impact === "high"
                  ? "✗ High"
                  : item.impact === "medium"
                  ? "⚠ Medium"
                  : "✓ Low"}
              </span>
            </div>
          ))}
        </div>

        {/* Tips */}
        {example.tips && example.tips.length > 0 && (
          <div>
            <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Optimization Tips
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {example.tips.map((tip, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    borderLeft: "3px solid var(--accent)",
                    borderRadius: "var(--radius)",
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                  }}
                >
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
