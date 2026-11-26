# Invoice - Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0xa76dda4021a408d47dbdf4c718bfd43ab97114df` |
| Deployed | February 16, 2016 (block 1013122) |
| Deployer | `0x39afc3556daa4d11a0a8f16ec1a490cd84aa6945` |
| Deploy tx | `0x55005e4be0759af04a24a358abd1db59e385a41287c5c0d62c28f98588305901` |
| Compiler | `soljson-v0.2.1+commit.91a6b35f` |
| Optimizer | OFF |
| Runtime | 1,138 bytes |
| Creation | 1226 bytes (88 bytes init, 0 bytes constructor args) |
| Runtime SHA-256 | `a6fef11e4c58ce88e2e468da7b788c908ea9f07d7261b0ed6530a74fcb240c58` |
| Creation SHA-256 | `0bb29363630e1ede0fc254cb0a27195c60a1d88b81a746693a278f012158a714` |
| Byte match | 100.00% (diff 0 bytes) |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |


## Contract

Invoice is a small payment-receiving contract deployed on February 16, 2016, 28 minutes after the otherwise identical 0x068500c7 from the same deployer; the only change is that refund is declared last. The deployer becomes the owner. Every payment triggers the fallback function, which logs an IncomingTx event (block number, sender, value, timestamp) and, once the owner has set a fund manager, forwards the whole balance to it. If no fund manager is set the payment is rejected.

The owner can set the fund manager, transfer ownership, and call refund(investor), which logs a RefundInvoice event and self-destructs the contract to the given address. A getFundManager(address) function, despite its name, has no owner check and overwrites the stored fund manager with its argument, which would let anyone redirect forwarded funds.

The deployer, 0x39afc3556daa4d11a0a8f16ec1a490cd84aa6945, created 107 contracts between January 28 and March 18, 2016. About 40 of them emit the same IncomingTx event, which shows an invoice and payment-forwarding system being rewritten many times over roughly five weeks, sometimes several versions per hour.

## Verification

`node verify.js` downloads the exact soljson compiler listed above, recompiles
`Invoice.sol`, and compares the result byte-for-byte against the on-chain
runtime (`target_runtime.txt`) and creation (`target_creation.txt`) bytecode. It
must print the PASS lines and exit 0.

## Notes

- Same source as 0x068500c7 with `refund` moved to the end; with the optimizer off the bodies follow declaration order, so every jump target shifts.
- `setFundManager` declares its local `address fm = _fundManager;` inside the `if` (declaring it first and assigning later adds 2 bytes).

## Storage layout

| Slot | Type | Name |
|------|------|------|
| 0 (bytes 0-19) | address | owner |
| 0 (byte 20) | bool | fundManagerSet |
| 1 | address | fundManager |
