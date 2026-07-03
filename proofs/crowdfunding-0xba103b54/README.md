# CrowdFunding, resumable-refund variant (0xba103b54)

| Field | Value |
|-------|-------|
| Address | `0xba103b54987a336ababff8585989331704b7d042` |
| Deployed | Oct 30, 2016 |
| Deployer | Vitalik Buterin (`0x1db3439a22ee7c4d034e9b26437d3960b5af0517`) |
| Compiler | solc 0.4.2 (optimizer OFF; also byte-identical under 0.4.0) |
| Runtime | 867 bytes |
| Verification | `exact_bytecode_match` — byte-for-byte |

A variant of the [CrowdFunding](https://www.ethereumhistory.com/contract/0x2a345bb246cf57b6eb6f8b6408a2c47e07049dc3)
family deployed the same day. `contribute()` records a funder but throws if the deadline has passed.
`refund()` returns contributions if the goal was missed, using a **resumable loop** guarded by
`msg.gas > 100000` that persists its progress in `numRefunded`, so a large refund can be completed
across multiple transactions. `payout()` sends the balance to the beneficiary if the goal was met.

## Verification

```bash
solc-select use 0.4.2
solc --bin-runtime CrowdFunding.sol
```

Reproduces the 867-byte runtime byte-for-byte. runtime sha256 `95d4dcc29ad0ab125b8f09ccb8f2c9408fa57bf451379c2b621e2bb0b60cb2e2`.
