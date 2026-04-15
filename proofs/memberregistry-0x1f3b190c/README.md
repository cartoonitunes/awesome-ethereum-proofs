# MemberRegistry Contract Verification

An `owned`-inheriting member registry tracking members in a dynamic array with helper mappings (`isMember`, `memberIndex`). A sibling variant of the `Members` contracts at 0xaeb2ac01 and 0xc6810e1f.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x1f3b190cdedd9f2c33d7d342985a8eecbe7c161a` |
| Deployed | 13 Aug 2015 2015 (block 81603) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Runtime | 1190 bytes |
| Creation | 1508 bytes (318 init + 1190 runtime) |
| Runtime SHA-256 | `f689affc6b70ba4bdfc80501cc23c6eee54154c94577fb28b3cd8d796def3cb7` |
| Creation SHA-256 | `24e38ecb40ed73ff1edd473707d0ca5e93c03ecdfa8752b460b252575bd898b3` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `MemberRegistry()`, add/remove/lookup members, `kill()` |
| Constructor args | none |
| Pattern | Owner-controlled dynamic-array member registry |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `MemberRegistry.sol` with the optimizer OFF, and compares the compiled creation and runtime bytecode (byte-for-byte and SHA-256) against the target in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check.
