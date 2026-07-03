# CrowdFunding (0xa9123962)

| Field | Value |
|-------|-------|
| Address | `0xa9123962f8ef5fcc55700dfa33a6c65ed4966f32` |
| Deployed | Oct 30, 2016 |
| Deployer | Vitalik Buterin (`0x1db3439a22ee7c4d034e9b26437d3960b5af0517`) |
| Compiler | solc 0.3.6 (optimizer OFF) |
| Runtime | 846 bytes |
| Verification | `exact_bytecode_match` — byte-for-byte |

A minimal crowdfunding contract. `fund()` records the caller and their sent value as a `Funder`.
After the `deadline`, `refund()` returns every contribution if the contract balance is below `goal`,
and `collect()` sends the whole balance to the `beneficiary` if the goal was met. `deadline` is a
public getter. One of five byte-identical copies Vitalik deployed the same day.

## Verification

```bash
solc-select use 0.3.6
solc --bin-runtime CrowdFunding.sol
```

Reproduces the 846-byte runtime in `onchain_runtime.hex` byte-for-byte (solc 0.3.6 predates swarm
metadata, so the match is complete). runtime sha256 `f558496da613d2c10a8653c6a5f13c847c42918d25ec58a4ccaddf43f277281e`.
