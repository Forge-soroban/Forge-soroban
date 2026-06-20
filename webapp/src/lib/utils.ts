// ─── Utility helpers ──────────────────────────────────────────────────────────

/** Generate a random prefixed API key string (demo only — not cryptographically secure) */
export function generateApiKey(prefix: "sk_test" | "sk_live" = "sk_test"): string {
  const rand = () => Math.random().toString(36).substring(2, 10);
  return `${prefix}_${rand()}...${rand().substring(0, 4)}`;
}

/** Format a date string to locale-friendly display */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Return a percentage string clamped to 0–100 */
export function toPercent(value: number, max: number): string {
  return `${clamp(Math.round((value / max) * 100), 0, 100)}%`;
}

/** Truncate a string with an ellipsis */
export function truncate(str: string, maxLength = 40): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "…";
}

/** Password strength score 0–4 */
export function passwordStrength(pwd: string): number {
  let score = 0;
  if (pwd.length > 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

export const STRENGTH_LABELS = ["", "Weak", "Moderate", "Strong", "Very strong"] as const;
export const STRENGTH_COLORS = [
  "",
  "var(--red)",
  "var(--amber)",
  "var(--green)",
  "var(--green)",
] as const;
