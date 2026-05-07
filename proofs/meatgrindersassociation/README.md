# MeatGrindersAssociation Contract Verification

Bytecode verification proof for the **Meat Grinders Association**, the first
self-identified quadratic-voting DAO on Ethereum, deployed by Alex Van de Sande
(avsa) of the Ethereum Foundation. Vote weight scales with `balance ×
sqrt(value + gas * gasprice)` — a quadratic-bribe mechanism — and the contract
exposes a `grindUnicorns()` flow that pulls Unicorn tokens from the caller and
mints Unicorn Meat tokens via an external `MeatCalculator`.

## Contract

| Field | Value |
|-------|-------|
| Address | `0xc7e9dDd5358e08417b1C88ed6f1a73149BEeaa32` |
| Deployer | `0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb` (alex.vandesande.eth) |
| Deployed | Mar 24, 2016 (block 1,211,176) |
| Deploy tx | `0xe9653360212cb38996a13def35272cb05b3e06f4344c1673514973c92367f054` |
| Compiler | soljson-v0.2.1+commit.91a6b35f |
| Optimizer | ON |
| Runtime | 4,640 bytes |
| Creation | 5,232 bytes (5,040 bytes init/deploy + 192 bytes constructor args) |
| Verification repo | [cartoonitunes/meatgrindersassociation-verification](https://github.com/cartoonitunes/meatgrindersassociation-verification) |

## Constructor arguments

| # | Name | Value |
|---|------|-------|
| 0 | `unicornAddress` | `0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7` (Unicorn token) |
| 1 | `meatAddress` | `0xed6ac8de7c7ca7e3a22952e09c2a2a1232ddef9a` (Unicorn Meat token) |
| 2 | `minimumUnicornsToPassAVote` | `1` |
| 3 | `minutesForDebate` | `0` |
| 4 | `multiplierForVotesAgainst` | `4` |
| 5 | `meatCalculator` | `0x4ab274fc3a81b300a0016b3805d9b94c81fa54d2` (MeatConversionCalculator) |

## Verification

```bash
node verify.js
```

The script downloads `soljson-v0.2.1+commit.91a6b35f.js`, compiles
`MeatGrindersAssociation.sol` with the optimizer ON, and compares the output
byte-for-byte against the on-chain runtime (`target_runtime.txt`) and the
creation bytecode prefix of `target_creation.txt` (the trailing 192 bytes are
the ABI-encoded constructor arguments).

## Demo set

The Meat Grinders Association is part of a four-contract demo Alex Van de
Sande used to introduce the "Democracy" and quadratic-voting concepts to the
Ethereum community in early 2016:

- `0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7` — Unicorn token (🦄)
- `0xED6aC8de7c7CA7e3A22952e09C2a2A1232DDef9A` — Unicorn Meat token (🍖)
- `0x4AB274FC3A81B300A0016b3805d9b94C81FA54d2` — MeatConversionCalculator
- `0xc7e9dDd5358e08417b1C88ed6f1a73149BEeaa32` — **MeatGrindersAssociation**
