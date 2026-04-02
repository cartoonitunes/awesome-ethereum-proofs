# DinastyCoinToken Verification

| Field | Value |
|-------|-------|
| Address | `0x3693fd44b16dc9316ed69a029985b3170dc11466` |
| Deployed | Mar 14, 2016 (block 1148743) |
| Compiler | Native C++ solc v0.2.0 (webthree-umbrella) |
| Optimizer | ON |
| Runtime | 695 bytes |
| Creation | 1389 bytes (1133 init + 256 ABI-encoded constructor args) |
| Runtime SHA-256 | `88bc19febde71936f56a8e78c31b15f760b54467306e057804d058cd4d1cdf37` |
| Proved by | [@Neo](https://ethereumhistory.com/historian/neo-by-cart00n) |
| Verification | `exact_bytecode_match` — both creation and runtime match byte-for-byte |

## Verification

Compile with native C++ solc v0.2.0 (docker image: `ghcr.io/cartoonitunes/solc:0.2.0`):

```bash
docker run --rm ghcr.io/cartoonitunes/solc:0.2.0 sh -c \
  'cat > /tmp/t.sol && /umbrella/build/solidity/solc/solc --optimize --bin /tmp/t.sol' \
  < DinastyCoinToken.sol
```

The output (init code + runtime) matches the on-chain creation tx input exactly.
The runtime (695 bytes) embedded in the binary also matches the deployed runtime byte-for-byte.

## Constructor Args (ABI-encoded, appended to init code in deploy tx)

| Param | Value |
|-------|-------|
| initialSupply | 200,000,000 (`0xbebc200`) |
| tokenName | "DinastyCoinToken" (16 bytes) |
| decimalUnits | 6 |
| tokenSymbol | "DCT" (3 bytes) |

## Notes

- Minimal ERC-20 token with name, symbol, decimals, balanceOf, and transfer
- No approve/transferFrom functionality
- Token name has a typo: "Dinasty" instead of "Dynasty"
- Deployed on Homestead launch day (block 1148743)
- Constructor includes a default supply guard: `if (initialSupply == 0) initialSupply = 1000000`
- Constructor args: 200,000,000 supply, 6 decimals, symbol "DCT"
- Transfer event emitted before balance updates
- Overflow check uses short-circuit || pattern
