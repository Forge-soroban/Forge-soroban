"use client";

import Link from "next/link";
import {
  BookOpen,
  ArrowRightLeft,
  Zap,
  ArrowRight,
  Code2,
  Shield,
  Layers,
  Coins,
  Vote,
  Sparkles,
} from "lucide-react";

const PATHS = [
  {
    icon: BookOpen,
    color: "var(--accent)",
    colorDim: "var(--accent-dim)",
    colorBorder: "rgba(90, 169, 230, 0.3)",
    title: "I'm new to Soroban",
    description:
      "Start from zero. We'll walk you through your first contract, storage patterns, authentication, and events step by step.",
    cta: "Start the basics path",
    href: "/blueprints?filter=basics",
    badge: "Beginner",
    badgeColor: "var(--green)",
    badgeBg: "var(--green-dim)",
  },
  {
    icon: ArrowRightLeft,
    color: "var(--purple)",
    colorDim: "var(--purple-dim)",
    colorBorder: "rgba(188, 140, 255, 0.3)",
    title: "I'm coming from Ethereum",
    description:
      "Already know Solidity? See every pattern side-by-side: mappings vs storage, modifiers vs auth, events, error handling.",
    cta: "Open the diff viewer",
    href: "/diff",
    badge: "Ethereum → Soroban",
    badgeColor: "var(--purple)",
    badgeBg: "var(--purple-dim)",
  },
  {
    icon: Zap,
    color: "var(--amber)",
    colorDim: "var(--amber-dim)",
    colorBorder: "rgba(227, 179, 65, 0.3)",
    title: "I need a specific pattern",
    description:
      "Browse production-ready blueprints by category: DeFi, NFTs, tokens, governance, storage, auth. All compile and have tests.",
    cta: "Browse all blueprints",
    href: "/blueprints",
    badge: "All levels",
    badgeColor: "var(--amber)",
    badgeBg: "var(--amber-dim)",
  },
];

const CATEGORIES = [
  { icon: Code2,   label: "Basics",      count: 9,  href: "/blueprints?filter=basics",      color: "var(--accent)" },
  { icon: Layers,  label: "Intermediate", count: 6,  href: "/blueprints?filter=intermediate", color: "var(--green)" },
  { icon: Sparkles,label: "Advanced",    count: 4,  href: "/blueprints?filter=advanced",    color: "var(--purple)" },
  { icon: Coins,   label: "DeFi",        count: 8,  href: "/blueprints?filter=defi",        color: "var(--amber)" },
  { icon: Shield,  label: "Tokens",      count: 5,  href: "/blueprints?filter=tokens",      color: "var(--accent)" },
  { icon: Vote,    label: "Governance",  count: 3,  href: "/blueprints?filter=governance",  color: "var(--red)" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section
        style={{
          padding: "80px 32px 64px",
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--accent-dim)",
            border: "1px solid rgba(90, 169, 230, 0.3)",
            borderRadius: "20px",
            padding: "4px 14px",
            marginBottom: "28px",
            fontSize: "13px",
            color: "var(--accent)",
            fontWeight: 500,
          }}
        >
          <Zap size={13} fill="var(--accent)" />
          Soroban Smart Contract Lab
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 800,
            letterSpacing: "-1px",
            lineHeight: 1.15,
            marginBottom: "20px",
            background: "linear-gradient(135deg, var(--text) 0%, var(--text-muted) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Build Soroban contracts
          <br />
          without the guesswork
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "var(--text-muted)",
            maxWidth: "560px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          Production-ready blueprints, a Solidity→Rust diff viewer, and a live
          gas meter. Everything you need to ship contracts on Stellar.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/blueprints"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--accent)",
              color: "#0d1117",
              padding: "10px 22px",
              borderRadius: "var(--radius)",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
          >
            Browse Blueprints
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/diff"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--bg-surface)",
              color: "var(--text)",
              padding: "10px 22px",
              borderRadius: "var(--radius)",
              fontWeight: 500,
              fontSize: "15px",
              border: "1px solid var(--border)",
              textDecoration: "none",
            }}
          >
            <ArrowRightLeft size={15} />
            Solidity → Soroban
          </Link>
        </div>
      </section>

      {/* Path cards */}
      <section
        style={{
          padding: "0 32px 72px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "var(--text-muted)",
            fontWeight: 600,
            marginBottom: "20px",
          }}
        >
          Where do you want to start?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {PATHS.map((path) => {
            const Icon = path.icon;
            return (
              <Link
                key={path.href}
                href={path.href}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "var(--bg-surface)",
                    border: `1px solid var(--border)`,
                    borderRadius: "var(--radius-lg)",
                    padding: "28px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    cursor: "pointer",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = path.colorBorder;
                    (e.currentTarget as HTMLDivElement).style.background = "var(--bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLDivElement).style.background = "var(--bg-surface)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        background: path.colorDim,
                        border: `1px solid ${path.colorBorder}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={20} color={path.color} />
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: path.badgeColor,
                        background: path.badgeBg,
                        padding: "3px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      {path.badge}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "17px", marginBottom: "8px", fontWeight: 700 }}>
                      {path.title}
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6 }}>
                      {path.description}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: path.color,
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {path.cta}
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section
        style={{
          padding: "0 32px 80px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "var(--text-muted)",
              fontWeight: 600,
            }}
          >
            Browse by category
          </h2>
          <Link
            href="/blueprints"
            style={{ fontSize: "13px", color: "var(--accent)" }}
          >
            View all →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "12px",
          }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "20px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    cursor: "pointer",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "var(--bg-hover)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "var(--bg-surface)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                  }}
                >
                  <Icon size={20} color={cat.color} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "2px" }}>
                      {cat.label}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                      {cat.count} blueprints
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Feature highlights */}
      <section
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "64px 32px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "40px",
          }}
        >
          {[
            {
              icon: "⚡",
              title: "Every example compiles",
              body: "Every blueprint in Forge builds against the latest Soroban SDK and ships with unit + integration tests.",
            },
            {
              icon: "↔",
              title: "Solidity diff viewer",
              body: "See the exact Soroban equivalent of any Solidity pattern side-by-side. Mappings, modifiers, events, errors — all covered.",
            },
            {
              icon: "⛽",
              title: "Live gas meter",
              body: "Understand Soroban's resource model before you deploy. Compute units, ledger entries, TTL — visualized per example.",
            },
          ].map((feat) => (
            <div key={feat.title}>
              <div
                style={{
                  fontSize: "28px",
                  marginBottom: "12px",
                  lineHeight: 1,
                }}
              >
                {feat.icon}
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>
                {feat.title}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.7 }}>
                {feat.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
