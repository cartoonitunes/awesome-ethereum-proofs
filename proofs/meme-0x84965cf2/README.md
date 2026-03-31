# Meme Token Verification

Bytecode verification proof for the Meme token contract — one of the earliest meme coins, deployed by a 13-year-old who mined ETH on a GTX 970.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x84965cf265d75478abd7c6aa45e1b80b5d5e38cf` |
| Deployed | Apr 13, 2016 (block 1,330,011) |
| Compiler | soljson v0.3.1+commit.c492d9be |
| Optimizer | ON |
| Runtime | 901 bytes |
| Creation | 1256 bytes (+ 192 bytes constructor args) |
| Runtime SHA-256 | `336f381ae89a3b8f3b67f151eedf6548df71f8251c6703f15789fac63e85a2d8` |
| Creation SHA-256 | `5187ff721716e4caea4475d6041fad96c9cafa3d1f597cd23080c19bc7241472` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Notes

Based on the ethereum.org token tutorial (2016), combining the basic token, `owned` contract, `address centralMinter` constructor parameter, and `rewardMathGeniuses` puzzle function.

Multiple soljson versions (v0.2.2 through v0.3.2) produce identical output. v0.3.1 is listed as it was the latest stable release at deployment time.

## Verification

```bash
node verify.js
```

The script downloads soljson v0.3.1, compiles `MyToken.sol` with optimizer ON, and compares against `target_runtime.txt`.

## Source

See `MyToken.sol` in this directory.
