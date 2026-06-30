# Coin (ethereum.org subcurrency, constructor variant) — Bytecode Proof
Reconstructed source for a Frontier/Homestead contract cluster, compiled byte-exact with an era-correct soljson build.

| Field | Value |
|-------|-------|
| Address | `0x0910b08DdD031E952b9897c7B94D5C51A2D72a49` |
| Deployed | Feb 21, 2016 (block 1,037,210) |
| Compiler | soljson-v0.1.3+commit.028f561d |
| Optimizer | ON |
| Runtime | 238 bytes — **exact byte-for-byte match** |
| Creation | 314 bytes + 32-byte ABI-encoded constructor arg (`supply`) — **exact byte-for-byte match** |
| Runtime SHA-256 | `d5e50388e265aed4077eca4aefa4d6ebc0837559da4a88701c2e13558e325f56` |
| Cluster | 42 identical-runtime deployment(s) (see `addresses.json`); representative verified live via `eth_getCode` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Scope
Exact match of **both the on-chain runtime and creation bytecode**, reproduced by the stock
`soljson-v0.1.3+commit.028f561d` build (optimizer ON). The deploy tx appends a 32-byte
ABI-encoded `supply` constructor argument (0 for the representative, which the constructor
defaults to 10000); `target_creation.txt` is the full on-chain creation and `verify.js` asserts
the compiled creation equals it minus that 32-byte arg.

This is the "Dapps for Beginners" / ethereum.org **subcurrency** (`Coin`): a public
`coinBalanceOf` mapping, a `sendCoin` transfer firing the `CoinTransfer` event, and a
constructor that seeds the deployer's balance (defaulting to 10000 when called with 0).
The `CoinTransfer(address,address,uint256)` event topic
`16cdf1707799c6655baac6e210f52b94b7cec08adcaf9ede7dfe8649da926146` is present on-chain.
Distinct from the `coin-0x00593a33` (token()-mint variant, 278B) and `coin-0x012a5642`
clusters — a separate runtime hash.

## Verify
```
node verify.js
```

## Files
- `coin.sol` — reconstructed source
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy tx input)
- `addresses.json` — byte-identical deployments in this cluster
- `verify.js` — reproducible verification script
