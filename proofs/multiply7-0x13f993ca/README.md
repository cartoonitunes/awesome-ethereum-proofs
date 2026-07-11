# Multiply7 (canonical Solidity example) — Bytecode Proof
Reconstructed source for a Frontier-era contract cluster, compiled byte-exact with an era-correct soljson build.

| Field | Value |
|-------|-------|
| Address | `0x13F993CA161862fE0B14586DEC2FD7e5f697BdED` |
| Deployed | Nov 15, 2015 (block 542,761) |
| Compiler | soljson-v0.1.5+commit.23865e39.js |
| Optimizer | OFF |
| Runtime | 114 bytes — **exact byte-for-byte match** |
| Creation | 130 bytes — **exact byte-for-byte match** |
| Runtime SHA-256 | `49768d7927a2b4c493eb9a0e07b55a5c9f4e0d826139a583ca5d5e36f3861281` |
| Cluster | 12 identical-runtime deployment(s) (see `addresses.json`); representative verified live via `eth_getCode` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Scope
Exact match of **both the on-chain runtime and creation bytecode**, reproduced by the stock
`soljson-v0.1.5+commit.23865e39.js` build (optimizer off). `target_creation.txt` is the on-chain deploy-transaction input
(cross-checked equal to the captured creation code) and `target_runtime.txt` is `eth_getCode` for the
representative; `verify.js` compiles the source and asserts both match byte-for-byte.

The canonical Solidity/Remix `multiply7` example: a single pure function `multiply(uint256 a) returns (uint256)` returning `a * 7`. Same source as the sibling cluster `multiply7-0x036c643c`, here compiled at soljson v0.1.5 with the optimizer OFF.

## Verify
```
node verify.js
```

## Files
- `multiply7.sol` — reconstructed source
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy tx input)
- `addresses.json` — byte-identical deployments in this cluster
- `verify.js` — reproducible verification script
