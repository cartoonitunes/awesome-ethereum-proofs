# DepositWalletV2 (depositwalletv2.sol, optimizer ON) — Bytecode Proof
Reconstructed source for a Frontier/Homestead contract cluster, compiled byte-exact with an era-correct soljson build.
| Field | Value |
|-------|-------|
| Address | `0x06E808E9A7b5C2aB101Bb92B3a0df2B1170aE56D` |
| Deployed | Feb 4, 2016 (block 953,172) |
| Deployer | `0x2ef241a3301dc6b367ed27b7fc55259ae9a2d78f` |
| Deploy tx | `0xd09bd4a1801538ec749b29d0b06fe5d23cc4069c69398894dcd3272552180b7c` |
| Compiler | soljson-v0.1.3+commit.028f561d |
| Optimizer | ON |
| Runtime | 204 bytes — **exact byte-for-byte match** |
| Creation | 238 bytes — **exact byte-for-byte match** |
| Runtime SHA-256 | `035cfee10ca27caecfbd76fb92e006320e6e5c7fe2a11e4de99b72685ac1aa99` |
| Creation SHA-256 | `afeb1f904e7bce712e6bab93d628df50d85a00b4ce64d95e690e41abfba24481` |
| Cluster | 15 identical-runtime deployment(s) (see `addresses.json`); representative verified live via `eth_getCode` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |
## Scope
Exact match of **both the on-chain runtime and creation bytecode**, reproduced by the stock `soljson-v0.1.3+commit.028f561d` build (optimizer ON).
## Verify
```
node verify.js
```
## Files
- `depositwalletv2.sol` — reconstructed source
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy tx input)
- `addresses.json` — byte-identical deployments in this cluster
- `verify.js` — reproducible verification script
