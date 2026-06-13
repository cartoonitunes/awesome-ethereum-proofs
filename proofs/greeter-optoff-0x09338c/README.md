# greeter (greeter.sol, optimizer OFF) — Bytecode Proof
Reconstructed source for a Frontier/Homestead contract cluster, compiled byte-exact with an era-correct soljson build.
| Field | Value |
|-------|-------|
| Address | `0x09338CCdBB3c73520AFf411D9bf864d7c27e82D2` |
| Deployed | Nov 2, 2015 (block 477,409) |
| Deployer | `0x86c41eee402b5c9ab97f16f910b82f90ede91e37` |
| Deploy tx | `0x744f94cbaa34a08a31dc3c7f08e325bb01d0d1a1c106d180dd7c4972519ece96` |
| Compiler | soljson-v0.1.5+commit.23865e39 |
| Optimizer | OFF |
| Runtime | 542 bytes — **exact byte-for-byte match** |
| Creation | 908 bytes on-chain (runtime is the proven artifact) |
| Runtime SHA-256 | `37b3ecd059acc76c1d93d3d7ece572af77245c8b7e511afe616eb230147c2f1f` |
| Cluster | 18 identical-runtime deployment(s) (see `addresses.json`); representative verified live via `eth_getCode` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |
## Scope
Exact match of the **on-chain runtime bytecode**. The creation bytecode differs only by ABI-encoded constructor argument(s) appended to the deploy input; `target_creation.txt` is the on-chain creation for reference. `verify.js` asserts the runtime.
## Verify
```
node verify.js
```
## Files
- `greeter.sol` — reconstructed source
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy tx input)
- `addresses.json` — byte-identical deployments in this cluster
- `verify.js` — reproducible verification script
