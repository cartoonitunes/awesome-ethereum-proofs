# AdminCheckV2 -- Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x592621b7737425ed3aee2212cebf0a4504f26259` |
| Deployed | Dec 30, 2015 (block 732,635) |
| Compiler | soljson v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 211 bytes |
| Creation | 245 bytes (34 bytes init, no constructor args) |
| Runtime SHA-256 | `897ca73bdf2227a5fd9e783a9fe5a465b3310c21919a2eeb4b05cad9e377700a` |
| Creation SHA-256 | `59a1c50c449e3c5653fb9ba1df4c715004b8f28760e6232994e46b49ac3232f2` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Contract

An evolution of AdminCheck (test-v1). Adds a constructor (owner = msg.sender), a bool state variable (flag), and getBool() to read it. The test() function writes the result of comparing msg.sender against a hardcoded admin address (0x8b9346aa...) to storage as a bool, rather than just returning it.

Part of a series of iterative prototypes by deployer 0x8b9346aa..., who deployed over 400 contracts between December 2015 and May 2016. This contract was selfdestructed shortly after deployment, 63 blocks after its predecessor test-v1.

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.6, compiles `AdminCheckV2.sol` with optimizer ON, and compares the output byte-for-byte against the on-chain runtime and creation bytecode.
