# Timelock (Ethereum Alarm Clock release wallet, 0x0a5763e4) — Runtime Bytecode Proof

A block-height timelock that holds ETH and releases the entire balance to a fixed `beneficiary` once
`block.number >= releaseBlock`. The constructor schedules its own wake-up: it calls
`scheduleCall(releaseBlock)` (paying 2 ether) on **Piper Merriam's Ethereum Alarm Clock Scheduler**,
so the Alarm Clock pokes this contract's fallback at the release block — which is why both
`releaseFunds()` and the fallback perform the release. Deployed on Homestead, Apr 2016.

| Field | Value |
|-------|-------|
| Address | `0x0a5763e438C8f4156Ea4347014852df39a77b3A1` |
| Deployed | Apr 7, 2016 (block 1,291,565) |
| Deployer / beneficiary | `0x1747de68ae74afa4e00f8ef79b9c875a339cda70` |
| Deploy tx | `0xc8f36ed75f4b056b8c6a7e6a677b3c6fee95691aa920fd9d46be0b9332094acc` |
| Compiler (runtime) | soljson-v0.1.3+commit.028f561d |
| Optimizer | ON |
| Runtime | 205 bytes — **exact byte-for-byte match** |
| Runtime SHA-256 | `07371627bc1a31a51dd82a07866aa6eb70ab261fca33991d0f1179d0642c2c3f` |
| Cluster | 26 identical-runtime deployments (see `addresses.json`); representative verified live via `eth_getCode` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Scope

This proof establishes an **exact match of the on-chain runtime bytecode**. The guard is written in
the early-return De-Morgan form `if (this.balance == 0 || block.number < releaseBlock) return;` — the
`||` short-circuit and the `== 0` / `<` comparisons each save an `ISZERO` versus the positive
`> 0 && >=` form, and the if-inversion hoists the release block to the end of the runtime, exactly
matching the on-chain layout.

The **creation** bytecode is not reproduced here: the constructor (`Timelock(address, uint, Scheduler)`)
embeds the Alarm Clock `scheduleCall(uint256)` selector and a 2-ether constant, and the on-chain init
is 156 bytes where soljson emits 162 — i.e. it was deployed with a **native/nightly solc** build
(consistent with `v0.2.0-nightly.2016.1.13`, which the Alarm Clock Scheduler itself was compiled with).
Runtime-exact, same scoping as the `coin-0x012a5642` proof.

## Verify

```
node verify.js
```

Downloads `soljson-v0.1.3+commit.028f561d`, compiles `timelock.sol` (optimizer ON), and checks the
compiled `Timelock` runtime equals `target_runtime.txt` byte for byte.

## Files

- `timelock.sol` — reconstructed source (full fidelity, incl. the Alarm Clock `Scheduler` constructor call)
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy tx input; native-built, for reference)
- `addresses.json` — the 26 byte-identical deployments in this cluster
- `verify.js` — reproducible runtime verification script
