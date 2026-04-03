# GetSet Contract Verification

Bytecode verification proof for an early getter/setter proxy contract deployed by the Oraclize team.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x77beac0aed3b9e75ee2aba60b3dec66ff47e96c2` |
| Deployed | Sep 17, 2015 (block 247,715) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | ON |
| Runtime | 147 bytes |
| Creation | 202 bytes (55 bytes init) |
| Runtime SHA-256 | `ad9ad3bf415fbc7c31620107194456e97384bd2cd0dfabd163629ca1c7c291e9` |
| Creation SHA-256 | `8528be103beafaddeea002cb567f6ca84e5dd2ede1ce08e6da39b6141d963797` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Notes

A minimal proxy contract from the Oraclize team (deployer `0x0047A8033CC6d6Ca2ED5044674Fd421F44884dE8`, Thomas Bertani). The `set(uint256)` function forwards calls to a hardcoded target contract (`0x9e0ae8ffd946d12d1d393c6f3bca0eecadc9428e`) using early Solidity's raw string-based `.call()` pattern. The `get()` function returns the constant 255 (0xFF).

Uses inline state variable initialization for the target address. A `uint reserved` at slot 0 suggests this was part of a larger contract hierarchy.

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.1, compiles `GetSet.sol` with optimizer ON, and compares the output byte-for-byte against the on-chain runtime and creation bytecode.
