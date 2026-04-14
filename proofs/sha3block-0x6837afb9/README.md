# Sha3Block Contract Verification

A one-function contract that returns `sha3(block.blockhash(n))` for an input block number. A minimal helper for hashing historical block hashes.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x6837afb9e9fc1a908f9ce54756d3dba55a87ea27` |
| Deployed | 12 Aug 2015 2015 (block 76425) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Runtime | 127 bytes |
| Creation | 144 bytes (17 bytes init + 127 bytes runtime) |
| Runtime SHA-256 | `3515e376d93fdfe1b27f0a72682b290bb7cc58a376f85d22f8e1b68b370724d6` |
| Creation SHA-256 | `379e843176c8c6cc88bec3ac4f2c1115dc158b74fcbea67597b999c43d318e9d` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `sha(uint256)` |
| Constructor args | none |
| Pattern | Single view function returning `sha3(blockhash(n))` |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `Sha3Block.sol` with the optimizer OFF, and compares the resulting creation and runtime bytecode (byte-for-byte and SHA-256) against the on-chain bytecode in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check.
