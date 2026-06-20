import type { DiffEntry } from "@/types";

export type { DiffEntry };

export const DIFFS: DiffEntry[] = [
  {
    id: "mapping-vs-storage",
    title: "Mapping vs Storage",
    description: "How Solidity mappings translate to Soroban persistent storage.",
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Balances {
    // Implicit mapping: address => balance
    mapping(address => uint256) public balances;

    function setBalance(
        address account,
        uint256 amount
    ) external {
        balances[account] = amount;
    }

    function getBalance(
        address account
    ) external view returns (uint256) {
        return balances[account]; // 0 if unset
    }
}`,
    soroban: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env};

#[contract]
pub struct Balances;

#[contractimpl]
impl Balances {
    // Explicit storage — you choose the key type
    pub fn set_balance(env: Env, account: Address, amount: i128) {
        env.storage()
            .persistent()
            .set(&(symbol_short!("BAL"), account), &amount);
    }

    pub fn get_balance(env: Env, account: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&(symbol_short!("BAL"), account))
            .unwrap_or(0) // 0 if unset — same default behavior
    }
}`,
    notes: "Soroban has no implicit mappings. You key storage explicitly with any serializable type. This means you pay only for what you store, and you control the TTL.",
  },
  {
    id: "modifier-vs-auth",
    title: "Modifiers vs require_auth",
    description: "Solidity access modifiers translate directly to Soroban's require_auth().",
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function transfer(address newOwner)
        external
        onlyOwner
    {
        owner = newOwner;
    }

    function privileged()
        external
        onlyOwner
        returns (bool)
    {
        return true;
    }
}`,
    soroban: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env};

#[contract]
pub struct Ownable;

#[contractimpl]
impl Ownable {
    pub fn initialize(env: Env, owner: Address) {
        env.storage().instance().set(&symbol_short!("OWN"), &owner);
    }

    // No modifier syntax — call require_auth() directly
    pub fn transfer(env: Env, new_owner: Address) {
        Self::only_owner(&env);
        env.storage().instance().set(&symbol_short!("OWN"), &new_owner);
    }

    pub fn privileged(env: Env) -> bool {
        Self::only_owner(&env);
        true
    }

    // Helper replaces the "modifier" pattern
    fn only_owner(env: &Env) {
        let owner: Address = env.storage()
            .instance()
            .get(&symbol_short!("OWN"))
            .expect("not initialized");
        owner.require_auth(); // panics if caller is not owner
    }
}`,
    notes: "require_auth() is cryptographic — it verifies the caller signed the transaction. There's no msg.sender; the address proves itself.",
  },
  {
    id: "events",
    title: "Events / Logs",
    description: "Solidity events map closely to Soroban's env.events().publish().",
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventExample {
    // Declare events at contract level
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 amount
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function transfer(
        address from,
        address to,
        uint256 amount
    ) external {
        // ... logic ...
        emit Transfer(from, to, amount);
    }
}`,
    soroban: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env};

#[contract]
pub struct EventExample;

#[contractimpl]
impl EventExample {
    // No declaration needed — publish inline
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        // Topics: tuple — first element is the event name
        // Topics are indexed (more expensive)
        // Data: anything serializable
        env.events().publish(
            (symbol_short!("transfer"), from.clone()),
            (to.clone(), amount),
        );
    }

    pub fn approve(env: Env, owner: Address, spender: Address, value: i128) {
        owner.require_auth();
        env.events().publish(
            (symbol_short!("approval"), owner),
            (spender, value),
        );
    }
}`,
    notes: "Soroban events have topics (indexed, costly) and data (unindexed, cheap). Keep topics to 1–2 elements. The first topic is conventionally the event name as a Symbol.",
  },
  {
    id: "error-handling",
    title: "Errors / Reverts",
    description: "Solidity require/revert maps to Soroban's typed error enums.",
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Custom error types (gas-efficient)
error InsufficientBalance(uint256 have, uint256 need);
error Unauthorized();

contract ErrorExample {
    mapping(address => uint256) balances;

    function withdraw(uint256 amount) external {
        if (balances[msg.sender] < amount) {
            revert InsufficientBalance(
                balances[msg.sender],
                amount
            );
        }
        balances[msg.sender] -= amount;
    }

    function onlyCheck(address expected) external {
        if (msg.sender != expected) {
            revert Unauthorized();
        }
    }
}`,
    soroban: `#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracterror, symbol_short, Address, Env,
};

// Typed errors — each maps to a u32 code on-chain
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    InsufficientBalance = 1,
    Unauthorized        = 2,
}

#[contract]
pub struct ErrorExample;

#[contractimpl]
impl ErrorExample {
    pub fn withdraw(env: Env, caller: Address, amount: i128)
        -> Result<(), Error>
    {
        caller.require_auth();
        let balance: i128 = env.storage()
            .persistent()
            .get(&(symbol_short!("BAL"), caller.clone()))
            .unwrap_or(0);

        if balance < amount {
            return Err(Error::InsufficientBalance);
        }

        env.storage().persistent().set(
            &(symbol_short!("BAL"), caller),
            &(balance - amount),
        );
        Ok(())
    }
}`,
    notes: "Soroban errors are typed enums with numeric codes — no string messages on-chain. Use Result<T, E> for recoverable errors. Panics (unreachable!/assert!) are hard failures.",
  },
  {
    id: "constructor",
    title: "Constructor vs initialize()",
    description: "Solidity constructors become a one-time initialize() function in Soroban.",
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Token {
    string public name;
    string public symbol;
    address public owner;
    uint256 public totalSupply;

    // Runs exactly once at deployment
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        totalSupply = _initialSupply;
    }
}`,
    soroban: `#![no_std]
use soroban_sdk::{
    contract, contractimpl, symbol_short, Address, Env, String,
};

#[contract]
pub struct Token;

#[contractimpl]
impl Token {
    // Soroban has no constructor — use initialize() pattern
    // Guard against double-initialization with a flag
    pub fn initialize(
        env: Env,
        admin: Address,
        name: String,
        symbol: String,
        initial_supply: i128,
    ) {
        if env.storage().instance().has(&symbol_short!("INIT")) {
            panic!("already initialized");
        }
        env.storage().instance().set(&symbol_short!("INIT"),   &true);
        env.storage().instance().set(&symbol_short!("ADMIN"),  &admin);
        env.storage().instance().set(&symbol_short!("NAME"),   &name);
        env.storage().instance().set(&symbol_short!("SYM"),    &symbol);
        env.storage().instance().set(&symbol_short!("SUPPLY"), &initial_supply);
    }
}`,
    notes: "Soroban contracts are deployed then initialized in a separate transaction. Always guard initialize() to prevent double-calls. The admin pattern is the standard replacement for msg.sender in the constructor.",
  },
  {
    id: "struct-storage",
    title: "Structs in Storage",
    description: "Storing complex structs on-chain in Solidity vs Soroban.",
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vault {
    struct Position {
        uint256 amount;
        uint256 entryPrice;
        uint256 timestamp;
    }

    mapping(address => Position) public positions;

    function open(uint256 amount, uint256 price) external {
        positions[msg.sender] = Position({
            amount: amount,
            entryPrice: price,
            timestamp: block.timestamp
        });
    }
}`,
    soroban: `#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env,
};

// Mark with #[contracttype] for serialization
#[contracttype]
#[derive(Clone, Debug)]
pub struct Position {
    pub amount:      i128,
    pub entry_price: i128,
    pub timestamp:   u64,
}

#[contract]
pub struct Vault;

#[contractimpl]
impl Vault {
    pub fn open(env: Env, caller: Address, amount: i128, price: i128) {
        caller.require_auth();

        let position = Position {
            amount,
            entry_price: price,
            timestamp:   env.ledger().timestamp(),
        };

        env.storage()
            .persistent()
            .set(&(symbol_short!("POS"), caller), &position);
    }

    pub fn get_position(env: Env, account: Address) -> Option<Position> {
        env.storage()
            .persistent()
            .get(&(symbol_short!("POS"), account))
    }
}`,
    notes: "#[contracttype] is required for any type stored on-chain or passed as a contract argument. It generates XDR serialization automatically. Soroban uses block ledger().timestamp() (Unix seconds) instead of block.timestamp.",
  },
];
