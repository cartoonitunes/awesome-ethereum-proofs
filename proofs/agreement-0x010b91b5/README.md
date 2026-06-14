# Agreement (document holder, 0x010b91B5dF) — Runtime Bytecode Proof

A minimal on-chain document/agreement holder. It stores an `owner` (the deployer) and a `string` set at
construction; `returnContract()` returns that stored text, and `kill()` lets the owner `suicide` the
contract. Deployed on Homestead, March 2016 — one of 115 byte-identical-runtime deployments (the stored
text is a per-deployment storage value, so it lives off-bytecode and every instance shares one runtime).

| Field | Value |
|-------|-------|
| Address | `0x010b91B5dF9eC1b97f6E6C329CDdc94A6cCec85b` |
| Deployed | Mar 9, 2016 (block 1,123,467) |
| Deployer | `0xf0c5cef39b17c213cfe090a46b8c7760ffb7928a` |
| Deploy tx | `0xd874e78404359f9e9c41b18d21d24fead5c9d107a875513bc8a8a759d5afab1a` |
| Compiler | soljson-v0.1.3+commit.028f561d |
| Optimizer | OFF |
| Runtime | 476 bytes — **exact byte-for-byte match** |
| Runtime SHA-256 | `653e838f6cf6f36b127e11375ee546164835315c3223f1c7c2a788896ab788c1` |
| Cluster | 115 identical-runtime deployments (see `addresses.json`) |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Scope

This proof establishes an **exact match of the on-chain runtime bytecode**. Compiling `agreement.sol`
with `soljson-v0.1.3+commit.028f561d` (optimizer OFF) reproduces the 476-byte runtime byte for byte. The
two dispatch selectors both resolve: `kill()` (`0x41c0e1b5`) and `returnContract()` (`0x83fe3056`).

The **creation** bytecode is not reproduced here because the constructor takes the document `string` as an
argument, so each of the 115 deployments has a different (variable-length) creation input while sharing the
identical runtime; the runtime is the cluster invariant. The early `PUSH29 0x0100…00 / DIV` selector-
dispatch idiom is characteristic of the soljson-v0.1.x series.

## Verify

```
node verify.js
```

Downloads `soljson-v0.1.3+commit.028f561d`, compiles `agreement.sol` (optimizer OFF), and checks the
compiled `Agreement` runtime equals `target_runtime.txt` byte for byte.

## Files

- `agreement.sol` — reconstructed source
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `addresses.json` — the 115 byte-identical-runtime deployments in this cluster
- `verify.js` — reproducible runtime verification script
