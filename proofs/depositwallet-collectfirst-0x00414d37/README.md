# DepositWallet (deposit forwarder, collect-first variant) — Bytecode Proof
Reconstructed source for a Frontier-era contract cluster, compiled byte-exact with an era-correct soljson build.

| Field | Value |
|-------|-------|
| Address | `0x00414D37c3fC0b72F81E43570cef409D22a04e48` |
| Deployed | Jun 18, 2016 (block 1,725,185) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6.js |
| Optimizer | OFF |
| Runtime | 543 bytes — **exact byte-for-byte match** |
| Creation | 607 bytes — **exact byte-for-byte match** |
| Runtime SHA-256 | `8535b686331c4edffe9febcc01bf86cf0b0cf6f6aa62feb04ed05afaa2100f73` |
| Cluster | 123 identical-runtime deployment(s) (see `addresses.json`); representative verified live via `eth_getCode` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Scope
Exact match of **both the on-chain runtime and creation bytecode**, reproduced by the stock
`soljson-v0.1.1+commit.6ff4cd6.js` build (optimizer off). `target_creation.txt` is the on-chain deploy-transaction input
(cross-checked equal to the captured creation code) and `target_runtime.txt` is `eth_getCode` for the
representative; `verify.js` compiles the source and asserts both match byte-for-byte.

An exchange-style deposit wallet: the fallback logs a `Deposit` event (indexed sender, value, indexed literal 88), `collect()` sweeps the balance to the owner via `send`, and `kill()` self-destructs to the owner. Identical to the base DepositWallet source except `collect()` is declared before `kill()` — that source order flips the two function bodies' placement in the runtime, which is what makes this cluster byte-exact. Compiled at soljson v0.1.1 (optimizer OFF), which emits no separate runtime field, so `verify.js` asserts the full creation bytecode matches and that the on-chain runtime is the CODECOPY'd tail of it.

## Verify
```
node verify.js
```

## Files
- `depositwallet.sol` — reconstructed source
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy tx input)
- `addresses.json` — byte-identical deployments in this cluster
- `verify.js` — reproducible verification script
