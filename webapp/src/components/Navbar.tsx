"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Search } from "lucide-react";

const NAV_LINKS = [
  { label: "Blueprints", href: "/blueprints" },
  { label: "Diff Viewer", href: "/diff" },
  { label: "Gas Meter",   href: "/gas" },
  { label: "Workspace",   href: "/settings/account" },
];

export default function Navbar() {
  const pathname = usePathname();

  const openPalette = () =>
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true })
    );

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(13, 17, 23, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "0 32px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "var(--text)",
          textDecoration: "none",
          fontWeight: 700,
          fontSize: "16px",
          letterSpacing: "-0.3px",
          flexShrink: 0,
        }}
      >
        <Zap size={18} color="var(--accent)" fill="var(--accent)" />
        Forge
      </Link>

      {/* Nav links */}
      <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius)",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--text)" : "var(--text-muted)",
                background: isActive ? "var(--bg-hover)" : "transparent",
                textDecoration: "none",
                transition: "color 0.15s, background 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        {/* ⌘K trigger */}
        <button
          onClick={openPalette}
          title="Open command palette (Ctrl+K)"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--text-muted)",
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "var(--accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }
        >
          <Search size={12} />
          <span>Search</span>
          <kbd
            style={{
              marginLeft: "4px",
              fontSize: "10px",
              background: "var(--bg-hover)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "3px",
              padding: "1px 5px",
              color: "var(--text-subtle)",
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Network badge */}
        <span
          style={{
            fontSize: "12px",
            color: "var(--green)",
            background: "var(--green-dim)",
            padding: "3px 8px",
            borderRadius: "20px",
            border: "1px solid rgba(63, 185, 80, 0.3)",
            fontWeight: 500,
          }}
        >
          ● Testnet
        </span>

        <a
          href="https://github.com/Forge-soroban/Forge-soroban"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--text-muted)",
            fontSize: "13px",
            textDecoration: "none",
          }}
        >
          GitHub ↗
        </a>
      </div>
    </header>
  );
}
