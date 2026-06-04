# DepositWallet -- Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x2641015c14fa5ebe4722f81e20d5dbb1a68ebd0e` |
| Deployed | Feb 11, 2016 (block 985,598) |
| Compiler | soljson v0.1.3+commit.028f561d |
| Optimizer | OFF |
| Runtime | 543 bytes |
| Creation | 607 bytes |
| Runtime SHA-256 | `0ee1f2837600722396c810d0eaed253affa09e4fd1e4323e4b9fc2ef520fbe20` |
| Creation SHA-256 | `13b35653210ad3b09bc2078edb86f12d7bc145a683a0ec0d2374e7e86aa81ed0` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Contract

An owned deposit wallet. The payable fallback logs `Deposit(address indexed from, uint256 value, uint256 indexed data)` with the data field set to the literal `88`. `collect()` (`0xe5225381`) forwards the contract balance to the owner via `send`; `kill()` (`0x41c0e1b5`) selfdestructs to the owner. The owner is fixed at storage slot 0 by the constructor.

One of **262 byte-for-byte identical deployments** of this wallet in the 0--1M block range (see `addresses.json`); this single source verifies all of them.

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.3, compiles `DepositWallet.sol` with the optimizer OFF, and confirms the compiled runtime is a byte-for-byte match against `target_runtime.txt` (the on-chain runtime).
