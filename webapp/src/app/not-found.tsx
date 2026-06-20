import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 120px)",
        padding: "32px",
        textAlign: "center",
        gap: "20px",
      }}
    >
      <div
        style={{
          fontSize: "72px",
          fontWeight: 800,
          color: "var(--border)",
          lineHeight: 1,
          letterSpacing: "-4px",
        }}
      >
        404
      </div>
      <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text)" }}>
        Page not found
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "15px", maxWidth: "400px" }}>
        This route doesn&apos;t exist. Head back to the lab and pick a path.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--accent)",
          color: "#0d1117",
          padding: "10px 22px",
          borderRadius: "var(--radius)",
          fontWeight: 600,
          fontSize: "14px",
          textDecoration: "none",
          marginTop: "8px",
        }}
      >
        <Zap size={15} fill="#0d1117" />
        Back to Forge
      </Link>
    </div>
  );
}
