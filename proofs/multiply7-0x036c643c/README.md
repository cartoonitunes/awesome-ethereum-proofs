# Multiply7 (canonical Solidity example) — Bytecode Proof
Reconstructed source for a Frontier-era contract cluster, compiled byte-exact with an era-correct soljson build.

| Field | Value |
|-------|-------|
| Address | `0x036C643c9406bEEc42427174D7378b90638140e4` |
| Deployed | May 31, 2016 (block 1,616,133) |
| Compiler | soljson-v0.1.3+commit.028f561d.js |
| Optimizer | ON |
| Runtime | 42 bytes — **exact byte-for-byte match** |
| Creation | 58 bytes — **exact byte-for-byte match** |
| Runtime SHA-256 | `0a9c93fdfcae91b2a73a096d5029d6e9660adf0ace473b8b930115f315f943c8` |
| Cluster | 21 identical-runtime deployment(s) (see `addresses.json`); representative verified live via `eth_getCode` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Scope
Exact match of **both the on-chain runtime and creation bytecode**, reproduced by the stock
`soljson-v0.1.3+commit.028f561d.js` build (optimizer on). `target_creation.txt` is the on-chain deploy-transaction input
(cross-checked equal to the captured creation code) and `target_runtime.txt` is `eth_getCode` for the
representative; `verify.js` compiles the source and asserts both match byte-for-byte.

The canonical Solidity/Remix `multiply7` example: a single pure function `multiply(uint256 a) returns (uint256)` returning `a * 7`. Same source as the sibling cluster `multiply7-0x13f993ca`, here compiled at soljson v0.1.3 with the optimizer ON (a distinct runtime hash from the optimizer-OFF v0.1.5 build).

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
