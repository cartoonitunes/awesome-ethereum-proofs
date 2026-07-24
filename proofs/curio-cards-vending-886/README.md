# Curio Cards — 886-byte Vending Machines (2017)

**Verified by EthereumHistory (ethereumhistory.com)** — near-exact bytecode match.

[Curio Cards](https://en.wikipedia.org/wiki/Curio_Cards) (May–Nov 2017) is one of the
earliest Ethereum digital-art projects: 30 card series, each sold through its own
smart-contract "vending machine." These are four of the 886-byte vending machines.

## What it does

Each vending machine holds a supply of one card's ERC-20 token and sells it for ETH.
Buyers send ETH to the contract (the payable fallback); it computes
`numberOfCards = msg.value / price`, pulls that many cards from the holding address via
the card token's `transferFrom`, and decrements `available`. `claimFunding()` pays the
raised ETH to the holding address; `CloseVending()` latches the machine shut.

The ABI and function names (`available`, `amountRaised`, `CloseVending`, `price`,
`claimFunding`, and the constructor `(holdingAddress, token, budget, rate)`) were
recovered from the project's own front-end, `curiocards.github.io/js/vending.js`.

## Match status — near-exact

| | |
|---|---|
| **Compiler** | soljson **v0.4.11+commit.68ef5810**, optimizer **OFF** |
| **Runtime** | 886 bytes |
| **Executable code** | **byte-for-byte identical** to on-chain (all four cards, and the whole 886B family) |
| **Difference** | only the trailing 43-byte bzzr0 metadata/swarm hash (`a165627a7a7230582…0029`) |

The swarm hash is a fingerprint of the exact original source *file* (comments,
whitespace, filename), which was not recovered — so this is classified `near_exact_match`,
not a full byte-for-byte match. The compiled executable bytecode is otherwise identical.

All 886-byte Curio vending machines share the same runtime (and the same swarm hash
`72cb4a36…`), so this one source reproduces the whole family; the cards differ only in
constructor arguments (holding address, card token, budget, rate).

### Cards covered (previously unverified)

| Card | Address |
|---|---|
| #10 (Future) | [0x46c4723111e2bafef7d5d0664b3f7bc68d875dea](https://ethereumhistory.com/contract/0x46c4723111e2bafef7d5d0664b3f7bc68d875dea) |
| #11 (BTC Keys) | [0xb45e6719fdaa8f25d883bf042c4fe07b14ac8146](https://ethereumhistory.com/contract/0xb45e6719fdaa8f25d883bf042c4fe07b14ac8146) |
| #13 (BTC) | [0x3cf5c70aaa219031ae21dcf8618588a1bbcb058a](https://ethereumhistory.com/contract/0x3cf5c70aaa219031ae21dcf8618588a1bbcb058a) |
| #14 (CryptoCurrency) | [0xa27c29ce0c7096cc27f1f165dc265daf152b0f45](https://ethereumhistory.com/contract/0xa27c29ce0c7096cc27f1f165dc265daf152b0f45) |

## Reproduce

```sh
node verify.js
```

Requires Node (uses the bundled `soljson-v0.4.11.js`; no npm install needed).
