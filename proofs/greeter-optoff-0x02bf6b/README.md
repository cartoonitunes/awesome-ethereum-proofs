# greeter (greeter.sol, optimizer OFF) — Bytecode Proof
Reconstructed source for a Frontier/Homestead contract cluster, compiled byte-exact with an era-correct soljson build.
| Field | Value |
|-------|-------|
| Address | `0x02bf6B982C2aFDB7c1209E3D2f283162Ae3842f6` |
| Deployed | Jan 24, 2016 (block 896,276) |
| Deployer | `0x00204d570a6200eeaff624416ae3d3a188418ab8` |
| Deploy tx | `0x05d593bc8bdbebef32ff110d609e5faff6ef343288996f55c7d21c2f88ac6285` |
| Compiler | soljson-v0.2.0+commit.4dc2445e |
| Optimizer | OFF |
| Runtime | 542 bytes — **exact byte-for-byte match** |
| Creation | 908 bytes on-chain (runtime is the proven artifact) |
| Runtime SHA-256 | `ff3443e1eb1d4aced57e1c580473b1c243e41fe1dec98ef8aa871fe15a74daba` |
| Cluster | 67 identical-runtime deployment(s) (see `addresses.json`); representative verified live via `eth_getCode` |
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
