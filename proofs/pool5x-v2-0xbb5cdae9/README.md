## Contract

| Field | Value |
|-------|-------|
| Address | `0xbb5cdae9cc524422a46f24b21ed9e1f718c483f9` |
| Deployed | Sep 17, 2015 (block 249,420) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | ON |
| Runtime | 647 bytes |
| Creation | 666 bytes (19 bytes init) |
| Runtime SHA-256 | `8bd5f1f0a54c1b47852ffc566ceac0ba0a4a03038a248a3cfd2c923b6d909ecc` |
| Creation SHA-256 | `6fe366f19f5a914574fc0cb915efd7a873dc59e1d2fb3007d0c223fc81b0df70` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Notes

A revised version of the original Pool5x contract (`0x246b342b0fd5a8ad8d267e02ae860c71fba8eebe`), deployed by Thomas Bertani / Oraclize team about 17 blocks (~5 minutes) after the original. The structure and admin gate (`0x3c94923400cc...` = Controller) are identical to Pool5x v1, with two functional changes:

1. **Stores 5x msg.value on register**: depositors receive 5x credit immediately upon registering, rather than just being credited their deposit amount.
2. **Emits log events**: `register()` now emits `log(uint256)` events with constants 11 and 12 around the storage write, presumably for off-chain monitoring/debugging.

The source uses an unnamed event parameter (`event log(uint256);`). A named-parameter version (`event log(uint256 x);`) compiles to bytecode that does NOT match this contract — the unnamed form generates different memory layout for the LOG opcode setup.

This contract is part of the Bertani Sept 17, 2015 cluster: Target -> GetSet -> Controller -> Pool5x -> Pool5x v2 (this contract).

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.1, compiles `Pool.sol` with optimizer ON, and compares the output byte-for-byte against the on-chain runtime and creation bytecode.
