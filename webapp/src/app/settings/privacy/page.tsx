"use client";

import { Shield, Download, Trash2, AlertTriangle } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function PrivacyPage() {
  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>Data & Privacy</h2>

      {/* Export */}
      <Card title="Export your data" icon={Download}>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px", lineHeight: 1.7 }}>
          Download a complete archive of your workspace — API keys metadata, saved preferences,
          and usage logs — as a JSON file.
        </p>
        <Button variant="default">
          <Download size={14} /> Export data
        </Button>
      </Card>

      {/* Compliance badge */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          padding: "16px 20px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          marginBottom: "20px",
        }}
      >
        <Shield size={16} color="var(--green)" style={{ marginTop: "2px", flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)", marginBottom: "4px" }}>
            Privacy compliant
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
            Forge stores only the data you explicitly provide. No analytics, no third-party trackers.
            Contract code is never transmitted to external servers.
          </p>
        </div>
      </div>

      {/* Danger zone */}
      <Card title="Delete account" icon={Trash2} danger>
        <div
          style={{
            background: "var(--red-dim)",
            border: "1px solid rgba(248,81,73,0.3)",
            borderRadius: "var(--radius)",
            padding: "14px 16px",
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            alignItems: "flex-start",
          }}
        >
          <AlertTriangle size={15} color="var(--red)" style={{ flexShrink: 0, marginTop: "1px" }} />
          <p style={{ fontSize: "13px", color: "var(--red)", lineHeight: 1.6, margin: 0 }}>
            This is permanent. All API keys will be revoked immediately and your workspace data
            will be deleted within 30 days. This action cannot be undone.
          </p>
        </div>
        <Button variant="danger">
          <Trash2 size={14} /> Delete my account
        </Button>
      </Card>
    </div>
  );
}
