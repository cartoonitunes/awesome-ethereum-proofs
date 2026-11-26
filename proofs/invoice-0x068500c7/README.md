# Invoice - Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x068500c7d15f1151cf2af4a663a5103b92d07d41` |
| Deployed | February 16, 2016 (block 1013013) |
| Deployer | `0x39afc3556daa4d11a0a8f16ec1a490cd84aa6945` |
| Deploy tx | `0x661b14c7d16f7bc2ba3e1776d71384e2d81bc0e54d50bd784dc20bf9ca8784f9` |
| Compiler | `soljson-v0.2.1+commit.91a6b35f` |
| Optimizer | OFF |
| Runtime | 1,138 bytes |
| Creation | 1226 bytes (88 bytes init, 0 bytes constructor args) |
| Runtime SHA-256 | `577e6e3fad83b8a930cce35148a568e6fa11db6a4de49463fc503b147ad76267` |
| Creation SHA-256 | `7c930fc97e65efa7b6395e24b796a229e777d397b5f472b8f3d4b9bca2f58289` |
| Byte match | 100.00% (diff 0 bytes) |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |


## Contract

Invoice is a small payment-receiving contract deployed on February 16, 2016. The deployer becomes the owner. Every payment to the contract triggers the fallback function, which logs an IncomingTx event (block number, sender, value, timestamp) and, once the owner has set a fund manager, forwards the whole balance to that address. If no fund manager is set the payment is rejected.

The owner can set the fund manager, transfer ownership, and call refund(investor), which logs a RefundInvoice event and self-destructs the contract, sending any balance to the given address. A getFundManager(address) function, despite its name, has no owner check and overwrites the stored fund manager with its argument before returning it, which would let anyone redirect forwarded funds. The contract was never called after deployment.

The deployer, 0x39afc3556daa4d11a0a8f16ec1a490cd84aa6945, created 107 contracts between January 28 and March 18, 2016. About 40 of them emit the same IncomingTx event, which shows an invoice and payment-forwarding system being rewritten many times over roughly five weeks, sometimes several versions per hour.

## Verification

`node verify.js` downloads the exact soljson compiler listed above, recompiles
`Invoice.sol`, and compares the result byte-for-byte against the on-chain
runtime (`target_runtime.txt`) and creation (`target_creation.txt`) bytecode. It
must print the PASS lines and exit 0.

## Notes

- `setFundManager` declares its local `address fm = _fundManager;` inside the `if`. Declaring it first and assigning later adds a `DUP1 POP` pair (2 bytes).
- The fund-manager flag is a `bool` compared with `== true`; the constructor explicitly sets it to `false`.
- Function bodies follow declaration order (optimizer off): fallback, refund, setFundManager, getFundManager, changeOwner, forwardFunds.
- Sibling 0xa76dda40 (deployed 28 minutes later) is the same source with `refund` declared last.

## Storage layout

| Slot | Type | Name |
|------|------|------|
| 0 (bytes 0-19) | address | owner |
| 0 (byte 20) | bool | fundManagerSet |
| 1 | address | fundManager |
