# EtherDice (0x2faa316f): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0x2FaA316Fc4624EC39adc2Ef7B5301124cfB68777` |
| Deployed | Dec 7, 2015 |
| Deployer | `0xc3e44527b935d02D805D8d21DD07eA9d2cD5FC22` |
| Compiler | soljson v0.1.6+commit.d41f8b7c (also exact with v0.1.4-nightly.2015.10.2 through v0.1.7) |
| Optimizer | ON (runs 200) |
| Runtime | 9138 bytes, exact byte-for-byte match |
| Creation | exact match (deployment input = compiled bytecode, no constructor args) |
| Runtime SHA-256 | `26fb831cb0387003b77961d5c419fad156732a67b80ab66e539be36c71e704ad` |

## Source

`etherDice.sol` from github.com/orbro/eth-enablers (commit 3bce3003), unchanged except:

1. the EthereumHistory attribution as line 1;
2. `needsBirth()` declared above `numberOfHealthyGenerations()` (the GitHub copy has them the other way round). In solc 0.1.x the order of function bodies in the bytecode follows declaration order, and the deployed contract has `needsBirth` first. No code inside any function was changed.

## Verify

```
node one.js soljson-v0.1.6+commit.d41f8b7c.js EtherDice.sol 1 EtherDice   # == runtime.hex
```
