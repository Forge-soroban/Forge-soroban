"use client";

import { useState } from "react";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import Card from "@/components/ui/Card";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { passwordStrength, STRENGTH_LABELS, STRENGTH_COLORS } from "@/lib/utils";

export default function AccountPage() {
  const [password, setPassword] = useState("");
  const strength = passwordStrength(password);

  return (
    <div>
      <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>Account</h2>

      {/* Email */}
      <Card title="Email address" icon={Mail}>
        <Label>Current email</Label>
        <div
          style={{
            fontSize: "14px",
            marginBottom: "20px",
            color: "var(--accent)",
            fontFamily: "var(--font-mono)",
          }}
        >
          developer@soroban.forge
        </div>
        <Label>New email</Label>
        <Input type="email" placeholder="Enter new email…" />
        <Button variant="default">Update email</Button>
      </Card>

      {/* Password */}
      <Card title="Password" icon={Lock}>
        <Label>Current password</Label>
        <Input type="password" placeholder="••••••••" />
        <Label>New password</Label>
        <Input
          type="password"
          placeholder="Enter new password…"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Strength bar */}
        {password.length > 0 && (
          <div style={{ marginBottom: "16px", marginTop: "-8px" }}>
            <div
              style={{
                height: "4px",
                background: "var(--bg-hover)",
                borderRadius: "2px",
                overflow: "hidden",
                marginBottom: "6px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(strength / 4) * 100}%`,
                  background: STRENGTH_COLORS[strength] || "var(--border)",
                  borderRadius: "2px",
                  transition: "width 0.3s, background 0.3s",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "12px",
                color: STRENGTH_COLORS[strength] || "var(--text-muted)",
                fontWeight: 600,
              }}
            >
              {STRENGTH_LABELS[strength] || ""}
            </span>
          </div>
        )}

        <Button variant="default">Change password</Button>
      </Card>

      {/* 2FA */}
      <Card title="Two-factor authentication" icon={ShieldCheck}>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            marginBottom: "20px",
            lineHeight: 1.7,
          }}
        >
          Protect your account with an authenticator app. Once enabled, you&apos;ll need
          a one-time code in addition to your password on every sign-in.
        </p>
        <Button variant="primary">
          <ShieldCheck size={14} /> Enable 2FA
        </Button>
      </Card>
    </div>
  );
}
