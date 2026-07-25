# EsseChain (ESSECHAIN / ESSE)

**Verified by EthereumHistory (ethereumhistory.com)** — near-exact bytecode match.

An ERC-20 "free distribution" airdrop token deployed **Oct 22, 2018** (block 6,559,850)
at [`0x4c65f9d41d367cb8f6d4810588d50fb397f6f6f4`](https://ethereumhistory.com/contract/0x4c65f9d41d367cb8f6d4810588d50fb397f6f6f4).

## What it is

EsseChain is a **renamed copy of the verified [SiaCashCoin](https://etherscan.io/address/0x74fd51a98a4a1ecbef8cc43be801cce630e260bd) airdrop template**.
Callers claim free tokens via `getTokens()` (they receive `value` tokens and are then
blacklisted from claiming again); the owner runs `finishDistribution()`, `burn()`,
`withdraw()`, and `withdrawForeignTokens()`.

Relative to SiaCashCoin, EsseChain changes only:
- `name = "ESSECHAIN"`, `symbol = "ESSE"`, `decimals = 8` (SiaCashCoin: 18)
- the post-claim blacklist guard `if (toGive > 0)` → `if (toGive > 1)`
- the per-claim decay `value.div(100000).mul(99999)` → `value.div(3333333).mul(3333333)`

### The public `SiaCashCoin()` function

The contract was renamed to `ESSECHAIN` but its **old-style constructor was left named
`function SiaCashCoin()`**. Because the function name no longer matches the contract
name, Solidity ≤0.4.21 treats it as an ordinary **public** function rather than a
constructor — so `SiaCashCoin()` is callable by anyone and appears in the deployed
runtime (selector `0x9a4b19e4`). This is the classic "unrenamed constructor" copy-paste
artifact, and it's how the template lineage was identified.

## Match status — near-exact

| | |
|---|---|
| **Compiler** | soljson **v0.4.25**, optimizer **ON**, 200 runs |
| **Runtime** | 3781 bytes |
| **Executable code** | **byte-for-byte identical** to on-chain |
| **Difference** | only the trailing bzzr0 metadata/swarm hash |

The swarm hash fingerprints the exact original source *file* (comments/whitespace),
which wasn't recovered, so this is classified `near_exact_match`. The reconstructed
source is derived from SiaCashCoin's verified Etherscan source with the changes above.

## Reproduce

```sh
node verify.js
```

Requires Node (uses the bundled `soljson-v0.4.25.js`; no npm install).
