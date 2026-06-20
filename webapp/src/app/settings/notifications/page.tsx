"use client";

import { useState } from "react";
import { Bell, Globe, Smartphone, Mail } from "lucide-react";
import Card from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";

interface NotificationPref {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

const NOTIFICATION_TYPES: NotificationPref[] = [
  {
    id: "tx_confirm",
    name: "Transaction confirmations",
    description: "Get notified when a contract call is finalized on-chain.",
    icon: Globe,
  },
  {
    id: "security",
    name: "Security alerts",
    description: "Alerts for new sign-ins, password changes, and API key usage.",
    icon: Smartphone,
  },
  {
    id: "ecosystem",
    name: "Ecosystem updates",
    description: "New blueprints, Soroban SDK releases, and community highlights.",
    icon: Mail,
  },
];

type PrefState = Record<string, boolean>;

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<PrefState>({
    tx_confirm: true,
    security: true,
    ecosystem: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) =>
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>Notifications</h2>

      <Card title="Alert preferences" icon={Bell}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {NOTIFICATION_TYPES.map((type, i) => {
            const Icon = type.icon;
            return (
              <div
                key={type.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 0",
                  borderBottom:
                    i < NOTIFICATION_TYPES.length - 1
                      ? "1px solid var(--border-subtle)"
                      : "none",
                  gap: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <Icon
                    size={16}
                    color="var(--text-muted)"
                    style={{ marginTop: "2px", flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "3px" }}>
                      {type.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>
                      {type.description}
                    </div>
                  </div>
                </div>
                <Toggle
                  checked={!!prefs[type.id]}
                  onChange={() => toggle(type.id)}
                  label={`Toggle ${type.name}`}
                />
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant={saved ? "default" : "primary"} onClick={save}>
          {saved ? "✓ Saved" : "Save preferences"}
        </Button>
      </div>
    </div>
  );
}
