# Subcurrency (subcurrency.sol, optimizer ON) — Bytecode Proof
Reconstructed source for a Frontier/Homestead contract cluster, compiled byte-exact with an era-correct soljson build.
| Field | Value |
|-------|-------|
| Address | `0x1C606eE0c43f60166AB497B33548f7E4E909d447` |
| Deployed | Jan 31, 2016 (block 930,142) |
| Deployer | `0x413d3612d8401055fb0f9beff89ddb95d350fd8c` |
| Deploy tx | `0x637b94244fa52c210e2d0147d5c473bd069e6055839c52a2180feb058f17138f` |
| Compiler | soljson-v0.1.3+commit.028f561d |
| Optimizer | ON |
| Runtime | 375 bytes — **exact byte-for-byte match** |
| Creation | 393 bytes — **exact byte-for-byte match** |
| Runtime SHA-256 | `864e25ff7643ca77737461cb22bd361c6646afb4f25c468ef072a81087127250` |
| Creation SHA-256 | `f1dfd42c8609b4ea4fca96e52307e5ad28a5d17b16279912b56a9cb3fe0f3e47` |
| Cluster | 1 identical-runtime deployment(s) (see `addresses.json`); representative verified live via `eth_getCode` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |
## Scope
Exact match of **both the on-chain runtime and creation bytecode**, reproduced by the stock `soljson-v0.1.3+commit.028f561d` build (optimizer ON).
## Verify
```
node verify.js
```
## Files
- `subcurrency.sol` — reconstructed source
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy tx input)
- `addresses.json` — byte-identical deployments in this cluster
- `verify.js` — reproducible verification script
