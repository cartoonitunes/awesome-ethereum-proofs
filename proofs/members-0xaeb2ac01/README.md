# Members Contract Verification

A simple member registry with owner-controlled kill switch. Tracks members in a dynamic array with helper mappings, and allows the owner to suicide the contract.

## Contract

| Field | Value |
|-------|-------|
| Address | `0xaeb2ac01f4812144ff1b42607b812b5cdfa5fd37` |
| Deployed | 14 Aug 2015 2015 (block 85691) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Runtime | 1190 bytes |
| Creation | 1508 bytes (318 bytes init + 1190 bytes runtime) |
| Runtime SHA-256 | `f689affc6b70ba4bdfc80501cc23c6eee54154c94577fb28b3cd8d796def3cb7` |
| Creation SHA-256 | `24e38ecb40ed73ff1edd473707d0ca5e93c03ecdfa8752b460b252575bd898b3` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `Members()`, `addMember(address)`, `removeMember(address)`, `isMember(address)`, `kill()` |
| Constructor args | none |
| Pattern | Owner-controlled member registry with array + mapping tracking |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `Members.sol` with the optimizer OFF, and compares the resulting creation and runtime bytecode (byte-for-byte and SHA-256) against the on-chain bytecode in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check.
