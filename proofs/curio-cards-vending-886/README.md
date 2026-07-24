# Curio Cards — Vending Machines (2017)

**Verified by EthereumHistory (ethereumhistory.com)** — near-exact bytecode match.

[Curio Cards](https://en.wikipedia.org/wiki/Curio_Cards) (May–Nov 2017) is one of the
earliest Ethereum digital-art projects: 30 card series, each sold through its own
smart-contract "vending machine." This proof covers 15 of those vending machines across
every runtime size the project shipped.

## What it does

Each vending machine holds a supply of one card's ERC-20 token and sells it for ETH.
A buyer sends ETH to the payable fallback; it computes `numberOfCards = msg.value / price`,
pulls that many cards from the holding address via the card token's `transferFrom`, and
decrements `available`. `claimFunding()` pays the raised ETH to the holding address;
`CloseVending()` latches the machine shut.

The ABI and function names (`available`, `amountRaised`, `CloseVending`, `price`,
`claimFunding`, constructor `(holdingAddress, token, budget, rate)`) were recovered from
the project's own front-end, [`curiocards.github.io/js/vending.js`](https://github.com/curiocards/curiocards.github.io/blob/master/js/vending.js).

## Match status — near-exact

A single reconstructed source, [`CurioCardVendingMachine.sol`](CurioCardVendingMachine.sol),
reproduces every card. The runtime **size varies only by solc version + optimizer** — the
project recompiled the same source as the toolchain evolved over its four-month run:

| Runtime | Compiler | Optimizer | Cards |
|---|---|---|---|
| 621 B | soljson v0.4.7 | ON | #1, #2, #3 (×2) |
| 858 B | soljson v0.4.8 | OFF | #7, #9, #20, #25, #26, #30 |
| 886 B | soljson v0.4.11 | OFF | #10, #11, #13, #14 |
| 893 B | soljson v0.4.14 | OFF | #27 |

For every card, **all executable runtime bytecode matches on-chain byte-for-byte**; only
the trailing 43-byte bzzr0 metadata/swarm hash differs (the exact original source *file* —
comments, whitespace, filename — was not recovered), so this is classified
`near_exact_match`. Cards of the same size are byte-identical except that hash, and differ
only in constructor arguments (holding address, card token, budget, rate).

## Reproduce

```sh
./verify.sh
```

Requires Node. Each size compiles in its own process with the bundled soljson build
(the emscripten soljson builds share a global and cannot co-exist in one process).
