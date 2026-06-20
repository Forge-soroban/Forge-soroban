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
    /// Persistent storage survives contract instance removal.
    /// Use for user balances, long-lived state.
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

        // Extend TTL to avoid expiry
        env.storage()
            .persistent()
            .extend_ttl(&COUNTER_KEY, LEDGERS_TO_LIVE, LEDGERS_TO_LIVE);

        count
    }

    /// Instance storage: tied to the contract instance lifetime.
    pub fn set_admin(env: Env, admin: soroban_sdk::Address) {
        env.storage()
            .instance()
            .set(&symbol_short!("ADMIN"), &admin);
        env.storage().instance().extend_ttl(100, 100);
    }

    /// Temporary storage: cheapest, expires after TTL.
    pub fn cache(env: Env, key: Symbol, val: u32) {
        env.storage().temporary().set(&key, &val);
        env.storage().temporary().extend_ttl(&key, 10, 10);
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
    /// Called once at deployment. Sets the admin.
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&ADMIN_KEY) {
            panic!("already initialized");
        }
        env.storage().instance().set(&ADMIN_KEY, &admin);
    }

    /// Any caller can read. No auth required.
    pub fn get_admin(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&ADMIN_KEY)
            .expect("not initialized")
    }

    /// Only the current admin can change the admin.
    pub fn transfer_admin(env: Env, new_admin: Address) {
        let admin: Address = env.storage()
            .instance()
            .get(&ADMIN_KEY)
            .expect("not initialized");

        // This panics if the caller is not admin
        admin.require_auth();

        env.storage().instance().set(&ADMIN_KEY, &new_admin);
    }

    /// Only admin can call privileged actions.
    pub fn privileged_action(env: Env, caller: Address) -> bool {
        let admin: Address = env.storage()
            .instance()
            .get(&ADMIN_KEY)
            .expect("not initialized");

        admin.require_auth();
        true
    }
}`,
  },
  {
    id: "custom-errors",
    title: "Custom Errors",
    description: "Define typed error enums with #[contracterror] for clean error handling and revert messages.",
    category: "basics",
    tags: ["errors", "contracterror", "panic"],
    concepts: ["#[contracterror]", "Error enum", "panic_with_error", "Result"],
    githubPath: "examples/basics/03-custom-errors",
    code: `#![no_std]
use soroban_sdk::{contract, contractimpl, contracterror, Env};

/// All contract errors in one place.
/// Each variant maps to a numeric code on-chain.
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized   = 1,
    AlreadyInit      = 2,
    Unauthorized     = 3,
    InsufficientFunds = 4,
    Overflow         = 5,
}

#[contract]
pub struct ErrorContract;

#[contractimpl]
impl ErrorContract {
    pub fn transfer(env: Env, amount: i128) -> Result<(), Error> {
        if amount <= 0 {
            return Err(Error::InsufficientFunds);
        }

        // Overflow-safe arithmetic
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
    concepts: ["env.events().publish()", "topic design", "Vec<Val>"],
    githubPath: "examples/basics/04-events",
    code: `#![no_std]
use soroban_sdk::{
    contract, contractimpl, symbol_short, vec,
    Address, Env, Symbol,
};

#[contract]
pub struct EventContract;

#[contractimpl]
impl EventContract {
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();

        // ... transfer logic ...

        // Topics: (event_name, from_address)
        // Data: (to_address, amount)
        // Keep topics minimal — they are indexed and cost more
        env.events().publish(
            (symbol_short!("transfer"), from.clone()),
            (to.clone(), amount),
        );
    }

    pub fn mint(env: Env, to: Address, amount: i128) {
        // Single-topic events are cheapest
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
    concepts: ["ledger sequence", "queue pattern", "execute pattern", "cancel pattern"],
    githubPath: "examples/advanced/02-timelock",
    code: `#![no_std]
use soroban_sdk::{
    contract, contractimpl, symbol_short, vec,
    Address, Bytes, Env, Map, Symbol,
};

const DELAY: u32 = 1000; // ~1000 ledgers ≈ 1.5 hours

#[contract]
pub struct TimelockContract;

#[contractimpl]
impl TimelockContract {
    pub fn initialize(env: Env, admin: Address) {
        env.storage()
            .instance()
            .set(&symbol_short!("ADMIN"), &admin);
    }

    /// Queue a proposal for future execution.
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

    /// Execute a proposal after the delay has passed.
    pub fn execute(env: Env, proposal_id: u32, admin: Address) {
        admin.require_auth();

        let execute_at: u32 = env.storage()
            .persistent()
            .get(&(symbol_short!("PROP"), proposal_id))
            .expect("proposal not queued");

        if env.ledger().sequence() < execute_at {
            panic!("too early");
        }

        // Remove from queue
        env.storage()
            .persistent()
            .remove(&(symbol_short!("PROP"), proposal_id));

        env.events().publish(
            (symbol_short!("executed"), proposal_id),
            env.ledger().sequence(),
        );
    }

    /// Cancel a pending proposal.
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
    concepts: ["require_auth", "threshold", "signers vec", "approval tracking"],
    githubPath: "examples/advanced/01-multi-party-auth",
    code: `#![no_std]
use soroban_sdk::{
    contract, contractimpl, symbol_short, vec,
    Address, Env, Vec,
};

#[contract]
pub struct MultisigContract;

#[contractimpl]
impl MultisigContract {
    /// Initialize with signers and required threshold.
    pub fn initialize(env: Env, signers: Vec<Address>, threshold: u32) {
        assert!(threshold > 0 && threshold <= signers.len() as u32,
            "invalid threshold");

        env.storage().instance().set(&symbol_short!("SIGS"), &signers);
        env.storage().instance().set(&symbol_short!("THRESH"), &threshold);
    }

    /// Each authorized signer calls this to approve a proposal.
    pub fn approve(env: Env, signer: Address, proposal_id: u32) {
        signer.require_auth();

        // Verify signer is in the set
        let signers: Vec<Address> = env.storage()
            .instance()
            .get(&symbol_short!("SIGS"))
            .expect("not initialized");

        assert!(signers.contains(&signer), "not a signer");

        // Record approval
        let key = (symbol_short!("APR"), proposal_id, signer.clone());
        env.storage().persistent().set(&key, &true);

        env.events().publish(
            (symbol_short!("approved"), proposal_id),
            signer,
        );
    }

    /// Execute once threshold is met.
    pub fn execute(env: Env, proposal_id: u32) {
        let signers: Vec<Address> = env.storage()
            .instance()
            .get(&symbol_short!("SIGS"))
            .expect("not initialized");

        let threshold: u32 = env.storage()
            .instance()
            .get(&symbol_short!("THRESH"))
            .expect("not initialized");

        // Count approvals
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
    tags: ["SEP-41", "token", "mint", "burn", "transfer", "allowance"],
    concepts: ["SEP-41 interface", "balance storage", "allowances", "events"],
    githubPath: "examples/tokens",
    code: `#![no_std]
use soroban_sdk::{
    contract, contractimpl, symbol_short,
    Address, Env, String,
};

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
        env.storage().persistent().set(&(symbol_short!("BAL"), to.clone()), &(bal + amount));

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
    concepts: ["constant product formula", "liquidity tokens", "price impact", "slippage"],
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

    /// Add liquidity proportionally.
    pub fn add_liquidity(
        env: Env,
        provider: Address,
        amount_a: i128,
        amount_b: i128,
    ) -> i128 {
        provider.require_auth();

        let reserve_a = Self::reserve_a(env.clone());
        let reserve_b = Self::reserve_b(env.clone());

        // Calculate LP tokens to mint
        let lp_tokens = if reserve_a == 0 && reserve_b == 0 {
            // First deposit: geometric mean
            i128_sqrt(amount_a * amount_b)
        } else {
            // Proportional to existing reserves
            let lp_a = amount_a * Self::total_lp(env.clone()) / reserve_a;
            let lp_b = amount_b * Self::total_lp(env.clone()) / reserve_b;
            lp_a.min(lp_b)
        };

        // Update reserves
        env.storage().instance().set(&symbol_short!("RESA"), &(reserve_a + amount_a));
        env.storage().instance().set(&symbol_short!("RESB"), &(reserve_b + amount_b));

        env.events().publish(
            (symbol_short!("addliq"), provider),
            (amount_a, amount_b, lp_tokens),
        );

        lp_tokens
    }

    /// Swap token A for token B using x*y=k.
    pub fn swap_a_for_b(env: Env, trader: Address, amount_in: i128) -> i128 {
        trader.require_auth();

        let reserve_a = Self::reserve_a(env.clone());
        let reserve_b = Self::reserve_b(env.clone());

        // 0.3% fee: amount_in_with_fee = amount_in * 997
        let amount_in_with_fee = amount_in * 997;
        let amount_out = (amount_in_with_fee * reserve_b)
            / (reserve_a * 1000 + amount_in_with_fee);

        assert!(amount_out > 0, "insufficient output");

        // Update reserves
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

    pub fn total_lp(env: Env) -> i128 {
        env.storage().instance().get(&symbol_short!("LP")).unwrap_or(0)
    }
}

fn i128_sqrt(n: i128) -> i128 {
    if n < 0 { return 0; }
    let mut x = n;
    let mut y = (x + 1) / 2;
    while y < x {
        x = y;
        y = (x + n / x) / 2;
    }
    x
}`,
  },
];
