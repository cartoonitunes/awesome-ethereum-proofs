# WeiFaucet Contract Verification

A simple Wei faucet: `getWei()` returns 0.01 ETH to the caller, subject to a 5760-block (~24h) per-address cooldown and the contract having sufficient balance.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x793ae8c1b1a160bfc07bfb0d04f85eab1a71f4f2` |
| Deployed | 10 Aug 2015 2015 (block 63809) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Runtime | 327 bytes |
| Creation | 377 bytes (50 bytes init + 327 bytes runtime) |
| Runtime SHA-256 | `b815945eb2f85edecabdf520c5fd6bf4ffe3e6ce395e9fdf0b719e7a1c00e480` |
| Creation SHA-256 | `1794480a3164c3f85297857cb6c1e1d5f264d9d3e5fa2d36e46188196dd1e87d` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `getWei()` |
| Constructor args | none |
| Pattern | Faucet with per-address block-number cooldown |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `WeiFaucet.sol` with the optimizer OFF, and compares the resulting creation and runtime bytecode (byte-for-byte and SHA-256) against the on-chain bytecode in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check.
