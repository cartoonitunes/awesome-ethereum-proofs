# Pyramid Contract Verification

A chain-letter style "pyramid": existing members can `add` new addresses, and `claim` splits the contract balance evenly between everyone who has joined.

## Contract

| Field | Value |
|-------|-------|
| Address | `0xdf4b519d56f879707b5139c9e7f8957114dc9b87` |
| Deployed | 10 Aug 2015 2015 (block 64112) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | ON |
| Runtime | 483 bytes |
| Creation | 665 bytes (182 bytes init + 483 bytes runtime) |
| Runtime SHA-256 | `a6c313b248bc63736f1ea0a8ab432155034719ed500d5444921601f7a10bcab8` |
| Creation SHA-256 | `f5425f78e6d6e647e3f75de00cfd6c06e511a601b1a5c7dcda81c5ed6f70774b` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `Pyramid()`, `add(address)`, `claim()`, `people(uint)` |
| Constructor args | none |
| Pattern | Member-added pyramid/chain list with equal-share claim distribution |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `Pyramid.sol` with the optimizer ON, and compares the resulting creation and runtime bytecode (byte-for-byte and SHA-256) against the on-chain bytecode in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check.
