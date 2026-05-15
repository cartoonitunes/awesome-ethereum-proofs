# Hash DB Token

| Field | Value |
|-------|-------|
| Address | `0x0bf43e7408959fe8030d3729760f179403a20147` |
| Deployed | Aug 7, 2016 |
| Compiler | soljson v0.3.1+commit.c492d9be |
| Optimizer | ON |
| Runtime | 2,406 bytes |
| Verification | `source_reconstructed` — 1 byte shorter than on-chain |

## Verification

Compile with solc v0.3.1 (optimizer enabled):

```bash
solcjs --optimize --bin-runtime HashDB.sol
```

Produces 2,405 bytes vs 2,406 on-chain. The 1-byte gap is in the `.call.value()` setup pattern for `owner.call.value(refund)()` in `buy()` — the on-chain bytecode uses an optimized stack-based gas forwarding pattern that no solc v0.3.x compiler produces from the standard `.call.value()()` syntax.

## Notes

- Bespoke token contract (not standard ConsenSys MyAdvancedToken)
- Custom selectors: `setOwner(address)`, `setFrontend(address)` instead of `transferOwnership`/`mintToken`
- `setPrices` enforces invariants: only on non-zero totalSupply, newSellPrice must not exceed sellPrice nor newBuyPrice
- `buy()` refunds the remainder via owner.call (not msg.sender)
- `transferFrom` skips allowance check when caller is owner or frontend
- Uses `_` (no semicolon) modifier syntax — pre-v0.4 convention; v0.4 requires `_;`

## Storage layout

| Slot | Type | Name |
|---|---|---|
| 0 | address | owner |
| 1 | address | frontend |
| 2 | string | standard ("Token 0.1") |
| 3 | string | name |
| 4 | string | symbol |
| 5 | uint8 | decimals |
| 6 | uint256 | totalSupply |
| 7 | uint256 | sellPrice |
| 8 | uint256 | buyPrice |
| 9 | mapping | balanceOf |
| 10 | mapping | allowance |
