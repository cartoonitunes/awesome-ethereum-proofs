# Warm Fuzzies (ﷺ) Verification

| Field | Value |
|-------|-------|
| Address | `0x9535932d6d5262e5beff6a75b19f092be3b5fba8` |
| Deployed | Jun 2, 2016 (block 1,628,149) |
| Compiler | soljson v0.3.1+commit.c492d9be |
| Optimizer | ON |
| Runtime | 3,125 bytes |
| Verification | `source_reconstructed` — size matches; remaining diffs are solc-internal helper placement |

## Verification

Compile with solc v0.3.1 (optimizer enabled):

```bash
solcjs --optimize --bin-runtime WarmFuzzies.sol
```

Produces 3,125 bytes — exact size match against on-chain runtime. The remaining byte content differences are due to solc's deterministic placement of the string-loop helper, which solc places after the dispatcher's return-helpers regardless of any source-level reordering, while on-chain places it at the end of the runtime. See [solc-string-helper-placement memory](../../README.md) for details.

## Notes

- Standard ConsenSys MyAdvancedToken pattern, simplified to include only a buy-side market (no sellPrice, no sell() function)
- Adds owner-callable `withdraw(uint256)`, `destroy()` (selfdestruct), and unusual buy() pattern with msg.value-modulo refund-on-overpayment
- `mintToken` includes overflow checks (`balanceOf[target] + amount` and `totalSupply + amount`)
- `withdraw` uses `if (this.balance < amount)` ordering (sends full balance if insufficient, else exact amount)

## Storage layout

| Slot | Type | Name |
|---|---|---|
| 0 | address | owner |
| 1 | string | standard ("Token 0.1") |
| 2 | string | name |
| 3 | string | symbol |
| 4 | uint8 | decimals |
| 5 | uint256 | totalSupply |
| 6 | uint256 | buyPrice |
| 7 | mapping | balanceOf |
| 8 | mapping | frozenAccount |
| 9 | mapping | allowance |
