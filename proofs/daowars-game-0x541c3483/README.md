# DAO Wars Game (0x541c3483, 0x05c5f931): Bytecode Proof

| Field | Value |
|-------|-------|
| Addresses | `0x541C348304b9fB7bAf64f528a2A0d2c897d1D6d9`, `0x05c5f9312251A9015e5733B327A25A2e8c2F5195` (identical runtime) |
| Deployed | Nov 9, 2015 |
| Deployer | `0xCB01E47C5954fD3018bf2d4d154c7254a4c37fb0` |
| Compiler | soljson v0.1.6+commit.d41f8b7c |
| Optimizer | ON (runs 200) |
| Runtime | 8850 bytes, exact byte-for-byte match |
| Creation | exact match for both deployments |
| Runtime SHA-256 | `41cee35d95415921e797200a33929ba2f1bcbd71abebcc39fe4b8d9001bfc195` |

## Source

github.com/ConsenSysMesh/dao-wars at commit 71bf845 ("Create basic map for devcon alpha", Nov 9 2015): `Board.sol`, `Creature.sol`, `CreatureBuilder.sol` and `Game.sol` concatenated with their `import` lines removed, the same layout as the earlier Game crack (proofs/game-0x143c31b0). Game deploys its own Board with `new Board()`, so Board's code is embedded in Game's runtime.

The only change is that `Board.neighbor()` is declared first in `Board`. In solc 0.1.x the order of function bodies follows declaration order, and the deployed bytecode has `neighbor` first. No code inside any function was changed.

## Verify

```
node one.js soljson-v0.1.6+commit.d41f8b7c.js Game.sol 1 Game   # == runtime.hex
```
