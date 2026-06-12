# Coin subcurrency (`token()` mint variant, 0x00593a33) — Runtime + Creation Bytecode Proof

A variant of the canonical **"Dapps for Beginners" subcurrency** from the early ethereum.org
contract tutorial: a minimal token with a `sendCoin` transfer, a public `coinBalanceOf` mapping,
and a `CoinTransfer` event. This variant has **no constructor**; instead a `token(uint)` function
mints to the caller (defaulting to 70,000,000 when called with 0). Deployed on Frontier, 2015.

| Field | Value |
|-------|-------|
| Address | `0x00593a33889733F325ac1342dfD226a2d1742D09` |
| Deployed | block 438,304 |
| Deployer | `0x8d0b69cc5de9cbb2d565c3ec9ff0cf5adc1a2016` |
| Deploy tx | `0x1d03871de0b2fda312749cb7c7c14b0810f1d1eb8e57b9a68ac40b072b2317f0` |
| Compiler | soljson-v0.1.3+commit.028f561d |
| Optimizer | ON |
| Runtime | 278 bytes — **exact byte-for-byte match** |
| Creation | 296 bytes — **exact byte-for-byte match** |
| Runtime SHA-256 | `68747c2fbb55d78003de95964908b2dfeb650757e6ce9803c189dea90cef108a` |
| Creation SHA-256 | `edb3f0d422296c60251c253ac1d4197373965a9bca940dc09abc6d744f211575` |
| Cluster | 54 identical-runtime deployments (see `addresses.json`); representative verified live via `eth_getCode` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Scope

This proof establishes an **exact match of both the on-chain runtime and creation bytecode**.
Unlike the constructor-based subcurrency variant (which needs a native Aug-2015 solc for its
ternary-default creation code), this `token()`-mint variant is reproduced **fully** — runtime and
creation — by the stock `soljson-v0.1.3+commit.028f561d` build with the optimizer ON.

The event topic `keccak("CoinTransfer(address,address,uint256)")` is present on-chain, confirming
the event signature.

## Verify

```
node verify.js
```

Downloads `soljson-v0.1.3+commit.028f561d`, compiles `coin.sol` (optimizer ON), and checks the
compiled runtime equals `target_runtime.txt` and the compiled creation equals `target_creation.txt`,
byte for byte.

## Files

- `coin.sol` — reconstructed source (ethereum.org tutorial subcurrency, `token()` mint variant)
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy tx input)
- `addresses.json` — the 54 byte-identical deployments in this cluster
- `verify.js` — reproducible runtime + creation verification script
