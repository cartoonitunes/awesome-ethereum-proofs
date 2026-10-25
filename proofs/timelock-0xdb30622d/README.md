# TimeLock (0xdb30622d): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0xdb30622d51e8d6221f0b1cbde57d4734387d7ca1` |
| Deployed | Oct 16, 2015 (block 394,420) |
| Deployer | `0x16893e10b99a59afd2c60331e0b49241d4d4d7cc` |
| Compiler | soljson-v0.1.5+commit.23865e39 |
| Optimizer | OFF |
| Runtime | 873 bytes, exact byte-for-byte match |
| Creation | exact match |
| Runtime SHA-256 | `5411b991011dbfb34150a4490687fe5dcfeeaf8faaead0b946b4da1adf7f547b` |
| Identical deployments | 1 (see `addresses.json`) |
| Etherscan | verified |

## Source

handwritten reconstruction from bytecode; events Locked/Withdrew resolved from their topic hashes, withdrawAtTimestamp(uint256) recovered by dictionary search.

Contract name: stand-in: the original contract name is not recoverable from the bytecode; TimeLock describes what it does.

## Verify

```
node verify.js
```
