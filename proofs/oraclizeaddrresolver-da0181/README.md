# OraclizeAddrResolver (Oraclize, v1)

Oraclize's second address resolver, deployed 47 seconds after the first one at `0xed51ae5e42bba55d8316b5c38a8f14c149a32adc` (which had a hardcoded owner and connector and the same bug). Client contracts were meant to call `getAddress()` to find the current Oraclize connector, but `getAddress()` returns its own named return variable `oaddr` without assigning it, so it always returns 0x0. The stored connector is only reachable through the public getter `addr()`. Onchain today `addr()` returns `0xbbbdca2d2973601d973bc0452252178fb992978f` and `getAddress()` returns zero. A corrected resolver was deployed 37 minutes later at [`0x3ae1631c`](../oraclizeaddrresolver-3ae163/).

| Field | Value |
|-------|-------|
| Address | `0xda0181a763b533e532248f6ff859e564a470d9aa` |
| Deployed | Oct 24, 2015 (block 433,056) |
| Deployer | `0x0047a8033cc6d6ca2ed5044674fd421f44884de8` (the Oraclize operator account) |
| Deploy tx | `0x8eb2a588fe6fc18052f4b5178e741e03478f23128796e344e05825e8b8f7e570` |
| Compiler | soljson v0.1.6+commit.d41f8b7c (2015-10-16) |
| Optimizer | OFF |
| Runtime | 407 bytes |
| Creation | 470 bytes (no constructor arguments) |
| Runtime SHA-256 | `bf352eee844b544a2d4caccaf220e8bb32d7434379c1e9b265930dd7ff4e4d54` |
| Creation SHA-256 | `303bb32b613c7c488dd768e12fc15c87e0f893b4756bbd5a499dc3549ef58cbc` |
| Status | live; verified on Etherscan and Sourcify |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/cartoonitunes) |

## Verification

```bash
node verify.js
```

The script downloads `soljson-v0.1.6+commit.d41f8b7c`, compiles `OraclizeAddrResolver.sol` with the optimizer OFF, and checks both the runtime and the full creation code against the onchain bytes. Output ends with `VERIFIED: exact bytecode match`.

## Reconstruction

The logic matches the `OraclizeAddrResolver` that Oraclize later published (Etherscan source for `0x1d11e5eae3112dbd44f99266872ff1d07c77dce8`), with `getAddress()` returning `oaddr` instead of `addr`. The compiler lays out function bodies in declaration order, which fixes where `addr` and `owner` are declared relative to the functions. Contract names do not reach the bytecode; the name is taken from the later source.

## Files

- `OraclizeAddrResolver.sol`: reconstructed source
- `target_runtime.txt`, `target_creation.txt`: onchain runtime and deploy-transaction creation code
- `verify.js`: Node verification script
