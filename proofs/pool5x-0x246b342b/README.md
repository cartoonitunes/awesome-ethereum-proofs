## Contract

| Field | Value |
|-------|-------|
| Address | `0x246b342b0fd5a8ad8d267e02ae860c71fba8eebe` |
| Deployed | Sep 17, 2015 (block 249,403) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | ON |
| Runtime | 504 bytes |
| Creation | 523 bytes (19 bytes init) |
| Runtime SHA-256 | `0222255ce81af3305eae57bbfe6b69329ebdcceae97e5e21df21477177922698` |
| Creation SHA-256 | `ddc3198c86c01630aea5a35485313d9d67284f796ad62ea53a06a217ff617e37` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Notes

A pool/lottery prototype deployed by Thomas Bertani (Oraclize team) on September 17, 2015, three blocks after the GetSet proxy contract from the same deployer (`0x0047A8033CC6d6Ca2ED5044674Fd421F44884dE8`). The contract allows users to deposit ETH via `register()`, stores balances in a public mapping, and provides an admin-gated `finalize()` function that sends 5x the depositor's balance to a specified beneficiary before zeroing their balance.

The admin address (`0x3c94923400ccc528e8ab0f849edafca06fe332e5`) is another contract deployed by the same key, acting as an access control gate. The contract was called exactly once after deployment: a 7-wei test registration by the deployer.

Uses `address constant admin` for the admin address (confirmed by PUSH20-before-CALLER operand order in the bytecode) and early-return guard clauses (`if (admin != msg.sender) return;`) rather than wrapping bodies in if-blocks (confirmed by separate-block layout in optimizer output).

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.1, compiles `Pool.sol` with optimizer ON, and compares the output byte-for-byte against the on-chain runtime and creation bytecode.
