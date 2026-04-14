# MovieVoting Contract Verification

Weighted voting for movies: users send ETH with a `vote(bytes32 key)` call and the bid is accumulated in `bids[key]`. First-time keys are appended to the `movies` array.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x58828dc80663a0f3d4ba2dcaff1c4fdffb88d96a` |
| Deployed | 08 Aug 2015 2015 (block 51112) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | ON |
| Runtime | 273 bytes |
| Creation | 292 bytes (19 bytes init + 273 bytes runtime) |
| Runtime SHA-256 | `db37b74b7e9533a00c19999866ed4a270a07d29353998155b79d3b91261f7919` |
| Creation SHA-256 | `727980e7b976e6d4140051d0390b270cbb05593d74dd968e0c641ee99b303bd0` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `vote(bytes32)`, `bids(bytes32)`, `movies(uint256)`, `movie_num()` |
| Constructor args | none |
| Pattern | Pay-to-vote bidding on bytes32 keys with append-only movie list |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `MovieVoting.sol` with the optimizer ON, and compares the resulting creation and runtime bytecode (byte-for-byte and SHA-256) against the on-chain bytecode in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check.
