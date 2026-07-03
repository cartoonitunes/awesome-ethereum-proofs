# Empty Contract (0xbe6b26a4)

| Field | Value |
|-------|-------|
| Address | `0xbe6b26a4ca07991fc51acd56b2e3091ca4ad610b` |
| Deployed | Jun 23, 2016 |
| Deployer | Vitalik Buterin (`0x1db3439a22ee7c4d034e9b26437d3960b5af0517`) |
| Compiler | solc 0.3.6 (optimizer OFF) |
| Runtime | 10 bytes |
| Verification | `exact_bytecode_match` — byte-for-byte |

An empty Solidity contract with no state, no constructor body, and no functions. Deployed by
Vitalik, most likely as a throwaway / gas-probe. The 10-byte runtime is the canonical empty-contract
stub emitted by the 0.3.x compiler series.

## Source

```solidity
contract Empty {}
```

The contract name is not recoverable from bytecode (an empty contract carries no metadata in this
era), so a neutral placeholder name is used.

## Verification

```bash
solc-select use 0.3.6
solc --bin-runtime Empty.sol   # -> 60606040526008565b00
```

Runtime bytecode reproduces byte-for-byte:

```
60606040526008565b00
```

- runtime sha256 `4dd13cf91cd4e9c1e7c8b4f2e2b685c7b292a7d66ee574999ec4b06e8ad6a456`

`PUSH1 0x60 PUSH1 0x40 MSTORE PUSH1 0x08 JUMP JUMPDEST STOP` — the free-memory-pointer
prologue followed by the empty dispatcher trampoline. solc 0.4.0 emits a different tail
(`...5b600256`), pinning this to the 0.3.x line.
