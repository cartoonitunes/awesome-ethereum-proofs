## Contract

| Field | Value |
|-------|-------|
| Address | `0x3c94923400ccc528e8ab0f849edafca06fe332e5` |
| Deployed | Sep 17, 2015 (block 247,976) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | ON |
| Runtime | 158 bytes |
| Creation | 214 bytes (56 bytes init) |
| Runtime SHA-256 | `3f47faff361053192458753817baf5ea1941279e36b55eb12037da96a5fe4762` |
| Creation SHA-256 | `0d42e576878f3289657c307c6b54085983e4df3ce674aedb52585970537bdf89` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Notes

A forwarding proxy contract deployed by Thomas Bertani (Oraclize team) on September 17, 2015. It forwards `set(uint256)` calls to a hardcoded target contract (`0x9e0ae8ffd946d12d1d393c6f3bca0eecadc9428e`, the same target used by the GetSet proxy at `0x77beac0aed3b...`). The `get()` function returns the constant `0xff` (255).

This contract is also the admin gate for the Pool5x lottery prototype (`0x246b342b0fd5a8ad8d267e02ae860c71fba8eebe`), whose `finalize()` function only runs if the caller is this controller address. So this contract sits in the middle of a three-contract network: Pool5x calls this controller, this controller forwards to `0x9e0ae8ff...`.

Uses a typed contract interface call (`T.set(x)`) with a local variable assignment (`T t = target; t.set(x);`) that produces 2 extra bytes over the inline form. The CALL is made with `gas = GAS - 25050` and `require(success)` via `ISZERO; PUSH1 0x02; JUMPI` (throw on failure).

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.1, compiles `Controller.sol` with optimizer ON, and compares the output byte-for-byte against the on-chain runtime and creation bytecode.
