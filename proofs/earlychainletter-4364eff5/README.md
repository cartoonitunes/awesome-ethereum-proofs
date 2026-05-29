# EarlyChainLetter (0x4364eff5) - Exact Bytecode Proof

A 100 ETH tree-payout "chain letter" deployed on Frontier, Aug 9 2015. This is an
early variant of the `MyScheme` chain letter - deployed before the refined 100 ETH
version (`0x020522bf9b8ed6ff41e2fa6765a17e20e2767d64`). It still holds 1 ETH a decade later.

The only source difference from the later sibling is the `numInvestorsMinusOne <= 2`
branch: this earlier version sends the running balance to `myTree[0]` and zeroes it
before setting `treeDepth = 1`; the later version only sets `treeDepth = 1`.

| Field | Value |
|-------|-------|
| Address | `0x4364eff50d20ca13ec7ec6e9b0f7529a1f39df3c` |
| Deployed | Aug 9, 2015 (block 59716) |
| Deployer | `0xa14cf6cec1c6aae4b608458f6e14692863a937aa` |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | ON |
| Runtime | 830 bytes |
| Creation | 989 bytes |
| Runtime SHA-256 | `583b284e29a4499b030d065be1f3b2e55b6030b367e523fd8574fbe151e3e54e` |
| Creation SHA-256 | `b1797e694b4fd61d0e0cf8f1cfeae75e8d7c21a37f083d0cb801e85684f1295d` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Verify

```
node verify.js
```

The script downloads `soljson-v0.1.1+commit.6ff4cd6`, compiles `MyScheme.sol` with the
optimizer ON, and checks the compiled creation bytecode equals `target_creation.txt`
byte for byte (the on-chain runtime in `target_runtime.txt` is embedded verbatim).

## Files

- `MyScheme.sol` - reconstructed source
- `target_creation.txt` - on-chain creation bytecode (deploy tx input)
- `target_runtime.txt` - on-chain runtime bytecode (eth_getCode)
- `verify.js` - reproducible verification script
