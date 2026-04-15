# Greeter Contract Verification

An optimized variant of the canonical "greeter" tutorial contract, compiled with the optimizer ON. Like its sibling at 0x506f4b13, the on-chain creation bytecode has 96 bytes of ABI-encoded string constructor args appended.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x70791019dcb20f5507c64a94d21dd573105c5d32` |
| Deployed | 14 Aug 2015 2015 (block 85533) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | ON |
| Runtime | 316 bytes |
| Creation | 579 bytes (167 init + 316 runtime + 96 constructor args) |
| Runtime SHA-256 | `8631c58202a827f7fe93e2a48624fa2725eea806292fffb76aeb7f532359450c` |
| Creation SHA-256 | `90d418eedb880e3cf750bb24b75b8f39e9ecb12ace7a342bcbb4ad2c728ba540` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `greeter(string)`, `greet()`, `kill()` |
| Constructor args | 96 bytes (ABI-encoded) |
| Pattern | Optimized Ethereum "greeter" tutorial with ABI-encoded string constructor arg |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `Greeter.sol` with the optimizer ON, and compares the compiled creation and runtime bytecode (byte-for-byte and SHA-256) against the target in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check (including the constructor args appended to the compiled creation).
