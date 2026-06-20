// ─── Shared domain types ─────────────────────────────────────────────────────

export interface Blueprint {
  id: string;
  title: string;
  description: string;
  category: BlueprintCategory;
  tags: string[];
  concepts?: string[];
  githubPath?: string;
  code: string;
  highlightedCode?: string;
}

export type BlueprintCategory =
  | "basics"
  | "intermediate"
  | "advanced"
  | "defi"
  | "tokens"
  | "governance"
  | "nfts";

export interface DiffEntry {
  id: string;
  title: string;
  description: string;
  solidity: string;
  soroban: string;
  notes?: string;
}

export interface GasBreakdownItem {
  operation: string;
  cost: string;
  impact: "low" | "medium" | "high";
}

export interface GasExample {
  id: string;
  title: string;
  description: string;
  category: string;
  computeUnits: number;
  ledgerReads: number;
  ledgerWrites: number;
  bytesWritten: number;
  breakdown: GasBreakdownItem[];
  tips?: string[];
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
}
