<!-- Verified by EthereumHistory (https://ethereumhistory.com) -->
# CatCoin 🐱 (Dec 2015) — Bytecode Proof

Exact bytecode match for **the first Ethereum token with an emoji ticker**.

| Field | Value |
|-------|-------|
| Address | [`0x8e72a6838fbeb72a5627a3597e73b6108feda705`](https://etherscan.io/address/0x8e72a6838fbeb72a5627a3597e73b6108feda705) |
| Deployed | Dec 15, 2015 (block 697,515) |
| Deployer | `0x3e00520925B0BbA1F5c84A4C1F4400b9bFD784a6` |
| Name / Symbol | `CatCoin` / `🐱` (U+1F431, UTF-8 `f0 9f 90 b1`) |
| Decimals | 2 |
| Compiler | Solidity 0.1.5 / 0.1.6 Emscripten (`solc-emscripten-asmjs-v0.1.6+commit.d41f8b7c.js`) |
| Optimizer | ON |
| Runtime | 1,093 bytes |
| Creation | 1,582 bytes + 288 bytes constructor args |
| Runtime SHA-256 | `5931865d4f457ecef3c91400aabc23f235cf005c1413968729fd6d520159c82e` |
| Creation TX SHA-256 | `24be386e4f4bc50b2b62a3a974e07ebad1940c4f0ebb1aff1667262f754979ac` |
| Proved by | [Neo by cart00n](https://ethereumhistory.com/historian/12) |

## Verify

```bash
node verify.js [path/to/solc-emscripten-asmjs-v0.1.6+commit.d41f8b7c.js]
```

Expected output:

```
runtime bytecode      : EXACT MATCH (1093 bytes)
creation is prefix    : true
creation + ctor args  : EXACT MATCH
constructor args      : 288 bytes
```

## Why the script warms the compiler

solc 0.1.x emits **two valid, semantically identical code layouts** for this
source. The shared string-copy block used by the `name()`/`symbol()` getters is
placed either before the function bodies or at the end of the contract. Which
one you get depends on emscripten heap state:

| Compiler state | Layout |
|---|---|
| First compile in a fresh module | A |
| After ≥1 prior compile in the same module | B ← **this is what is onchain** |

The deployed contract is layout B — what browser-solidity produces, since it
recompiles on every keystroke and its module is always warm. `verify.js`
reproduces that state, then compiles until it matches byte for byte.

Because single-shot verifiers always produce layout A, **neither Etherscan nor
Sourcify can verify this contract**. Sourcify does accept solc 0.1.x and
compiles the source successfully — it simply recompiles into layout A and
returns `no_match`. Etherscan returns "Compiled contract deployment bytecode
does NOT match".

## Constructor arguments

```
initialSupply : 100000000        (= 1,000,000.00 🐱 at 2 decimals)
tokenName     : "CatCoin"
decimalUnits  : 2
tokenSymbol   : "🐱"
centralMinter : 0x18EBd42Dc5E42EDaC84e8DEd1dc824Af20008564
```

`centralMinter` is not a wallet — it is an ethereum.org Association DAO deployed
the same afternoon, governed by the `catenaDAO` (`ß`) shares token. It moved the
supply for the first time ever on 2026-08-24 via `newProposal`/`vote`/`executeProposal`.
