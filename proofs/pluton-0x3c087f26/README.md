# Pluton Verification

Two Pluton deployments six days apart, both cut from the unmodified ConsenSys `HumanStandardToken`, and together they date an upstream change on chain.

The 20 June contract matches `Consensys/Tokens` at commit `5252384b9a`. The 26 June contract matches commit `884080acfe`, the revision that made `approveAndCall` throw on failure. Neither deployment modifies the reference contract in any way, so the only difference between the two runtimes is that upstream edit.

Scope differs between the two. For `0xb94f85Ea` both the runtime and the creation code match exactly, constructor arguments included. For `0x3C087f26` only the runtime is claimed: it was deployed with no constructor arguments at all yet reads `name = Pluton`, `symbol = PLU`, `decimals = 8` on chain, so its constructor hardcoded those values in a form that has not been recovered. `Pluton_20jun.sol` carries a best effort reconstruction of that constructor, which compiles to 2,442 bytes of creation code against 2,519 on chain. The runtime is unaffected by the constructor and matches exactly.

## Contracts

| Address | Deployed | Compiler | Optimizer | Runtime | Proof covers |
|---|---|---|---|---|---|
| [`0x3C087f2684706B78a1c558e26E2735A4F8dDBb2A`](https://ethereumhistory.com/contract/0x3C087f2684706B78a1c558e26E2735A4F8dDBb2A) | Jun 20, 2016 (block 1,741,183) | soljson-v0.3.2+commit.81ae2a78 | ON | 1821 bytes | runtime only |
| [`0xb94f85Ea35987648BB460A96A34f56Ac1A6cc6F7`](https://ethereumhistory.com/contract/0xb94f85Ea35987648BB460A96A34f56Ac1A6cc6F7) | Jun 26, 2016 (block 1,777,698) | soljson-v0.3.2+commit.81ae2a78 | ON | 1799 bytes | runtime + creation |

## Hashes

| Address | Runtime SHA-256 | Creation SHA-256 |
|---|---|---|
| `0x3C087f26…` | `66e2eaeab2df1b21503cbd8ce9deef3e616c9e4aca275f08340bccd1694952e6` | `f4f1c06b0b66f10926e90ec4379170f7648faae8c2b71c88145c930686054426` |
| `0xb94f85Ea…` | `292684e92833cbb631d7d0885e0de5d86739184bf8d33640a893388b8b1edd68` | `99aeaadb9b776dd459ac0a76c31001ecd8fb21d02d917835926613671888416d` |

| | |
|---|---|
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Verify

```
node verify.js
```

The script reads `manifest.json`, downloads each pinned soljson build from
`binaries.soliditylang.org`, compiles the source and compares the result against the
on-chain hex in this folder. Creation code is compared after stripping the ABI encoded
constructor arguments the deploy transaction appends. Exit code 0 means every target
matched.

## Files

- `Pluton_20jun.sol`
- `Pluton_26jun.sol`
- `addresses.json`
- `creation_0x3c087f26.txt`
- `creation_0xb94f85ea.txt`
- `manifest.json`
- `runtime_0x3c087f26.txt`
- `runtime_0xb94f85ea.txt`
- `verify.js`
