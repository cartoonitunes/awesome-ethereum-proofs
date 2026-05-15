# CMEP — Cloud Mining Ethereum Project

| Field | Value |
|-------|-------|
| Address | `0x9f677fc8b2526d96106eb977d65d9f33b619ad1b` |
| Deployed | Apr 7, 2017 |
| Compiler | soljson v0.4.7+commit.822622cf |
| Optimizer | ON |
| Runtime | 3,364 bytes |
| Verification | `source_reconstructed` — 2 bytes short of exact (approve epilogue `DUP3+POP` wall around exit JUMPDEST cannot be reproduced from source) |

## Verification

Compile with solc v0.4.7 (optimizer enabled):

```bash
solcjs --optimize --bin-runtime CMEP.sol
```

Produces 3,362 bytes vs 3,364 on-chain runtime — 2 bytes shorter. The 2-byte gap is a `DUP3` + `POP` pair wrapped around the exit JUMPDEST in `approve()`'s epilogue that no source variation reaches under any soljson v0.4.x build.

## Notes

- ConsenSys MyAdvancedToken pattern, simplified — no mintToken
- Storage layout has totalSupply at slot 10 (not the standard slot 5), achieved by declaring `totalSupply` in `MyAdvancedToken` and inserting a reserved slot in the `token` base contract
- frozenAccount mapping at slot 11 — value cast to uint8 in storage
- approveAndCall uses `if (approve(...))` directly (not `success = approve(...)` then `if (success)`)
- Sell uses refund-on-failure via `msg.sender.send(...)` then `throw`

## Storage layout

| Slot | Type | Name |
|---|---|---|
| 0 | address | owner |
| 1 | string | standard ("Token 0.1") |
| 2 | string | name |
| 3 | string | symbol |
| 4 | uint8 | decimals |
| 5 | uint256 | _reserved (internal) |
| 6 | mapping | balanceOf |
| 7 | mapping | allowance |
| 8 | uint256 | sellPrice |
| 9 | uint256 | buyPrice |
| 10 | uint256 | totalSupply |
| 11 | mapping | frozenAccount (uint8) |
