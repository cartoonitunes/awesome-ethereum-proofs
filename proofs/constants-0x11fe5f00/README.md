# Constants Contract Verification

A tiny constants-only contract: three `uint256` state variables initialized in the declaration, one of which (`pub`) is declared `public` so the compiler generates an auto-getter. No explicit functions.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x11fe5f00cb9c5de83c13f3b520900d665927fc39` |
| Deployed | 12 Aug 2015 2015 (block 73428) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Runtime | 95 bytes |
| Creation | 139 bytes (44 init + 95 runtime) |
| Runtime SHA-256 | `a5164a4b0e4327f70adf265bd558b3bf664593a79728df97a3c213041345bb3b` |
| Creation SHA-256 | `f4da8cead55df5cf62571bc54e8d123da4f2fdbacf7955842843b984ee452379` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `pub()` (auto-getter) |
| Constructor args | none |
| Pattern | Immutable state variables initialized in declaration + public auto-getter |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `Constants.sol` with the optimizer OFF, and compares the compiled creation and runtime bytecode (byte-for-byte and SHA-256) against the target in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check.
