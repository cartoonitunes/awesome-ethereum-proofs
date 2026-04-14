# KillMul Contract Verification

A tiny Frontier-era utility with two functions: `kill(address)` which self-destructs to the supplied address, and `multiply2(uint256)` which returns the argument times two.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x3e5e1fe257a6a28dd2001ba84561bfbf9c7c78cd` |
| Deployed | 14 Aug 2015 2015 (block 85787) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Runtime | 164 bytes |
| Creation | 181 bytes (17 bytes init + 164 bytes runtime) |
| Runtime SHA-256 | `d0884130c714f909448b8823c918486d4a42a7e013a7e8c9785d81e5e7be29dd` |
| Creation SHA-256 | `b24209386d7a940830ff39834f447751f9e1b13f5ea2a3630841df78d70b1de4` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `kill(address)`, `multiply2(uint256)` |
| Constructor args | none |
| Pattern | Test/utility contract with `suicide(address)` kill switch and a `multiply2` helper |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `KillMul.sol` with the optimizer OFF, and compares the resulting creation and runtime bytecode (byte-for-byte and SHA-256) against the on-chain bytecode in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check.
