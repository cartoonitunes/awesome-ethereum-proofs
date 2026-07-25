# GlobalSocialEthereum (GSE)

**Verified by EthereumHistory (ethereumhistory.com)** — near-exact bytecode match.

An ERC-20 "free distribution" airdrop token deployed **Oct 21, 2018** at
[`0xf30c8197dc89f1336d38a0efb7ad8440fa5b155c`](https://ethereumhistory.com/contract/0xf30c8197dc89f1336d38a0efb7ad8440fa5b155c).

A **renamed copy of the verified [SiaCashCoin](https://etherscan.io/address/0x74fd51a98a4a1ecbef8cc43be801cce630e260bd)
airdrop template** (same clone family as [EsseChain](../essechain-0x4c65f9d4/) and
[Dataries](../dataries-0x7592eb15/)). Identity/supply: `name = "GlobalSocialEthereum"`,
`symbol = "GSE"`, decimals 18, `totalSupply = 15625000e18`, `totalDistributed = 7812500e18`,
`value = 20000e18`. The runtime exposes a public `SiaCashCoin()` (unrenamed constructor,
selector `0x9a4b19e4`) — the copy-paste artifact that identifies the lineage.

## Match status — near-exact

| | |
|---|---|
| **Compiler** | soljson **v0.4.23** (older than the 0.4.25 siblings — it emits the extra address-masking that produces the 3809-byte runtime; 0.4.25 optimizes it to 3781), optimizer **ON**, 200 runs |
| **Runtime** | 3809 bytes |
| **Executable code** | **byte-for-byte identical** to on-chain |
| **Difference** | only the trailing bzzr0 metadata/swarm hash |

## Reproduce

```sh
node verify.js
```
