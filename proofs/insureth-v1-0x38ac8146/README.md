# InsurETH v1 -- Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x38ac81460ae7ff8b50e1ee6e4beaae8f9722049b` |
| Deployed | September 18, 2015 (block 253556) |
| Deployer | `0x0047a8033cc6d6ca2ed5044674fd421f44884de8` (Thomas Bertani, Oraclize founder) |
| Deploy tx | `0x8d963ca3b056e3d1502af0f1701ccd8f22e3a59c3c6e76e2122f3e37432a2a9e` |
| Compiler | soljson v0.1.1+commit.6ff4cd6 |
| Optimizer | ON |
| Runtime | 2077 bytes |
| Creation | 2096 bytes (19 bytes init, 0 bytes constructor args) |
| Runtime SHA-256 | `762d662dabb3493ca4832e0df558cdd60cf46fe4ed54f2aa88674d806d391272` |
| Creation SHA-256 | `61dae5357f55c84e07a4933a303582b66df32d94212d67525475ecec0dccb883` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Contract

InsurETH v1 is the pre-hackathon prototype of the flight-delay insurance contract that
went on to win the Programmable Assets challenge at Hack The Block during London FinTech
Week 2015. It was deployed by Thomas Bertani (founder of Oraclize) on September 18, 2015,
roughly twelve hours before the hackathon opened. Two days later, the hackathon team of
Francesco Canessa, Kristina Butkute, and Thomas Bertani deployed the polished v2 at
`0x88d675e0...`, which is documented separately.

The contract implements a peer-to-peer flight insurance market. Users register a flight
via `register()` and pay a premium; if Oraclize reports the flight as delayed in the
`__callback()`, the contract pays the user five times the premium. Investors fund the
payout pool via `invest()` and withdraw a proportional share of profits via `deinvest()`.
The `investment_ratio()` view function reports how well-capitalized the investor pool is
relative to the funds at risk, expressed as a percentage of invested capital to insurance
exposure. The pool holds at most five concurrent insured flights and reserves five times
each premium against investor funds to guarantee solvency.

The bytecode was recovered by symbolically tracing a SWAP/DIV permutation that diverged
between the on-chain bytecode and the candidate compile. The two SWAP sequences pop
different operand pairs at the consuming `DIV`, so the original Bertani source computes
`invested_total / (this.balance - insured_customers_funds) * 100` (investment coverage
ratio) rather than the more intuitive inverse. Zero-state traces had masked the
divergence because `0 / 0` evaluates the same regardless of operand order.

## Verification

```
node verify.js
```

The script downloads soljson v0.1.1, compiles `Insurance.sol` with the optimizer on, and
compares the output byte-for-byte against the on-chain creation bytecode fetched from
Etherscan.
