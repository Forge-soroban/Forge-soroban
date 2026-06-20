import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CommandPalette from "@/components/CommandPalette";

export const metadata: Metadata = {
  title: "Forge — Soroban Smart Contract Lab",
  description:
    "Interactive lab for building Soroban smart contracts on Stellar. Blueprints, diff viewer, gas meter.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>"
        />
      </head>
      <body>
        <Navbar />
        <CommandPalette />
        <main>{children}</main>
        <footer
          style={{
            borderTop: "1px solid var(--border-subtle)",
            padding: "24px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            ⚡ Forge — Built on{" "}
            <a
              href="https://stellar.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stellar
            </a>
            , powered by Soroban
          </span>
          <span style={{ color: "var(--text-subtle)", fontSize: "13px" }}>
            MIT License · Open Source
          </span>
        </footer>
      </body>
    </html>
  );
}
