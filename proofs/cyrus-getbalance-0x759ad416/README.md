# GetBalance (Cyrus Adkisson) Verification

Byte-for-byte bytecode verification for `0x759ad41608dded2e704cc370ede5279d24239a87`.

| Field | Value |
|---|---|
| Contract | `0x759ad41608dded2e704cc370ede5279d24239a87` |
| Network | Ethereum Mainnet |
| Block | 146,970 |
| Deployed | Sep 4, 2015 |
| Deployer | `0xcf684dfbbbca4e93ee68e01a6e27f82b0ed15bac` (Cyrus Adkisson) |
| Compiler | soljson v0.1.1 (commit 6ff4cd6) |
| Optimizer | OFF |
| Creation match | ✅ EXACT (235 bytes) |
| Runtime match | ✅ EXACT (155 bytes, embedded in creation via CODECOPY) |

## Verification

```bash
npm install solc@0.4.26
node verify.js
```

## What this contract does

One of Cyrus Adkisson's earliest experimental contracts (Sept 2015). It stores a
single hardcoded address and exposes that address's ether balance through a
constant getter `getMyBalance()` (selector `0x4c738909`). No state changes, no
ether handling — a minimal read-only probe.
