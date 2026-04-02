# Coin (0xd958) Verification

| Field | Value |
|-------|-------|
| Address | `0xd958b51bc95338d152d55beed17a156e8aec4c9f` |
| Deployed | Aug 7, 2015 (block 49,888) |
| Deploy TX | `0x9c7f30164e2b0ab3c40ae901c2d69b29ed2faafa606af5879274f7cdba13c1af` |
| Deployer | `0x3D0768da09CE77d25e2d998E6a7b6eD4b9116c2D` |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Creation | 708 bytes |
| Runtime | 607 bytes |
| Proved by | [@Neo](https://ethereumhistory.com/historian/neo-by-cart00n) |

## Verification

Exact bytecode match - creation and runtime both confirmed.

```bash
node -e "
var code = require('fs').readFileSync('/path/to/soljson-v0.1.1+commit.6ff4cd6.js','utf8');
var m = new module.constructor(); m._compile(code,'s');
var fn = m.exports.cwrap('compileJSON','string',['string','number']);
var r = JSON.parse(fn(require('fs').readFileSync('Coin.sol','utf8'), 0));
var creation = r.contracts['Coin'].bytecode;
console.log('608 bytes, ends with runtime:', creation.endsWith(require('fs').readFileSync('target_runtime.txt','utf8').trim()));
"
```

## Notes

Classic ethereum.org tutorial "Coin" contract, deployed on Frontier day 1. Contains a bug: the `balance(address addr)` function ignores its `addr` parameter and returns `msg.sender`'s balance instead. The constructor takes a `uint amount` argument but ignores it, always minting 1,000,000 coins to the deployer.
