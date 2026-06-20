"use client";

import { useState, useMemo } from "react";
import { Search, Copy, Check, ExternalLink } from "lucide-react";
import { BLUEPRINTS } from "@/data/blueprints";
import type { Blueprint } from "@/types";

const FILTERS = ["all", "basics", "intermediate", "advanced", "defi", "tokens", "governance", "nfts"];

const FILTER_LABELS: Record<string, string> = {
  all: "All",
  basics: "Basics",
  intermediate: "Intermediate",
  advanced: "Advanced",
  defi: "DeFi",
  tokens: "Tokens",
  governance: "Governance",
  nfts: "NFTs",
};

const TAG_COLORS: Record<string, { color: string; bg: string }> = {
  basics:       { color: "var(--accent)",  bg: "var(--accent-dim)" },
  intermediate: { color: "var(--green)",   bg: "var(--green-dim)" },
  advanced:     { color: "var(--purple)",  bg: "var(--purple-dim)" },
  defi:         { color: "var(--amber)",   bg: "var(--amber-dim)" },
  tokens:       { color: "var(--accent)",  bg: "var(--accent-dim)" },
  governance:   { color: "var(--red)",     bg: "var(--red-dim)" },
  nfts:         { color: "var(--purple)",  bg: "var(--purple-dim)" },
};

export default function BlueprintsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(BLUEPRINTS[0].id);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    return BLUEPRINTS.filter((bp) => {
      const matchFilter = activeFilter === "all" || bp.category === activeFilter;
      const matchSearch =
        !search ||
        bp.title.toLowerCase().includes(search.toLowerCase()) ||
        bp.description.toLowerCase().includes(search.toLowerCase()) ||
        bp.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchFilter && matchSearch;
    });
  }, [activeFilter, search]);

  const activeBp = BLUEPRINTS.find((b) => b.id === selected) ?? filtered[0];

  const copy = () => {
    if (!activeBp) return;
    navigator.clipboard.writeText(activeBp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 57px)", overflow: "hidden" }}>
      {/* Left panel — list */}
      <aside
        style={{
          width: "340px",
          minWidth: "260px",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "var(--bg-surface)",
        }}
      >
        {/* Search */}
        <div style={{ padding: "16px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Search blueprints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "7px 10px 7px 30px",
                color: "var(--text)",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            padding: "10px 16px",
            borderBottom: "1px solid var(--border-subtle)",
            flexWrap: "wrap",
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: "4px 10px",
                borderRadius: "20px",
                border: "1px solid",
                borderColor: activeFilter === f ? "var(--accent)" : "var(--border)",
                background: activeFilter === f ? "var(--accent-dim)" : "transparent",
                color: activeFilter === f ? "var(--accent)" : "var(--text-muted)",
                fontSize: "12px",
                fontWeight: activeFilter === f ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>

        {/* Blueprint list */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
              No blueprints match your search.
            </div>
          ) : (
            filtered.map((bp) => {
              const tagStyle = TAG_COLORS[bp.category] ?? TAG_COLORS.basics;
              const isSelected = selected === bp.id;
              return (
                <button
                  key={bp.id}
                  onClick={() => setSelected(bp.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "14px 16px",
                    background: isSelected ? "var(--bg-hover)" : "transparent",
                    borderLeft: isSelected ? "2px solid var(--accent)" : "2px solid transparent",
                    borderTop: "none",
                    borderRight: "none",
                    borderBottom: "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                    <span style={{ fontWeight: 600, fontSize: "13px", color: isSelected ? "var(--text)" : "var(--text)", lineHeight: 1.4 }}>
                      {bp.title}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: tagStyle.color,
                        background: tagStyle.bg,
                        padding: "2px 7px",
                        borderRadius: "20px",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {bp.category}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
                    {bp.description}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Right panel — code */}
      {activeBp ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexShrink: 0,
            }}
          >
            <div>
              <h1 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>
                {activeBp.title}
              </h1>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {activeBp.description}
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                onClick={copy}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: copied ? "var(--green)" : "var(--text-muted)",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "color 0.15s",
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </button>
              {activeBp.githubPath && (
                <a
                  href={`https://github.com/Forge-soroban/Forge-soroban/tree/main/${activeBp.githubPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 14px",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={13} />
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Tags & meta */}
          <div
            style={{
              padding: "12px 24px",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex",
              gap: "8px",
              alignItems: "center",
              flexWrap: "wrap",
              flexShrink: 0,
            }}
          >
            {activeBp.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  background: "var(--bg-hover)",
                  border: "1px solid var(--border-subtle)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                {tag}
              </span>
            ))}
            <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--text-subtle)" }}>
              Rust · Soroban SDK
            </span>
          </div>

          {/* Code */}
          <div style={{ flex: 1, overflow: "auto", background: "var(--bg)" }}>
            <pre
              style={{
                margin: 0,
                padding: "24px",
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                lineHeight: "1.75",
                color: "var(--text)",
                whiteSpace: "pre",
                tabSize: 4,
              }}
              dangerouslySetInnerHTML={{ __html: activeBp.highlightedCode ?? activeBp.code }}
            />
          </div>

          {/* Concepts footer */}
          {activeBp.concepts && activeBp.concepts.length > 0 && (
            <div
              style={{
                padding: "14px 24px",
                borderTop: "1px solid var(--border-subtle)",
                background: "var(--bg-surface)",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                Concepts:{" "}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {activeBp.concepts.join(" · ")}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
          Select a blueprint from the list
        </div>
      )}
    </div>
  );
}
