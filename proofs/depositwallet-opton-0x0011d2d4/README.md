# DepositWallet (optimizer ON, 0x0011d2d4) — Runtime + Creation Bytecode Proof

A minimal owner-controlled deposit wallet: a payable fallback that logs a `Deposit(address indexed
from, uint256 value, uint256 indexed data)` event (with the literal `88`), an owner-only `collect()`
that sends the whole balance to the owner, and an owner-only `kill()` selfdestruct. This is the same
canonical source as the existing `depositwallet-0x2641015c` proof, but compiled with the **optimizer
ON**, producing a distinct 215-byte runtime deployed as its own large cluster.

| Field | Value |
|-------|-------|
| Address | `0x0011d2D4f8d91D955b7FedBE04D8a0600ea657F2` |
| Deployed | Jul 27, 2016 (block 1,960,795) |
| Deployer | `0xd6c9710363cdb12eb585e817f431d44cfa442dde` |
| Deploy tx | `0x8eb3d0a293bf2bbeca65fcc89ef1264319c1646691795500f5db0ef6ac6036ba` |
| Compiler | soljson-v0.1.3+commit.028f561d |
| Optimizer | ON |
| Runtime | 215 bytes — **exact byte-for-byte match** |
| Creation | 249 bytes — **exact byte-for-byte match** |
| Runtime SHA-256 | `5f7796f202a05fbe740463879bab9a29416e75532362c5a6230db0718b991bf8` |
| Creation SHA-256 | `16844bf8c7f7d6c95658cdde61f77633df650b58a97f4edda62f451ecd131f50` |
| Cluster | 1,203 identical-runtime deployments (see `addresses.json`); representative verified live via `eth_getCode` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Scope

Exact match of **both the on-chain runtime and creation bytecode**, reproduced by the stock
`soljson-v0.1.3+commit.028f561d` build with the optimizer ON. The `Deposit` event topic
`keccak("Deposit(address,uint256,uint256)")` is present on-chain, confirming the event signature.

This is the optimizer-ON sibling of `depositwallet-0x2641015c` (optimizer OFF, 543B): same source,
different compiler setting, different on-chain bytecode, deployed as a separate 1,203-member cluster.

## Verify

```
node verify.js
```

Downloads `soljson-v0.1.3+commit.028f561d`, compiles `depositwallet.sol` (optimizer ON), and checks
the compiled runtime equals `target_runtime.txt` and the compiled creation equals
`target_creation.txt`, byte for byte.

## Files

- `depositwallet.sol` — reconstructed source (owner deposit wallet with `Deposit` event)
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy tx input)
- `addresses.json` — the 1,203 byte-identical deployments in this cluster
- `verify.js` — reproducible runtime + creation verification script
