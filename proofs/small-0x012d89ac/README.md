# Small (Big/Small companion wallet, 0x012D89Ac78) — Runtime + Creation Bytecode Proof

A minimal owner-controlled forwarding wallet — the **"Small"** half of a Big/Small contract pair. It
holds an `owner` and a pointer `b` to a "Big" governance contract. `GetMoney` and `SetBigContract` are
callable only by the Big contract (`msg.sender == address(b)`); `SetOwner` and `UniversalFunctionSecure`
are owner-gated, with `UniversalFunctionSecure` forwarding a 6-argument call to `b.UniversalFunction(...)`.
Deployed on Homestead, May 2016 — one of 125 byte-identical deployments (one Small per Big instance).

| Field | Value |
|-------|-------|
| Address | `0x012D89Ac787BeDdf0f03e269e4B7D70B33e17890` |
| Deployed | May 1, 2016 (block 1,437,077) |
| Deployer | `0x5149ebf29b2fc0206dd5a2b4bf8f429abf66f0f1` |
| Deploy tx | `0xb9c5ba058730830ccb75e96bf9eb2dea5dad01701a7cec65531e5035cc47f183` |
| Compiler | soljson-v0.3.0+commit.11d67369 |
| Optimizer | ON |
| Runtime | 456 bytes — **exact byte-for-byte match** |
| Creation | 525 bytes init+runtime + 32-byte constructor arg — **exact match** |
| Runtime SHA-256 | `6a4f54329e6264605eb74547a7e96959834483d1ed05ae6c7578f6e2831ba408` |
| Cluster | 125 identical-runtime deployments (see `addresses.json`) |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Scope

This proof establishes an **exact match of both the on-chain runtime and creation bytecode**. Compiling
`small.sol` with `soljson-v0.3.0+commit.11d67369` (optimizer ON) and extracting the `Small` contract
reproduces the 456-byte runtime exactly, and the 525-byte creation (init + runtime) exactly. The deploy-tx
input appends a 32-byte ABI-encoded `bigAddress` constructor argument (for the representative,
`0xb36ce92cad11e7a9b903531f30590ebc2e991ea6`); `verify.js` strips and reports it. Each of the 125 cluster
members shares the identical runtime and differs only in this `bigAddress` argument.

The dispatch has five selectors, all resolved: `GetOwner()` (`0xae50a39`→`0x0ae50a39`), `SetOwner(address)`
(`0x167d3e9c`), `GetMoney(uint256,address)` (`0x3cc86b80`), `SetBigContract(address)` (`0xcf09e6e1`), and
`UniversalFunctionSecure(uint8,bytes32,bytes32,bytes32,bytes32,bytes32)` (`0xd4859dbc`).

## Source provenance

`small.sol` is the verified source of a sibling deployment — the companion `Big` contract at
`0xb36ce92cad11e7a9b903531f30590ebc2e991ea6` is Etherscan-verified (compiler `v0.3.0-2016-03-18`,
optimizer ON) and its source file contains both `contract Big` and `contract Small`. That same file,
compiled with the stock `soljson-v0.3.0` release, reproduces this cluster's `Small` bytecode byte for byte.

## Verify

```
node verify.js
```

Downloads `soljson-v0.3.0+commit.11d67369`, compiles `small.sol` (optimizer ON), and checks the compiled
`Small` runtime equals `target_runtime.txt` and the compiled creation equals `target_creation.txt` (minus
the 32-byte constructor arg), byte for byte.

## Files

- `small.sol` — source (verified `Big` + `Small` pair; `Small` is the proven contract)
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy-tx input, incl. 32-byte ctor arg)
- `addresses.json` — the 125 byte-identical deployments in this cluster
- `verify.js` — reproducible runtime + creation verification script
