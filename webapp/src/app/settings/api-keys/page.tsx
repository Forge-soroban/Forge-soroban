"use client";

import { useState } from "react";
import { Plus, Trash2, Copy, Check, Key } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { generateApiKey, formatDate } from "@/lib/utils";
import type { ApiKey } from "@/types";

const INITIAL_KEYS: ApiKey[] = [
  { id: "1", name: "Development",  key: "sk_test_51Mz9...x9J2", created: "2026-03-24" },
  { id: "2", name: "Production",   key: "sk_live_82F1...aZ88", created: "2026-03-01" },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const create = () => {
    const name = newName.trim() || "New key";
    const key: ApiKey = {
      id: crypto.randomUUID(),
      name,
      key: generateApiKey("sk_test"),
      created: new Date().toISOString().split("T")[0],
    };
    setKeys((prev) => [key, ...prev]);
    setNewName("");
  };

  const remove = (id: string) => setKeys((prev) => prev.filter((k) => k.id !== id));

  const copy = (id: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>API Keys</h2>

      {/* Create new key */}
      <Card title="Generate a new key" icon={Key}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px", lineHeight: 1.6 }}>
          API keys grant programmatic access to your Forge workspace. Never commit them to version control.
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Key name (e.g. CI pipeline)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && create()}
            style={{
              flex: 1,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "8px 12px",
              color: "var(--text)",
              fontSize: "14px",
              outline: "none",
              fontFamily: "var(--font-sans)",
            }}
          />
          <Button variant="primary" onClick={create}>
            <Plus size={14} /> Generate
          </Button>
        </div>
      </Card>

      {/* Key table */}
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 2.5fr 1.2fr 80px",
            padding: "10px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            color: "var(--text-subtle)",
          }}
        >
          <span>Name</span>
          <span>Key</span>
          <span>Created</span>
          <span style={{ textAlign: "right" }}>Actions</span>
        </div>

        {keys.length === 0 && (
          <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
            No keys yet. Generate one above.
          </div>
        )}

        {keys.map((k) => (
          <div
            key={k.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 2.5fr 1.2fr 80px",
              padding: "14px 20px",
              borderBottom: "1px solid var(--border-subtle)",
              alignItems: "center",
              fontSize: "13px",
            }}
          >
            <span style={{ fontWeight: 600 }}>{k.name}</span>
            <code
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "var(--text-muted)",
                background: "var(--bg)",
                padding: "3px 8px",
                borderRadius: "4px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {k.key}
            </code>
            <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{formatDate(k.created)}</span>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px" }}>
              <Button variant="ghost" size="sm" onClick={() => copy(k.id, k.key)} title="Copy key">
                {copiedId === k.id ? <Check size={13} color="var(--green)" /> : <Copy size={13} />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => remove(k.id)} title="Delete key">
                <Trash2 size={13} color="var(--red)" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: "16px", fontSize: "12px", color: "var(--text-subtle)", lineHeight: 1.6 }}>
        Keys are shown only once. Store them securely in environment variables.
      </p>
    </div>
  );
}
