# Random Contract Verification

Bytecode verification proof for a minimal random number generator contract that stores a blockhash at deployment time.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x77b7fa1bc7c2e626650393fe04ed3c93c119b6af` |
| Deployed | Feb 4, 2016 (block 951,171) |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | OFF |
| Runtime | 126 bytes |
| Creation | 162 bytes (36 bytes init) |
| Runtime SHA-256 | `050b4f0ad67a5cf70fac82cdb2c412b84e6a05f81e897410b001988c5cc98d04` |
| Creation SHA-256 | `0adbe6ed7639cc19577a51f1cede4b8b451a9f30160265bce9a2314bb5b12b3a` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Notes

The contract has a bug: `block.blockhash(block.number)` always returns 0 in the EVM because the current block's hash is not yet available. The developer likely meant `block.blockhash(block.number - 1)`. The `rand()` function also ignores its `min` and `max` parameters entirely.

Uses inline state variable initializers instead of a constructor function, producing unusually compact init code (36 bytes).

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.6, compiles `Random.sol` with optimizer OFF, and compares the output byte-for-byte against the on-chain runtime and creation bytecode.
