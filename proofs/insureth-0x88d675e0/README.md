# InsurETH -- Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x88d675e08b053404209e6b0461a1b648592cfbaa` |
| Deployed | September 20, 2015 (block 262936) |
| Deployer | `0x0462838f4e30223d51310c9725c51217481141c2` (Francesco Canessa, makevoid) |
| Deploy tx | `0x0361e347f16fbbf5763cf67aeaa8a655062dd56eb1dba29ccc68a0173a4c8976` |
| Compiler | soljson v0.1.1+commit.6ff4cd6 |
| Optimizer | ON |
| Runtime | 2894 bytes |
| Creation | 2913 bytes (19 bytes init, 0 bytes constructor args) |
| Runtime SHA-256 | `8603b999321b5a167770cf92b32ecf390e3ec5c7ed9f8aef0a36cd486a96b4a5` |
| Creation SHA-256 | `db4cf8e59951d3a5ede33b0353c6f15607faec4b36d65a51165acaa7c687fe68` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Contract

InsurETH is the winning entry of the Programmable Assets challenge at the Hack the Block
hackathon in London (September 2015), written by Francesco Canessa (makevoid). It implements
a peer-to-peer flight-delay insurance market on Ethereum, using Oraclize for arrival-time
data feeds. Users pay a premium via `register()` and receive a five-to-one payout if their
flight is delayed; investors fund the payout pool via `invest()` and withdraw proportional
gains via `deinvest()`. The contract holds at most five concurrent insured flights, enforces
a two-day registration cutoff before scheduled arrival, and reserves five times each user's
premium against the investor pool to guarantee solvency. Oraclize callbacks are routed
through a sender check in the fallback function.

The deployed source differs from the public GitHub repository (`makevoid/insurETH_trains`)
by one function reordering: the on-chain bytecode emits the `deinvest()` body before
`register()`, while the GitHub source declares `register()` first. The GitHub repo received
a `layout from insureth air` commit four days post-deploy that rearranged the functions,
which is why the published source did not compile to the on-chain bytecode without
correction.

## Verification

```
node verify.js
```

The script downloads soljson v0.1.1, compiles `Insurance.sol` with the optimizer on, and
compares the output byte-for-byte against the on-chain creation bytecode fetched from
Etherscan.
