# greeter -- Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0xa5adce8696627763ec6d9fa7064e706060de8709` |
| Deployed | Oct 6, 2015 (block 343,228) |
| Compiler | soljson v0.1.5+commit.23865e39 |
| Optimizer | ON |
| Runtime | 366 bytes |
| Creation | 670 bytes |
| Runtime SHA-256 | `405323340e37a215b653b4048feae02c41756a4e065f6efc24d6bb27803af477` |
| Creation SHA-256 | `cd554be98e1e524e8f13bef24770d08baad372836db4429b8a1b67fb28d5cf38` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Contract

One of **69 byte-for-byte identical deployments** in the 0--1M block range
(see `addresses.json`); this single source verifies all of them.

## Verification

```bash
node verify.js
```

Downloads soljson-v0.1.5, compiles `greeter.sol` (optimizer ON), and confirms the
compiled runtime is a byte-for-byte match against `target_runtime.txt`.
