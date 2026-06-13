# Token (token.sol, optimizer ON) — Bytecode Proof
Reconstructed source for a Frontier/Homestead contract cluster, compiled byte-exact with an era-correct soljson build.
| Field | Value |
|-------|-------|
| Address | `0x0042c05dA475FB35e57A31296B08ebF84c1D8DD0` |
| Deployed | Mar 24, 2016 (block 1,209,456) |
| Deployer | `0x146db80d8ddcc9b7c7261b84adc4a47fd623bf6e` |
| Deploy tx | `0x1946086252a393e4d76ca13281e5c72e0c91f9cfc10d5b96f8254a97d636e64b` |
| Compiler | soljson-v0.2.0+commit.4dc2445e |
| Optimizer | ON |
| Runtime | 716 bytes — **exact byte-for-byte match** |
| Creation | 1408 bytes on-chain (runtime is the proven artifact) |
| Runtime SHA-256 | `e5211542a5bb5b2e6f3687600f31bca77ed9a875edcb09bea7e168cc0b0f3417` |
| Cluster | 212 identical-runtime deployment(s) (see `addresses.json`); representative verified live via `eth_getCode` |
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
