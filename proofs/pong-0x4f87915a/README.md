# Pong (minimal) -- Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x4f87915ac802a86cd3a6ae5d8d6f8de242ef366f` |
| Deployed | Sep 4, 2015 (block 185,494) |
| Compiler | soljson v0.1.1 |
| Optimizer | OFF |
| Runtime | 388 bytes |
| Creation | 452 bytes (64 bytes init, no constructor args) |
| Runtime SHA-256 | `6b1e579bbf2443a849750f8e41255044ee577331caac825e5d1d5522cf8f1985` |
| Creation SHA-256 | `cc6ce1270d2ff005d296bd857354a1531520083e6aa53033a2ab203dae650339` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Contract

A minimal Pong contract by Cyrus Adkisson with three functions: setPongval(int8) to set a value, getPongval() to read it, and kill() for owner-only selfdestruct. This is a simpler predecessor to the full tutorial Pong contract at 0x3a0cc907 (46_pong_via_send.sol), which added constructor parameters, ETH handling, and cross-contract communication features.

The contract was selfdestructed after testing. Cyrus deployed 357 contracts between August and October 2015 as part of his solidity-baby-steps tutorial series.

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.1, compiles `Pong.sol` with optimizer OFF, and compares the output byte-for-byte against the on-chain creation bytecode.

The v0.1.1 init terminator `f3 00` (RETURN + STOP) confirms this compiler version. v0.1.2+ produces `f3` only, yielding a 1-byte init difference.
