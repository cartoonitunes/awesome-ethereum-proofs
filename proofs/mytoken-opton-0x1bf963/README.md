# MyToken (mytoken.sol, optimizer ON) — Bytecode Proof
Reconstructed source for a Frontier/Homestead contract cluster, compiled byte-exact with an era-correct soljson build.
| Field | Value |
|-------|-------|
| Address | `0x1BF963724A03dd8649950133eAE1f3F0e0c9CAAb` |
| Deployed | Mar 20, 2016 (block 1,187,001) |
| Deployer | `0x3e00520925b0bba1f5c84a4c1f4400b9bfd784a6` |
| Deploy tx | `0x10875d56553b4534285e1d580cd05c8d1eaf8491e2164c20197906004ae5c019` |
| Compiler | soljson-v0.2.0+commit.4dc2445e |
| Optimizer | ON |
| Runtime | 1093 bytes — **exact byte-for-byte match** |
| Creation | 1866 bytes on-chain (runtime is the proven artifact) |
| Runtime SHA-256 | `c0cacb196591851db6758ddb060f671c8452f42de0db58ec484772a4c32a1538` |
| Cluster | 20 identical-runtime deployment(s) (see `addresses.json`); representative verified live via `eth_getCode` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |
## Scope
Exact match of the **on-chain runtime bytecode**. The creation bytecode differs only by ABI-encoded constructor argument(s) appended to the deploy input; `target_creation.txt` is the on-chain creation for reference. `verify.js` asserts the runtime.
## Verify
```
node verify.js
```
## Files
- `mytoken.sol` — reconstructed source
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy tx input)
- `addresses.json` — byte-identical deployments in this cluster
- `verify.js` — reproducible verification script
