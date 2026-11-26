# Invoice - Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0xb16acc642740372ed53af51ff7e82f1dbc5cee2d` |
| Deployed | February 16, 2016 (block 1013777) |
| Deployer | `0x39afc3556daa4d11a0a8f16ec1a490cd84aa6945` |
| Deploy tx | `0x97783b72a52a57ab1ab2c91bf4d04ff1f94e5ba03b25e589bc6f58ad9107ba00` |
| Compiler | `soljson-v0.2.1+commit.91a6b35f` |
| Optimizer | OFF |
| Runtime | 1,234 bytes |
| Creation | 1297 bytes (63 bytes init, 0 bytes constructor args) |
| Runtime SHA-256 | `c104635c9f0cb8e0135a376402b77887795c0eee2e3c3fbfa856ace2573e9729` |
| Creation SHA-256 | `5d03dbd3b5165d7c316cc5389af2e935c9948d40fb7fac3aca098c603b3a6e16` |
| Byte match | 100.00% (diff 0 bytes) |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |


## Contract

Invoice is a small payment-receiving contract deployed on February 16, 2016. It is a later revision of the invoice contracts the same deployer published earlier that day. The deployer becomes the owner. Every payment triggers the fallback function, which logs an IncomingTx event (block number, sender, value, timestamp) and forwards the whole balance to the fund manager.

Compared with earlier versions, the fund manager is stored as a FundManager struct in a mapping under key 0, the "fund manager set" flag is gone, and getFundManager is now an owner-only read. The owner can also transfer ownership and call refund(investor), which logs a RefundInvoice event and self-destructs the contract to the given address. The same bytecode was deployed three times within 20 minutes (0xb16acc64, 0xab025b47, 0x2386ddc9).

The deployer, 0x39afc3556daa4d11a0a8f16ec1a490cd84aa6945, created 107 contracts between January 28 and March 18, 2016. About 40 of them emit the same IncomingTx event, which shows an invoice and payment-forwarding system being rewritten many times over roughly five weeks, sometimes several versions per hour.

## Verification

`node verify.js` downloads the exact soljson compiler listed above, recompiles
`Invoice.sol`, and compares the result byte-for-byte against the on-chain
runtime (`target_runtime.txt`) and creation (`target_creation.txt`) bytecode. It
must print the PASS lines and exit 0.

## Notes

- The fund manager lives in `mapping (uint => FundManager)` with a one-field struct, written as `fundManagers[0] = FundManager(fm);` (memory struct copied to storage).
- `getFundManager(address)` ignores its argument and returns `fundManagers[0].addr` inside an owner check; the dead `JUMP` after the return is the compiler's end-of-if jump.
- Identical creation bytecode also at 0xab025b474f12581b764a917de236a3b1b9bc31f4 and 0x2386ddc994723c1e1a9fde9241e9f1db7aaa66f5.

## Storage layout

| Slot | Type | Name |
|------|------|------|
| 0 | address | owner |
| 1 | mapping(uint => FundManager{address addr}) | fundManagers |
