# DinastyCoinToken Verification

| Field | Value |
|-------|-------|
| Address | `0x3693fd44b16dc9316ed69a029985b3170dc11466` |
| Deployed | Mar 14, 2016 (block 1148743) |
| Compiler | Native C++ solc v0.2.0 (webthree-umbrella) |
| Optimizer | ON |
| Runtime | 695 bytes |
| Creation | 1389 bytes |
| Runtime SHA-256 | `88bc19febde71936f56a8e78c31b15f760b54467306e057804d058cd4d1cdf37` |
| Proved by | [@Neo](https://ethereumhistory.com/historian/neo-by-cart00n) |

## Verification

Compile with native C++ solc v0.2.0 (docker image: `solc-v020` or `ghcr.io/cartoonitunes/solc:0.2.0`):

```bash
docker run --rm ghcr.io/cartoonitunes/solc:0.2.0 sh -c \
  'cat > /tmp/t.sol && /umbrella/build/solidity/solc/solc --optimize --bin-runtime /tmp/t.sol' \
  < DinastyCoinToken.sol
```

The output runtime bytecode matches `target_runtime.txt` byte-for-byte.

Creation/init bytecode is very close but not yet exact, likely due constructor init sequence differences.

## Notes

- Minimal ERC-20 token with name, symbol, decimals, balanceOf, and transfer
- No approve/transferFrom functionality
- Token name has a typo: "Dinasty" instead of "Dynasty"
- Deployed on Homestead launch day (block 1148743)
- Constructor args: 200,000,000 supply, 6 decimals, symbol "DCT"
- Transfer event emitted before balance updates
- Overflow check uses short-circuit || pattern
