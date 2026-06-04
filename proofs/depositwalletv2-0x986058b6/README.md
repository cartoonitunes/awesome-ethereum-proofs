# DepositWalletV2 -- Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x986058b63c1d3ed610b7ca4cb9cd869a6767da20` |
| Deployed | Feb 8, 2016 (block 971,158) |
| Compiler | soljson v0.1.3+commit.028f561d |
| Optimizer | OFF |
| Runtime | 531 bytes |
| Creation | 595 bytes |
| Runtime SHA-256 | `bbd1f639cd29974895a5005efb2f03a7e18eced89769a8586ce0287d4e373cea` |
| Creation SHA-256 | `3194c43f9dec062a656bdc241798c38daefde2c72e0aab9cb1035c1b184dd39e` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Contract

One of **50 byte-for-byte identical deployments** in the 0--1M block range
(see `addresses.json`); this single source verifies all of them.

## Verification

```bash
node verify.js
```

Downloads soljson-v0.1.3, compiles `DepositWalletV2.sol` (optimizer OFF), and confirms the
compiled runtime is a byte-for-byte match against `target_runtime.txt`.
