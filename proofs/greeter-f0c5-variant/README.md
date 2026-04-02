# Greeter v0.1.4 — 0xF0C5 Document Registry

Bytecode verification proof for the ethereum.org mortal+greeter contract compiled with soljson v0.1.4 (optimizer OFF).

This bytecode was deployed 1,346 times between October 2015 and February 2016 by a single deployer (`0xF0C5Cef39B17C213cFe090A46b8C7760FfB7928A`) to store commercial real estate loan term sheets as on-chain documents. Each deployment passed a JSON object as the `_greeting` constructor argument.

## Contract

| Field | Value |
|-------|-------|
| Canonical address | `0x91c696d14dcc933c38e486111a21ffbefc2d7168` |
| Deployer | `0xF0C5Cef39B17C213cFe090A46b8C7760FfB7928A` |
| First deployment | Oct 25, 2015 (block 450,706) |
| Last deployment | Feb 29, 2016 |
| Total copies | 1,346 (all share this runtime) |
| Compiler | soljson-v0.1.4+commit.5f6c3cdf |
| Optimizer | OFF |
| Runtime | 476 bytes |
| Runtime SHA-256 | `113938d41731eff036c9170f267ecbfde386cbee9465abe1e42192806a9a7e82` |
| Deploy TX (canonical) | `0xc60ebdb952c6833d2fd6f6034b7822028bea049744df56f6a0a61b928bdc9f15` |

## Key finding

soljson v0.1.4 is the last version to produce a 476-byte greeter runtime. Starting with v0.1.5 nightlies (around Oct 2–6, 2015), a change to the string utility bytecode caused the output to jump to 542 bytes. The deployer was using v0.1.4, the latest stable release at the time of first deployment.

v0.1.3 (`commit.028f561d`) also produces an identical 476-byte match.

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.4, compiles `Greeter.sol` with optimizer OFF, and compares the runtime output against `target_runtime.txt` byte-for-byte.

## Source

The contract is the standard ethereum.org mortal+greeter tutorial — unmodified. The deployer used it as a document registry, passing JSON-encoded loan commitment forms as the greeting string.

See `Greeter.sol` in this directory.
