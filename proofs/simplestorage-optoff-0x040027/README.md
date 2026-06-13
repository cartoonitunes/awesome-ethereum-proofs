# SimpleStorage (simplestorage.sol, optimizer OFF) — Bytecode Proof
Reconstructed source for a Frontier/Homestead contract cluster, compiled byte-exact with an era-correct soljson build.
| Field | Value |
|-------|-------|
| Address | `0x04002735cEB631FC72f9cAF4c1Cb9A9806A9d74d` |
| Deployed | Mar 24, 2016 (block 1,209,730) |
| Deployer | `0xc89cf504b9f3f835181fd8424f5ccbc8e1bddf7d` |
| Deploy tx | `0x025e4959f5305aad20d9dbe8611005c4ee467c0b7356eb580d7149313e50fa32` |
| Compiler | soljson-v0.1.5+commit.23865e39 |
| Optimizer | OFF |
| Runtime | 151 bytes — **exact byte-for-byte match** |
| Creation | 167 bytes — **exact byte-for-byte match** |
| Runtime SHA-256 | `0417803d533dbf3397593830022d06eddb4014ea8323d0d4e7cc7f9ec137db8b` |
| Creation SHA-256 | `01ef9fc6497f663d6fe73e012b2146afef3240b7364b048545c129f10a3b85aa` |
| Cluster | 18 identical-runtime deployment(s) (see `addresses.json`); representative verified live via `eth_getCode` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |
## Scope
Exact match of **both the on-chain runtime and creation bytecode**, reproduced by the stock `soljson-v0.1.5+commit.23865e39` build (optimizer OFF).
## Verify
```
node verify.js
```
## Files
- `simplestorage.sol` — reconstructed source
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy tx input)
- `addresses.json` — byte-identical deployments in this cluster
- `verify.js` — reproducible verification script
