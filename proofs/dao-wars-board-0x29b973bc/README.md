# DAO Wars Board (0x29b973bc): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0x29b973bc5ed4457ddfe2d0e929183ab46ab44ba3` |
| Created | Nov 8, 2015 (block 508,210), internally by the DAO Wars Game contract [`0x143c31b0`](../game-0x143c31b0/) |
| Triggering tx | `0x9dfe5d1c03d3564438d415eab3370fcad9dc95f3129141f26115479d6ae8a549` from `0xcb01e47c5954fd3018bf2d4d154c7254a4c37fb0` |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Contract | `Board` in `Game.sol` |
| Runtime | 3219 bytes, exact byte-for-byte match |
| Runtime SHA-256 | `db35bd259f54f7722522ced782c92416001d9d5ef750fc3dd0121e04423c2765` |
| Creation | not applicable (created by `new Board(...)` inside Game, no standalone creation transaction) |

## Source

`Game.sol` is the same file as the [Game (0x143c31b0) proof](../game-0x143c31b0/): github.com/ConsenSysMesh/dao-wars
contracts/Game.sol with its imports inlined. The Game contract deploys a `Board` when a game starts; compiling
that file and selecting the `Board` contract reproduces this runtime exactly. Found by compiling the
deployer's already-cracked sources against its uncracked contracts.

## Verify

```
node verify.js
```
