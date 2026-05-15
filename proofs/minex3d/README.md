# Minex3D — www.minex3d.com shares

| Field | Value |
|-------|-------|
| Address | `0x0370ddeb2f136649027f54b4bf6e007af2568b0a` |
| Deployed | Apr 22, 2017 |
| Compiler | soljson v0.4.7+commit.822622cf |
| Optimizer | ON |
| Runtime | 3,280 bytes |
| Verification | `source_reconstructed` — 2 bytes short of exact (same approve epilogue wall as CMEP) |

## Verification

Compile with solc v0.4.7 (optimizer enabled):

```bash
solcjs --optimize --bin-runtime Minex3D.sol
```

Produces 3,278 bytes vs 3,280 on-chain runtime — 2 bytes shorter due to the same `DUP3+POP`-around-JUMPDEST gap as CMEP. The terminal `if (false) {}` in `sell()` closes a separate +1 dead-JUMPDEST that solc otherwise omits.

## Notes

- ConsenSys MyAdvancedToken pattern, similar structure to CMEP
- Same MyAdvancedToken family — see CMEP proof for the storage-layout reordering pattern
- `if (false) {}` at end of `sell()` is the source-side trick that emits the stray JUMPDEST present in on-chain
