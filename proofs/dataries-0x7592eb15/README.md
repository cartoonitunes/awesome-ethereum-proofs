# Dataries (symbol "7")

**Verified by EthereumHistory (ethereumhistory.com)** — near-exact bytecode match.

An ERC-20 "free distribution" airdrop token deployed **Dec 11, 2018** (block 6,867,180)
at [`0x7592eb1596614e420214f4f6259cbc37f09178d4`](https://ethereumhistory.com/contract/0x7592eb1596614e420214f4f6259cbc37f09178d4).

## What it is

Dataries is a **renamed copy of the verified [SiaCashCoin](https://etherscan.io/address/0x74fd51a98a4a1ecbef8cc43be801cce630e260bd) airdrop template**
— part of the same clone family as [EsseChain](../essechain-0x4c65f9d4/). It keeps the
template logic verbatim (decimals 18, `getTokens()` claim with `value.div(100000).mul(99999)`
decay, `if (toGive > 0)` blacklist guard) and changes only the token identity and supply:
`name = "Dataries"`, `symbol = "7"`, `totalSupply = 117187500e18`, `totalDistributed = 58593750e18`.

Like the rest of the family, the contract was renamed but its old-style constructor was
left named `function SiaCashCoin()`, so it is a callable public function present in the
runtime (selector `0x9a4b19e4`) — the copy-paste artifact that identifies the lineage.

## Match status — near-exact

| | |
|---|---|
| **Compiler** | soljson **v0.4.25**, optimizer **ON**, 200 runs |
| **Runtime** | 3781 bytes |
| **Executable code** | **byte-for-byte identical** to on-chain |
| **Difference** | only the trailing bzzr0 metadata/swarm hash |

## Reproduce

```sh
node verify.js
```
