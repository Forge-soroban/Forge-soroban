<div align="center">

<img src="https://raw.githubusercontent.com/stellar/stellar-design-system/main/packages/stellar-design-system/src/assets/icons/brand/logo-stellar.svg" alt="Stellar Logo" width="60" />

# ⚡ Forge — Soroban Smart Contract Lab

**The interactive lab for building production-grade smart contracts on Stellar.**

[![CI](https://github.com/Forge-soroban/Forge-soroban/actions/workflows/ci.yml/badge.svg)](https://github.com/Forge-soroban/Forge-soroban/actions/workflows/ci.yml)
[![Test and Lint](https://github.com/Forge-soroban/Forge-soroban/actions/workflows/test.yml/badge.svg)](https://github.com/Forge-soroban/Forge-soroban/actions/workflows/test.yml)
[![Security Audit](https://github.com/Forge-soroban/Forge-soroban/actions/workflows/security-audit.yml/badge.svg)](https://github.com/Forge-soroban/Forge-soroban/actions/workflows/security-audit.yml)
[![codecov](https://codecov.io/gh/Forge-soroban/Forge-soroban/branch/main/graph/badge.svg)](https://codecov.io/gh/Forge-soroban/Forge-soroban)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Rust](https://img.shields.io/badge/Rust-1.74%2B-orange?logo=rust)](https://www.rust-lang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Stellar](https://img.shields.io/badge/Stellar-Soroban-7C3AED?logo=stellar)](https://developers.stellar.org/docs/smart-contracts)

[Live App](#web-app) · [Blueprints](#blueprints) · [Diff Viewer](#diff-viewer) · [Gas Meter](#gas-meter) · [Contributing](#contributing)

</div>

---

## What is Forge?

Forge is a full-stack developer lab for [Soroban](https://developers.stellar.org/docs/smart-contracts) — Stellar's smart contract platform. It ships as two things at once:

1. **A Rust monorepo** — 40+ smart contract examples organized by difficulty and use case, all compiled and tested against the latest Soroban SDK.
2. **A Next.js web app** — an interactive frontend with a blueprint browser, a Solidity↔Soroban diff viewer, and a live gas cost estimator.

> Forge is built for Ethereum developers migrating to Stellar, Soroban beginners who want guided onboarding, and experienced builders who need battle-tested reference patterns.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
  - [Rust Contracts](#rust-contracts)
  - [Web App](#web-app)
- [Blueprints](#blueprints)
- [Diff Viewer](#diff-viewer)
- [Gas Meter](#gas-meter)
- [Scripts](#scripts)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## Features

| Feature | Description |
|---|---|
| ⚡ **Blueprint Browser** | 40+ Soroban contract examples, searchable and filterable by category |
| ↔ **Diff Viewer** | Side-by-side Solidity vs Soroban for 6 core patterns |
| ⛽ **Gas Meter** | Live resource cost estimates — compute units, ledger reads/writes, bytes |
| 🔑 **Command Palette** | `Ctrl+K` / `⌘K` global search across all blueprints and tools |
| 🧪 **All examples tested** | Every contract compiles and ships with unit + integration tests |
| 🔒 **Security audited** | Automated `cargo audit` on every push |
| 🌐 **Full-stack** | Rust contracts + Next.js 14 App Router frontend in one repo |

---

## Tech Stack

### Smart Contracts (Rust)
| Layer | Technology |
|---|---|
| Language | Rust 1.74+ |
| Contract SDK | [soroban-sdk](https://github.com/stellar/rs-soroban-sdk) |
| Runtime target | `wasm32-unknown-unknown` |
| CLI | [stellar-cli](https://github.com/stellar/stellar-cli) 22.1.0 |
| Testing | `soroban_sdk::testutils`, Rust unit tests |
| Linting | `clippy` with `-D warnings` |
| Formatting | `rustfmt` |
| Security | `cargo audit` |
| Coverage | `cargo-tarpaulin` |

### Web App (Frontend)
| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | TypeScript 5 (strict mode) |
| UI | React 18 |
| Icons | [lucide-react](https://lucide.dev) |
| Styling | CSS variables + inline styles (no CSS-in-JS dependency) |
| Component library | Custom (`src/components/ui/`) |
| State | React `useState` / `useMemo` |
| Routing | Next.js file-based routing |
| Type sharing | `src/types/index.ts` |
| Utilities | `src/lib/utils.ts` |

### Infrastructure
| Layer | Technology |
|---|---|
| CI/CD | GitHub Actions |
| Coverage | Codecov |
| Package manager | npm (webapp), Cargo (contracts) |
| Monorepo | Cargo workspace |

---

## Project Structure

```
forge/
├── .github/
│   ├── workflows/          # CI: build, test, lint, security audit
│   └── ISSUE_TEMPLATE/     # Bug report, feature request templates
│
├── examples/               # Rust smart contract examples
│   ├── basics/             # Hello world → custom structs (14 examples)
│   ├── intermediate/       # Cross-contract, RBAC, queues, pagination
│   ├── advanced/           # Multisig, timelock, proxy, oracle
│   ├── defi/               # AMM, lending, flash loans, staking (8 examples)
│   ├── tokens/             # SEP-41, vesting, wrappers, allowances
│   ├── nfts/               # Minting, marketplace, metadata
│   ├── governance/         # DAO, voting, proposals
│   └── storage/            # Storage patterns deep-dive
│
├── webapp/                 # Next.js 14 web application
│   └── src/
│       ├── app/            # App Router pages
│       │   ├── page.tsx              # Homepage
│       │   ├── blueprints/           # Pattern browser
│       │   ├── diff/                 # Solidity ↔ Soroban diff viewer
│       │   ├── gas/                  # Gas meter
│       │   ├── settings/             # Workspace settings
│       │   └── not-found.tsx         # Custom 404
│       ├── components/
│       │   ├── Navbar.tsx            # Sticky nav with ⌘K trigger
│       │   ├── CommandPalette.tsx    # Global search overlay
│       │   └── ui/                   # Button, Card, Input, Label, Select, Toggle
│       ├── data/
│       │   ├── blueprints.ts         # Blueprint content
│       │   ├── diffs.ts              # Diff examples
│       │   └── gas.ts                # Gas cost data
│       ├── lib/
│       │   └── utils.ts              # Shared helpers
│       └── types/
│           └── index.ts              # Shared TypeScript interfaces
│
├── shared/                 # Shared Rust utilities and types
├── tests/
│   ├── integration/        # Cross-contract integration tests
│   └── security/           # Security-focused test suites
├── scripts/                # build.sh, test.sh, deploy.sh, lint.sh
├── docs/                   # Reference documentation
├── book/                   # mdBook source (guides, examples, API reference)
├── Cargo.toml              # Workspace manifest
├── rust-toolchain.toml     # Pinned Rust toolchain
└── README.md
```

---

## Quick Start

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Rust | 1.74+ | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| WASM target | — | `rustup target add wasm32-unknown-unknown` |
| Stellar CLI | 22.1.0 | `cargo install --locked stellar-cli --version 22.1.0` |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Included with Node.js |

---

### Rust Contracts

```bash
# 1. Clone
git clone https://github.com/Forge-soroban/Forge-soroban.git
cd Soroban-Cookbook-

# 2. Run all tests across the workspace
cargo test --workspace

# 3. Run a specific example
cd examples/basics/01-hello-world
cargo test

# 4. Build a contract to WASM
cargo build --target wasm32-unknown-unknown --release

# 5. Deploy to Stellar testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/hello_world.wasm \
  --network testnet \
  --source YOUR_ACCOUNT
```

---

### Web App

```bash
# From the repo root
cd webapp
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

| Route | Description |
|---|---|
| `/` | Homepage — 3-path onboarding |
| `/blueprints` | Interactive blueprint browser |
| `/diff` | Solidity ↔ Soroban side-by-side |
| `/gas` | Gas cost estimator |
| `/settings` | Workspace configuration |

> Press `Ctrl+K` (or `⌘K` on Mac) anywhere in the app to open the command palette.

```bash
# Build for production
npm run build

# Run production server
npm start

# Lint
npm run lint
```

---

## Blueprints

40+ production-ready Soroban contract examples, organized by category:

| Category | Examples | Key Concepts |
|---|---|---|
| **Basics** | Hello World, Storage, Auth, Events, Errors, Types | `#[contract]`, `env.storage()`, `require_auth()` |
| **Intermediate** | RBAC, Priority Queue, Pause/Unpause, Iterable Maps | Cross-contract calls, admin patterns |
| **Advanced** | Multisig, Timelock, Proxy, Oracle, Registry | M-of-N auth, delayed execution, upgrades |
| **DeFi** | AMM, Lending Pool, Flash Loans, Staking, Farming | x\*y=k, collateral, reentrancy guards |
| **Tokens** | SEP-41, Vesting, Wrapper, Allowance, Multi-token | Stellar token standard |
| **NFTs** | Basic NFT, Marketplace, Metadata | Minting, ownership, royalties |
| **Governance** | DAO, Voting, Proposals | On-chain governance patterns |

Every blueprint:
- ✅ Compiles against the latest Soroban SDK
- ✅ Ships with unit and integration tests
- ✅ Includes inline documentation
- ✅ Passes `clippy` with `-D warnings`

---

## Diff Viewer

The diff viewer shows Solidity and Soroban side-by-side for 6 core patterns:

| Pattern | What you learn |
|---|---|
| Mapping vs Storage | How `mapping(address => uint)` maps to `env.storage().persistent()` |
| Modifiers vs `require_auth` | How `onlyOwner` maps to `address.require_auth()` |
| Events / Logs | `emit Transfer(...)` → `env.events().publish(...)` |
| Errors / Reverts | `revert` → `#[contracterror]` typed enums |
| Constructor vs `initialize()` | One-time setup patterns |
| Structs in Storage | `#[contracttype]` serialization |

---

## Gas Meter

Soroban uses a resource model — not gas. The gas meter visualizes:

| Resource | What it measures |
|---|---|
| **Compute Units** | CPU cycles consumed by the contract |
| **Ledger Reads** | Number of storage keys read |
| **Ledger Writes** | Number of storage keys written |
| **Bytes Written** | Total bytes persisted to ledger |

Six pre-analyzed operations: Hello World, Single Storage Write, Token Transfer, AMM Swap, Governance Vote, Multisig Execute — each with a breakdown table and optimization tips.

---

## Scripts

```bash
# Build all contracts
./scripts/build.sh

# Run all tests
./scripts/test.sh

# Run linter
./scripts/lint.sh

# Run benchmarks
./scripts/benchmark.sh

# Deploy to testnet
./scripts/deploy.sh
```

---

## CI/CD

Every push and pull request runs the following GitHub Actions workflows:

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | push / PR | Build all contracts, run workspace tests |
| `test.yml` | push / PR | Full test suite + lint (`clippy`, `rustfmt`) |
| `security-audit.yml` | push / PR | `cargo audit` for known CVEs |

Branch protection requires all checks to pass before merging to `main`.

---

## Contributing

Contributions are welcome — bug fixes, new blueprints, documentation improvements, or new diff patterns.

**Setup:**
```bash
git clone https://github.com/Forge-soroban/Forge-soroban.git
cd Soroban-Cookbook-
cargo test --workspace           # verify everything passes
```

**Before submitting a PR:**
```bash
cargo fmt --all --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --workspace --all-features
cargo build --workspace --target wasm32-unknown-unknown --release
```

**Guidelines:**
- New contract examples must include tests and inline doc comments
- Follow the existing naming conventions (`snake_case` for files, `PascalCase` for contract structs)
- Keep each example focused on one concept — no kitchen-sink contracts
- Add an entry to the relevant category table in this README

---

## Security

Security issues should be reported privately. Do not open a public GitHub issue for vulnerabilities.

- Automated: `cargo audit` runs on every push
- Manual: see `docs/security-audit/` for the audit checklist and known issues log
- Dependency updates: managed via `dependabot` (see `.github/dependabot.yml`)

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

<div align="center">

Built with ❤️ by the community · Powered by [Stellar](https://stellar.org) · Written in Rust

**[⚡ Open Forge](http://localhost:3000)** · [Soroban Docs](https://developers.stellar.org/docs/smart-contracts) · [Stellar Discord](https://discord.gg/stellardev)

</div>
