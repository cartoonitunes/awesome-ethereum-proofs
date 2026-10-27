# RadioCoin (0xeebafcdc): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0xEebafCDc08cC06c0322eB01b811527fdFB08c5ba` |
| Deployed | Jan 15, 2016 (block 854,065) |
| Deployer | `0xa2a4710d4e0f76f500582eebee7ebfe0ea57a1e4` |
| Compiler | soljson-v0.1.7+commit.b4e666cc |
| Optimizer | ON |
| Runtime | 1213 bytes, exact byte-for-byte match |
| Creation | exact match (no constructor arguments) |
| Runtime SHA-256 | `0bfe5d7774e3f192f166b370aab46d8dcd026e0355bc7af0348d1e3622548b57` |
| Identical deployments | 1 (see `addresses.json`) |

## Source

Reconstructed from bytecode; no original source was published. It is the ethereum.org
`MyToken` tutorial token with the contract renamed to `RadioCoin` while the initializer
kept the name `MyToken`. In Solidity of that era a constructor had to share the contract's
name, so `MyToken(uint256,string,string,uint8)` (selector `0xb50a89f3`) compiled into an
ordinary public function and no constructor ran at deployment. The function ignores its
name/symbol/decimals arguments and hard-codes `"RadioCoin"`, the symbol `📡` (U+1F4E1,
satellite antenna) and 0 decimals; it defaults the supply to 1,000,000. Because it is public
and unguarded, anyone can call it at any time to overwrite their own balance.

Code layout pins the declaration order: `transfer` is declared before the state variables.
The string-return helper's `PUSH1 03 MUL PUSH1 0f ADD` operand order narrows the compiler to
v0.1.4-nightly.2015.10.2 through v0.1.7; v0.2.0 swaps it.

Compiler sweep: all 0.1.x/0.2.x soljson builds at both optimizer settings, one process per
compile. Exact runtime + creation: every build from v0.1.4-nightly.2015.10.2 to
v0.1.7+commit.b4e666cc with the optimizer on (19 builds). v0.1.7 was the latest release
before the deploy.

## Verify

```
node verify.js
```
