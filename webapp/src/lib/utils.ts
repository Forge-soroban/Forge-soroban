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

/** Convert bytes to a human-readable string (KB / MB) */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Debounce a function call */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
