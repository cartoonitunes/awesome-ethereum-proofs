# Greeter Contract Verification

The canonical "greeter" tutorial contract (`mortal` + `greeter` inheriting pair) with a string greeting set at construction. The on-chain creation bytecode includes 96 bytes of ABI-encoded constructor args (the greeting string).

## Contract

| Field | Value |
|-------|-------|
| Address | `0x506f4b138e30f4ed0b9511d4d676eaaeca466983` |
| Deployed | 08 Aug 2015 2015 (block 54300) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Runtime | 476 bytes |
| Creation | 788 bytes (216 init + 476 runtime + 96 constructor args) |
| Runtime SHA-256 | `113938d41731eff036c9170f267ecbfde386cbee9465abe1e42192806a9a7e82` |
| Creation SHA-256 | `1e650951c824a00e5c5ddb75751cdf2b3bb590cfb47bc402bbae9d6010f68e8f` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `greeter(string)`, `greet()`, `kill()` |
| Constructor args | 96 bytes (ABI-encoded) |
| Pattern | Ethereum "greeter" tutorial with ABI-encoded string constructor arg |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `Greeter.sol` with the optimizer OFF, and compares the compiled creation and runtime bytecode (byte-for-byte and SHA-256) against the target in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check (including the constructor args appended to the compiled creation).
