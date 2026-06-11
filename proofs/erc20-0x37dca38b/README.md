# Token -- Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x37dca38b1cbb2cd043910ec46fe82ddb9e38f00d` |
| Deployed | Jan 28, 2016 (block 917,622) |
| Compiler | soljson v0.2.0+commit.4dc2445e |
| Optimizer | ON |
| Runtime | 754 bytes |
| Creation | 855 bytes |
| Runtime SHA-256 | `71f085bf025e2a8b28e45c4737041c5c02ae12336f661a2f171802e6c652bd6e` |
| Creation SHA-256 | `629bec34034fcc2c879d63910c4a507faee3f373401a5b1a877e68c09ba9d665` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Contract

A minimal ERC20 token with allowances. It has balanceOf, allowance, totalSupply, transfer, approve, and transferFrom, with Transfer and Approval events (from and to indexed). transfer and transferFrom guard on sufficient balance, sufficient allowance, and a positive amount before moving funds. No name, symbol, or decimals.

## Verification

```bash
node verify.js
```

Downloads soljson-v0.2.0, compiles `Token.sol` (optimizer ON), and confirms the
compiled runtime is a byte-for-byte match against `target_runtime.txt`.
