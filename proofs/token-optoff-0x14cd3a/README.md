# Token (token.sol, optimizer OFF) — Bytecode Proof
Reconstructed source for a Frontier/Homestead contract cluster, compiled byte-exact with an era-correct soljson build.
| Field | Value |
|-------|-------|
| Address | `0x14Cd3aA183eed2640fbaC18F8a9f7adFEd6dd181` |
| Deployed | Nov 4, 2015 (block 490,778) |
| Deployer | `0xb40a1890d2c75ecd8d592bb2cb0c5b4509cb55fd` |
| Deploy tx | `0x96410272c5a9649d9d4335d067e6deb081de490e9088ab72a7b320dd633d297c` |
| Compiler | soljson-v0.1.5+commit.23865e39 |
| Optimizer | OFF |
| Runtime | 1225 bytes — **exact byte-for-byte match** |
| Creation | 1971 bytes on-chain (runtime is the proven artifact) |
| Runtime SHA-256 | `6371acd326fc17584c96d88ac9377bba36da5b1bc322d726a1ce8b3136406ffc` |
| Cluster | 1 identical-runtime deployment(s) (see `addresses.json`); representative verified live via `eth_getCode` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |
## Scope
Exact match of the **on-chain runtime bytecode**. The creation bytecode differs only by ABI-encoded constructor argument(s) appended to the deploy input; `target_creation.txt` is the on-chain creation for reference. `verify.js` asserts the runtime.
## Verify
```
node verify.js
```
## Files
- `token.sol` — reconstructed source
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy tx input)
- `addresses.json` — byte-identical deployments in this cluster
- `verify.js` — reproducible verification script
