"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Settings, Key, Bell, Database } from "lucide-react";

const tabs = [
  { name: "Account",       href: "/settings/account",       icon: User },
  { name: "Preferences",   href: "/settings/preferences",   icon: Settings },
  { name: "API Keys",      href: "/settings/api-keys",      icon: Key },
  { name: "Notifications", href: "/settings/notifications", icon: Bell },
  { name: "Data & Privacy",href: "/settings/privacy",       icon: Database },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 57px)" }}>
      {/* Sidebar */}
      <nav
        style={{
          width: "220px",
          minWidth: "180px",
          borderRight: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
          padding: "24px 12px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "var(--text-subtle)",
            padding: "0 8px",
            marginBottom: "12px",
          }}
        >
          Workspace
        </div>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "2px" }}>
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <li key={tab.name}>
                <Link
                  href={tab.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 10px",
                    borderRadius: "var(--radius)",
                    color: isActive ? "var(--text)" : "var(--text-muted)",
                    background: isActive ? "var(--bg-hover)" : "transparent",
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: "none",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  <tab.icon size={15} />
                  {tab.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Content */}
      <section style={{ flex: 1, padding: "32px 40px", overflowY: "auto", maxWidth: "760px" }}>
        {children}
      </section>
    </div>
  );
}
