# Changelog

All notable changes to Forge are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- Flash loan blueprint with reentrancy guard
- Token vesting blueprint with cliff + linear unlock
- Gas meter breakdowns for vesting-claim and flash-loan operations
- Diff viewer patterns: inheritance vs composition, payable vs token transfers
- `Badge` and `Divider` UI components
- `formatBytes` and `debounce` utility helpers
- OpenGraph meta tags on root layout
- Focus-visible ring and text selection styles
- Responsive base CSS

### Changed
- Diff viewer struct-storage pattern note corrected (ledger().timestamp())
- README clone command updated to `Forge-soroban` org

---

## [0.1.0] — 2026-06-19

### Added
- Initial Forge release
- Blueprint browser with 9 Soroban contract examples
- Solidity ↔ Soroban diff viewer (6 patterns)
- Gas meter with 6 contract operation breakdowns
- Command palette (`Ctrl+K` / `⌘K`)
- Settings workspace (account, API keys, notifications, preferences, privacy)
- Custom 404 page
- Shared UI component library (Button, Card, Input, Label, Select, Toggle)
- Shared type definitions (`src/types/index.ts`)
- Utility library (`src/lib/utils.ts`)
- Full-stack README with tech stack tables and CI/CD docs
