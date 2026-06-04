# Token -- Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0xcc2ee7b5eee0d247afed2319202d51907be0bd4e` |
| Deployed | Jan 16, 2016 (block 857,773) |
| Compiler | soljson v0.2.0+commit.4dc2445e |
| Optimizer | OFF |
| Runtime | 1225 bytes |
| Creation | 1829 bytes |
| Runtime SHA-256 | `6b18601886692383352a50a03300ba27754da3b22a63d91e581585dbc8488dee` |
| Creation SHA-256 | `efcf1bf0e8d3e2ee3fea52c8987fbb9f92bc856ee216c2c403f049960cb32ed5` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Contract

One of **162 byte-for-byte identical deployments** in the 0--1M block range
(see `addresses.json`); this single source verifies all of them.

## Verification

```bash
node verify.js
```

Downloads soljson-v0.2.0, compiles `Token.sol` (optimizer OFF), and confirms the
compiled runtime is a byte-for-byte match against `target_runtime.txt`.
