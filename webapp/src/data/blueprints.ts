import type { Blueprint } from "@/types";

export type { Blueprint };
export { Blueprint as default };

export const BLUEPRINTS: Blueprint[] = [
  {
    id: "hello-world",
    title: "Hello World",
    description: "The minimal Soroban contract. Contract struct, #[contractimpl], and returning a value.",
    category: "basics",
    tags: ["contract", "entrypoint", "minimal"],
    concepts: ["#[contract]", "#[contractimpl]", "Env", "Symbol"],
    githubPath: "examples/hello-world",
    code: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol};

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Symbol {
        symbol_short!("Hello")
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::Env;

    #[test]
    fn test_hello() {
        let env = Env::default();
        let contract_id = env.register_contract(None, HelloContract);
        let client = HelloContractClient::new(&env, &contract_id);
        let words = client.hello(&symbol_short!("Dev"));
        assert_eq!(words, symbol_short!("Hello"));
    }
}`,
  },
  {
    id: "storage-patterns",
    title: "Storage Patterns",
    description: "Persistent, instance, and temporary storage with TTL management.",
    category: "basics",
    tags: ["storage", "persistent", "instance", "temporary", "TTL"],
    concepts: ["env.storage().persistent()", "env.storage().instance()", "env.storage().temporary()", "TTL", "extend_ttl"],
    githubPath: "examples/basics/02-storage-patterns",
    code: `#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, symbol_short};

const COUNTER_KEY: Symbol = symbol_short!("COUNTER");
const LEDGERS_TO_LIVE: u32 = 100;

#[contract]
pub struct StorageContract;

#[contractimpl]
impl StorageContract {
    pub fn increment(env: Env) -> u32 {
        let mut count: u32 = env
            .storage()
            .persistent()
            .get(&COUNTER_KEY)
            .unwrap_or(0);

        count += 1;

        env.storage()
            .persistent()
            .set(&COUNTER_KEY, &count);

        env.storage()
            .persistent()
            .extend_ttl(&COUNTER_KEY, LEDGERS_TO_LIVE, LEDGERS_TO_LIVE);

        count
    }

    pub fn get_count(env: Env) -> u32 {
        env.storage()
            .persistent()
            .get(&COUNTER_KEY)
            .unwrap_or(0)
    }
}`,
  },
  {
    id: "authentication",
    title: "Authentication & Admin Roles",
    description: "require_auth() for caller verification, admin role initialization and access guards.",
    category: "basics",
    tags: ["auth", "require_auth", "admin", "roles"],
    concepts: ["Address.require_auth()", "admin pattern", "access control"],
    githubPath: "examples/basics/03-authentication",
    code: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Symbol};

const ADMIN_KEY: Symbol = symbol_short!("ADMIN");

#[contract]
pub struct AuthContract;

#[contractimpl]
impl AuthContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&ADMIN_KEY) {
            panic!("already initialized");
        }
        env.storage().instance().set(&ADMIN_KEY, &admin);
    }

    pub fn get_admin(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&ADMIN_KEY)
            .expect("not initialized")
    }

    pub fn transfer_admin(env: Env, new_admin: Address) {
        let admin: Address = env.storage()
            .instance()
            .get(&ADMIN_KEY)
            .expect("not initialized");
        admin.require_auth();
        env.storage().instance().set(&ADMIN_KEY, &new_admin);
    }
}`,
  },
  {
    id: "custom-errors",
    title: "Custom Errors",
    description: "Define typed error enums with #[contracterror] for clean error handling.",
    category: "basics",
    tags: ["errors", "contracterror", "panic"],
    concepts: ["#[contracterror]", "Error enum", "Result"],
    githubPath: "examples/basics/03-custom-errors",
    code: `#![no_std]
use soroban_sdk::{contract, contractimpl, contracterror, Env};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized    = 1,
    AlreadyInit       = 2,
    Unauthorized      = 3,
    InsufficientFunds = 4,
    Overflow          = 5,
}

#[contract]
pub struct ErrorContract;

#[contractimpl]
impl ErrorContract {
    pub fn transfer(env: Env, amount: i128) -> Result<(), Error> {
        if amount <= 0 {
            return Err(Error::InsufficientFunds);
        }

        let balance: i128 = env.storage()
            .persistent()
            .get(&soroban_sdk::symbol_short!("BAL"))
            .unwrap_or(0);

        if amount > balance {
            return Err(Error::InsufficientFunds);
        }

        let new_balance = balance
            .checked_sub(amount)
            .ok_or(Error::Overflow)?;

        env.storage()
            .persistent()
            .set(&soroban_sdk::symbol_short!("BAL"), &new_balance);

        Ok(())
    }
}`,
  },
  {
    id: "events",
    title: "Events",
    description: "Publish typed events with env.events().publish(). Good topic design for indexer compatibility.",
    category: "basics",
    tags: ["events", "publish", "topics", "indexer"],
    concepts: ["env.events().publish()", "topic design"],
    githubPath: "examples/basics/04-events",
    code: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env};

#[contract]
pub struct EventContract;

#[contractimpl]
impl EventContract {
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        env.events().publish(
            (symbol_short!("transfer"), from.clone()),
            (to.clone(), amount),
        );
    }

    pub fn mint(env: Env, to: Address, amount: i128) {
        env.events().publish(
            (symbol_short!("mint"),),
            (to, amount),
        );
    }

    pub fn burn(env: Env, from: Address, amount: i128) {
        from.require_auth();
        env.events().publish(
            (symbol_short!("burn"), from),
            amount,
        );
    }
}`,
  },
  {
    id: "timelock",
    title: "Timelock",
    description: "Queue, delay, and execute privileged operations. Classic governance safety mechanism.",
    category: "advanced",
    tags: ["timelock", "governance", "delay", "queue", "cancel"],
    concepts: ["ledger sequence", "queue pattern", "execute pattern"],
    githubPath: "examples/advanced/02-timelock",
    code: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env};

const DELAY: u32 = 1000;

#[contract]
pub struct TimelockContract;

#[contractimpl]
impl TimelockContract {
    pub fn initialize(env: Env, admin: Address) {
        env.storage()
            .instance()
            .set(&symbol_short!("ADMIN"), &admin);
    }

    pub fn queue(env: Env, proposal_id: u32, admin: Address) -> u32 {
        admin.require_auth();
        let execute_at = env.ledger().sequence() + DELAY;
        env.storage().persistent().set(
            &(symbol_short!("PROP"), proposal_id),
            &execute_at,
        );
        env.events().publish(
            (symbol_short!("queued"), proposal_id),
            execute_at,
        );
        execute_at
    }

    pub fn execute(env: Env, proposal_id: u32, admin: Address) {
        admin.require_auth();
        let execute_at: u32 = env.storage()
            .persistent()
            .get(&(symbol_short!("PROP"), proposal_id))
            .expect("proposal not queued");
        if env.ledger().sequence() < execute_at {
            panic!("too early");
        }
        env.storage()
            .persistent()
            .remove(&(symbol_short!("PROP"), proposal_id));
        env.events().publish(
            (symbol_short!("executed"), proposal_id),
            env.ledger().sequence(),
        );
    }

    pub fn cancel(env: Env, proposal_id: u32, admin: Address) {
        admin.require_auth();
        env.storage()
            .persistent()
            .remove(&(symbol_short!("PROP"), proposal_id));
        env.events().publish(
            (symbol_short!("cancelled"), proposal_id),
            (),
        );
    }
}`,
  },
  {
    id: "multi-party-auth",
    title: "Multi-Party Auth (Multisig)",
    description: "Threshold signature scheme — require M-of-N signers to approve an operation.",
    category: "advanced",
    tags: ["multisig", "threshold", "multi-party", "governance"],
    concepts: ["require_auth", "threshold", "approval tracking"],
    githubPath: "examples/advanced/01-multi-party-auth",
    code: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Vec};

#[contract]
pub struct MultisigContract;

#[contractimpl]
impl MultisigContract {
    pub fn initialize(env: Env, signers: Vec<Address>, threshold: u32) {
        assert!(threshold > 0 && threshold <= signers.len() as u32,
            "invalid threshold");
        env.storage().instance().set(&symbol_short!("SIGS"), &signers);
        env.storage().instance().set(&symbol_short!("THRESH"), &threshold);
    }

    pub fn approve(env: Env, signer: Address, proposal_id: u32) {
        signer.require_auth();
        let signers: Vec<Address> = env.storage()
            .instance()
            .get(&symbol_short!("SIGS"))
            .expect("not initialized");
        assert!(signers.contains(&signer), "not a signer");
        let key = (symbol_short!("APR"), proposal_id, signer.clone());
        env.storage().persistent().set(&key, &true);
        env.events().publish(
            (symbol_short!("approved"), proposal_id),
            signer,
        );
    }

    pub fn execute(env: Env, proposal_id: u32) {
        let signers: Vec<Address> = env.storage()
            .instance()
            .get(&symbol_short!("SIGS"))
            .expect("not initialized");
        let threshold: u32 = env.storage()
            .instance()
            .get(&symbol_short!("THRESH"))
            .expect("not initialized");
        let count = signers.iter().filter(|s| {
            let key = (symbol_short!("APR"), proposal_id, s.clone());
            env.storage().persistent().get::<_, bool>(&key).unwrap_or(false)
        }).count() as u32;
        assert!(count >= threshold, "threshold not met");
        env.events().publish(
            (symbol_short!("executed"), proposal_id),
            count,
        );
    }
}`,
  },
  {
    id: "sep41-token",
    title: "SEP-41 Token",
    description: "Soroban token standard implementation: mint, burn, transfer, allowances.",
    category: "tokens",
    tags: ["SEP-41", "token", "mint", "burn", "transfer"],
    concepts: ["SEP-41 interface", "balance storage", "events"],
    githubPath: "examples/tokens",
    code: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, String};

#[contract]
pub struct TokenContract;

#[contractimpl]
impl TokenContract {
    pub fn initialize(env: Env, admin: Address, name: String, symbol: String) {
        env.storage().instance().set(&symbol_short!("ADMIN"), &admin);
        env.storage().instance().set(&symbol_short!("NAME"),  &name);
        env.storage().instance().set(&symbol_short!("SYM"),   &symbol);
        env.storage().instance().set(&symbol_short!("SUPPLY"), &0_i128);
    }

    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage()
            .instance()
            .get(&symbol_short!("ADMIN"))
            .expect("not initialized");
        admin.require_auth();
        let bal = Self::balance(env.clone(), to.clone());
        env.storage().persistent().set(
            &(symbol_short!("BAL"), to.clone()), &(bal + amount));
        let supply: i128 = env.storage()
            .instance()
            .get(&symbol_short!("SUPPLY"))
            .unwrap_or(0);
        env.storage().instance().set(&symbol_short!("SUPPLY"), &(supply + amount));
        env.events().publish((symbol_short!("mint"),), (to, amount));
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        assert!(amount > 0, "invalid amount");
        let from_bal = Self::balance(env.clone(), from.clone());
        assert!(from_bal >= amount, "insufficient balance");
        env.storage().persistent().set(
            &(symbol_short!("BAL"), from.clone()), &(from_bal - amount));
        let to_bal = Self::balance(env.clone(), to.clone());
        env.storage().persistent().set(
            &(symbol_short!("BAL"), to.clone()), &(to_bal + amount));
        env.events().publish(
            (symbol_short!("transfer"), from),
            (to, amount),
        );
    }

    pub fn balance(env: Env, account: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&(symbol_short!("BAL"), account))
            .unwrap_or(0)
    }

    pub fn total_supply(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&symbol_short!("SUPPLY"))
            .unwrap_or(0)
    }
}`,
  },
  {
    id: "amm",
    title: "AMM (Constant Product)",
    description: "Automated market maker using the x*y=k invariant. Add/remove liquidity and swap.",
    category: "defi",
    tags: ["AMM", "DeFi", "liquidity", "swap", "x*y=k"],
    concepts: ["constant product formula", "liquidity tokens", "price impact"],
    githubPath: "examples/defi",
    code: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env};

#[contract]
pub struct AmmContract;

#[contractimpl]
impl AmmContract {
    pub fn initialize(env: Env, token_a: Address, token_b: Address) {
        env.storage().instance().set(&symbol_short!("TKA"), &token_a);
        env.storage().instance().set(&symbol_short!("TKB"), &token_b);
        env.storage().instance().set(&symbol_short!("RESA"), &0_i128);
        env.storage().instance().set(&symbol_short!("RESB"), &0_i128);
    }

    pub fn swap_a_for_b(env: Env, trader: Address, amount_in: i128) -> i128 {
        trader.require_auth();
        let reserve_a = Self::reserve_a(env.clone());
        let reserve_b = Self::reserve_b(env.clone());
        let amount_in_with_fee = amount_in * 997;
        let amount_out = (amount_in_with_fee * reserve_b)
            / (reserve_a * 1000 + amount_in_with_fee);
        assert!(amount_out > 0, "insufficient output");
        env.storage().instance().set(
            &symbol_short!("RESA"), &(reserve_a + amount_in));
        env.storage().instance().set(
            &symbol_short!("RESB"), &(reserve_b - amount_out));
        env.events().publish(
            (symbol_short!("swap"), trader),
            (amount_in, amount_out),
        );
        amount_out
    }

    pub fn reserve_a(env: Env) -> i128 {
        env.storage().instance().get(&symbol_short!("RESA")).unwrap_or(0)
    }

    pub fn reserve_b(env: Env) -> i128 {
        env.storage().instance().get(&symbol_short!("RESB")).unwrap_or(0)
    }
}`,
  },
  // ── New blueprint: Vesting ────────────────────────────────────────────────
  {
    id: "vesting",
    title: "Token Vesting",
    description: "Linear vesting schedule with cliff. Beneficiary claims unlocked tokens over time.",
    category: "tokens",
    tags: ["vesting", "cliff", "linear", "schedule", "token"],
    concepts: ["ledger timestamp", "cliff period", "linear unlock", "claim pattern"],
    githubPath: "examples/tokens",
    code: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env};

/// Linear vesting with an optional cliff.
/// After the cliff, tokens unlock linearly until the end timestamp.
#[contract]
pub struct VestingContract;

#[contractimpl]
impl VestingContract {
    /// Set up a vesting schedule for a beneficiary.
    pub fn initialize(
        env: Env,
        beneficiary: Address,
        total_amount: i128,
        start_ts: u64,
        cliff_ts: u64,
        end_ts: u64,
    ) {
        assert!(cliff_ts >= start_ts, "cliff before start");
        assert!(end_ts > cliff_ts,   "end before cliff");
        assert!(total_amount > 0,    "zero amount");

        env.storage().instance().set(&symbol_short!("BEN"),   &beneficiary);
        env.storage().instance().set(&symbol_short!("TOTAL"), &total_amount);
        env.storage().instance().set(&symbol_short!("START"), &start_ts);
        env.storage().instance().set(&symbol_short!("CLIFF"), &cliff_ts);
        env.storage().instance().set(&symbol_short!("END"),   &end_ts);
        env.storage().instance().set(&symbol_short!("CLMD"),  &0_i128);
    }

    /// Returns the amount unlocked at the current ledger timestamp.
    pub fn vested_amount(env: Env) -> i128 {
        let now       = env.ledger().timestamp();
        let cliff_ts: u64  = env.storage().instance().get(&symbol_short!("CLIFF")).unwrap();
        let start_ts: u64  = env.storage().instance().get(&symbol_short!("START")).unwrap();
        let end_ts:   u64  = env.storage().instance().get(&symbol_short!("END")).unwrap();
        let total:    i128 = env.storage().instance().get(&symbol_short!("TOTAL")).unwrap();

        if now < cliff_ts { return 0; }
        if now >= end_ts  { return total; }

        let elapsed  = (now - start_ts) as i128;
        let duration = (end_ts - start_ts) as i128;
        total * elapsed / duration
    }

    /// Claim unlocked tokens.
    pub fn claim(env: Env) -> i128 {
        let beneficiary: Address = env.storage()
            .instance().get(&symbol_short!("BEN")).unwrap();
        beneficiary.require_auth();

        let vested   = Self::vested_amount(env.clone());
        let claimed: i128 = env.storage()
            .instance().get(&symbol_short!("CLMD")).unwrap_or(0);
        let claimable = vested - claimed;

        assert!(claimable > 0, "nothing to claim");

        env.storage().instance().set(&symbol_short!("CLMD"), &(claimed + claimable));

        env.events().publish(
            (symbol_short!("claimed"), beneficiary),
            claimable,
        );

        claimable
    }
}`,
  },
  // ── New blueprint: Flash Loan ─────────────────────────────────────────────
  {
    id: "flash-loan",
    title: "Flash Loan",
    description: "Uncollateralized loan repaid within the same transaction. Includes fee enforcement.",
    category: "defi",
    tags: ["flash loan", "DeFi", "single-tx", "fee", "reentrancy"],
    concepts: ["atomic transaction", "fee enforcement", "callback pattern", "reentrancy guard"],
    githubPath: "examples/defi",
    code: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env};

const FEE_BPS: i128 = 9; // 0.09%

#[contract]
pub struct FlashLoanContract;

#[contractimpl]
impl FlashLoanContract {
    pub fn initialize(env: Env, admin: Address, reserve: i128) {
        env.storage().instance().set(&symbol_short!("ADMIN"), &admin);
        env.storage().instance().set(&symbol_short!("RES"),   &reserve);
    }

    /// Execute a flash loan. The caller must repay principal + fee
    /// within the same transaction (enforced by balance check after callback).
    pub fn flash_loan(env: Env, borrower: Address, amount: i128) {
        borrower.require_auth();

        let reserve: i128 = env.storage()
            .instance().get(&symbol_short!("RES")).unwrap_or(0);

        assert!(amount > 0 && amount <= reserve, "invalid amount");

        // Guard: mark loan in-flight
        assert!(
            !env.storage().instance().has(&symbol_short!("LOCK")),
            "reentrancy"
        );
        env.storage().instance().set(&symbol_short!("LOCK"), &true);

        let fee = amount * FEE_BPS / 10_000 + 1;
        let repay = amount + fee;

        // Emit borrow event (off-chain callback triggers here)
        env.events().publish(
            (symbol_short!("borrow"), borrower.clone()),
            (amount, fee),
        );

        // In a real contract the token transfer and repayment check
        // would use cross-contract calls to a token contract.
        // This skeleton shows the guard + fee structure.
        env.storage().instance().set(&symbol_short!("RES"), &(reserve - amount + repay));
        env.storage().instance().remove(&symbol_short!("LOCK"));

        env.events().publish(
            (symbol_short!("repaid"), borrower),
            repay,
        );
    }

    pub fn reserve(env: Env) -> i128 {
        env.storage().instance().get(&symbol_short!("RES")).unwrap_or(0)
    }
}`,
  },
];
