# Members Contract Verification

A member registry variant using `mapping(uint => address)` with sequential IDs instead of a dynamic array. Functionally similar to the sibling Members contract at 0xaeb2ac01 but with a different storage layout.

## Contract

| Field | Value |
|-------|-------|
| Address | `0xc6810e1f97ba430d2c8605b30c09393ab6db4e6f` |
| Deployed | 14 Aug 2015 2015 (block 85942) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Runtime | 1182 bytes |
| Creation | 1496 bytes (314 bytes init + 1182 bytes runtime) |
| Runtime SHA-256 | `a4720b449a7d539c48afbe4124e0ecb3376d411decf2fb0d07e6e696fd51fcaa` |
| Creation SHA-256 | `f5e5e930fd0f7b9279cc74247949ff9dccdf2ef62b51e9eb7409ad1e5400b0d6` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `Members()`, `addMember(address)`, `removeMember(address)`, `isMember(address)`, `kill()` |
| Constructor args | none |
| Pattern | Owner-controlled member registry using sequential id + mapping storage |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `Members.sol` with the optimizer OFF, and compares the resulting creation and runtime bytecode (byte-for-byte and SHA-256) against the on-chain bytecode in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check.
