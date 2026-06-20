"use client";

import { useId, useState } from "react";
import { Globe, Palette, Languages } from "lucide-react";
import Card from "@/components/ui/Card";
import Label from "@/components/ui/Label";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const THEMES = [
  { id: "dark",   label: "Dark",        accent: "var(--accent)" },
  { id: "amber",  label: "Amber",       accent: "#e3b341" },
  { id: "purple", label: "Purple",      accent: "#bc8cff" },
];

export default function PreferencesPage() {
  const timezoneId  = useId();
  const languageId  = useId();
  const [theme, setTheme] = useState("dark");
  const [saved, setSaved]  = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>Preferences</h2>

      {/* Timezone */}
      <Card title="Timezone" icon={Globe}>
        <Label htmlFor={timezoneId}>Display timezone</Label>
        <Select id={timezoneId} defaultValue="UTC">
          <option value="UTC">UTC (GMT+00:00)</option>
          <option value="EST">Eastern — EST (GMT−05:00)</option>
          <option value="CET">Central European — CET (GMT+01:00)</option>
          <option value="IST">India — IST (GMT+05:30)</option>
          <option value="JST">Japan — JST (GMT+09:00)</option>
          <option value="PST">Pacific — PST (GMT−08:00)</option>
        </Select>
        <p style={{ fontSize: "12px", color: "var(--text-subtle)", marginTop: "-8px" }}>
          Timestamps in the gas meter and blueprint metadata will use this timezone.
        </p>
      </Card>

      {/* Theme */}
      <Card title="Accent color" icon={Palette}>
        <Label>Choose your accent</Label>
        <div style={{ display: "flex", gap: "10px", marginBottom: "4px" }}>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: theme === t.id ? "var(--bg-hover)" : "transparent",
                border: `1px solid ${theme === t.id ? t.accent : "var(--border)"}`,
                borderRadius: "var(--radius)",
                color: theme === t.id ? t.accent : "var(--text-muted)",
                fontSize: "13px",
                fontWeight: theme === t.id ? 600 : 400,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                transition: "all 0.15s",
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: t.accent,
                  flexShrink: 0,
                }}
              />
              {t.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: "12px", color: "var(--text-subtle)", marginTop: "8px" }}>
          Theme changes will be applied globally on save.
        </p>
      </Card>

      {/* Language */}
      <Card title="Language" icon={Languages}>
        <Label htmlFor={languageId}>Display language</Label>
        <Select id={languageId} defaultValue="en">
          <option value="en">English (US)</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="ja">日本語</option>
          <option value="zh">中文 (简体)</option>
        </Select>
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant={saved ? "default" : "primary"} onClick={save}>
          {saved ? "✓ Saved" : "Save preferences"}
        </Button>
      </div>
    </div>
  );
}
