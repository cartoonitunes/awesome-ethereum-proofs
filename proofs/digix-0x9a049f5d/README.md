# Digix (0x9a049f5d…) — the earliest known smart-contract deployment on Ethereum mainnet

Deployed by **Anthony Eufemio** (`thanateros.eth`, `0xA1E4380A3B1f749673E270229993eE55F35663b4`)
on **2015-08-07 04:42:15 UTC** — block **46,402**, roughly 8 days into the Frontier network and
**~14 hours before the first widely-cited "executable" contract**. Eufemio announced it on Reddit
as *"First contract on Ethereum made by me."* He went on to co-found **Digix / DigixDAO**, one of
Ethereum's first token projects.

**The creation bytecode reproduces byte-for-byte exactly.**

| Field | Value |
|-------|-------|
| Address | `0x9a049f5d18c239efaa258af9f3e7002949a977a0` |
| Deployed | 2015-08-07 04:42:15 UTC |
| Block | 46,402 |
| Deployer | `0xA1E4380A3B1f749673E270229993eE55F35663b4` (thanateros.eth) |
| Creation tx | `0x6c929e1c3d860ee225d7f3a7addf9e3f740603d243260536dfa2f3cf02b51de4` |
| Creation | 41 bytes — **EXACT match** |
| Runtime | 0 bytes (deploy ran out of gas before code deposit) |
| Language | Solidity |
| Compiler | **soljson v0.1.1+commit.6ff4cd6**, optimizer **ON** |
| Creation SHA-256 | `cc5132f490c08038ccb4dd584ab9381fe5b6c8dd313d8af15db0ae6bce2fc1c9` |

## What happened

The transaction was sent with only **24,000 gas**. The init code runs the constructor
(`owner = msg.sender`, an `SSTORE` to slot 0) and then attempts to return the 6-byte runtime
`0x606060405200` (an empty contract body). The 24,000-gas budget is exhausted before the
code-deposit step, so **no runtime code was ever stored** — the address holds an account with
empty code. This is exactly the "genesis attempt" the Ethereum History archive documents: the
earliest known try at putting a contract on mainnet, unsuccessful only because gas was too low.

The full deployment-transaction input is reproduced here byte-for-byte by compiling the source
with the period-correct compiler.

## Source

```solidity
contract Digix {
    address owner;
    function Digix() {
        owner = msg.sender;
    }
}
```

The constructor's `owner = msg.sender` compiles to the unoptimized address-mask idiom
`PUSH1 1 PUSH1 0xa0 PUSH1 2 EXP SUB NOT AND` (computing `~(2¹⁶⁰−1)` at runtime), which pins the
codegen to the v0.1.1 era. The one-byte `STOP` padding after the constructor `RETURN` (offset
`0x22`) is specific to v0.1.1 — v0.1.2+ drops it, shifting the CODECOPY offset from `0x23` to
`0x22`.

## Verify

```bash
npm install solc@0.4.26
node verify.js   # → ✅ EXACT MATCH  (creation bytecode)
```

## Attribution

Reconstructed by [Ethereum History](https://ethereumhistory.com). Contract page:
https://ethereumhistory.com/contract/0x9a049f5d18c239efaa258af9f3e7002949a977a0
