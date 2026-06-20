"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, ArrowRightLeft, Zap, Settings, X } from "lucide-react";

const COMMANDS = [
  { label: "Browse Blueprints",       href: "/blueprints",          icon: BookOpen,       hint: "Pattern library" },
  { label: "Solidity → Soroban Diff", href: "/diff",                icon: ArrowRightLeft, hint: "Side-by-side comparison" },
  { label: "Gas Meter",               href: "/gas",                 icon: Zap,            hint: "Resource cost estimator" },
  { label: "Hello World",             href: "/blueprints?filter=basics", icon: BookOpen,  hint: "Blueprint" },
  { label: "AMM / DeFi patterns",     href: "/blueprints?filter=defi",   icon: BookOpen,  hint: "Blueprint" },
  { label: "Token patterns",          href: "/blueprints?filter=tokens", icon: BookOpen,  hint: "Blueprint" },
  { label: "Workspace settings",      href: "/settings/account",    icon: Settings,       hint: "Settings" },
  { label: "API Keys",                href: "/settings/api-keys",   icon: Settings,       hint: "Settings" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Open on Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = COMMANDS.filter(
    (c) =>
      !query ||
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.hint.toLowerCase().includes(query.toLowerCase())
  );

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      setOpen(false);
      setQuery("");
    },
    [router]
  );

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 999,
        }}
      />

      {/* Palette */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(560px, 92vw)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          zIndex: 1000,
          overflow: "hidden",
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            autoFocus
            type="text"
            placeholder="Search blueprints, diff patterns, gas…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filtered[0]) navigate(filtered[0].href);
            }}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text)",
              fontSize: "15px",
              fontFamily: "var(--font-sans)",
            }}
          />
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "transparent",
              border: "1px solid var(--border-subtle)",
              borderRadius: "4px",
              color: "var(--text-muted)",
              fontSize: "11px",
              padding: "2px 6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <X size={10} /> Esc
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: "320px", overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "28px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "14px",
              }}
            >
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.href + cmd.label}
                  onClick={() => navigate(cmd.href)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "var(--text)",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bg-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <Icon size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: "14px", flex: 1 }}>{cmd.label}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-subtle)",
                      background: "var(--bg-hover)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {cmd.hint}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid var(--border-subtle)",
            fontSize: "11px",
            color: "var(--text-subtle)",
            display: "flex",
            gap: "16px",
          }}
        >
          <span>↵ Select</span>
          <span>↑↓ Navigate</span>
          <span>Esc Close</span>
        </div>
      </div>
    </>
  );
}
