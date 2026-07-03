# Payment Split, non-payable (0x9e53e16a)

| Field | Value |
|-------|-------|
| Address | `0x9e53e16ae2d9c67bfa313ae358f02d3f120f1060` |
| Deployed | May 17, 2017 |
| Deployer | Vitalik Buterin (`0x1db3439a22ee7c4d034e9b26437d3960b5af0517`) |
| Compiler | solc 0.4.11 (optimizer ON) |
| Runtime | 268 bytes |
| Verification | `Near-exact bytecode match (swarm hash differs)` |

A sibling of [`0xc9cd61c6`](https://www.ethereumhistory.com/contract/0xc9cd61c6f278dc6e4cd0f8fe6a8ad1d595b6ec8b),
deployed the same day. `split(address a, address b)` again forwards `msg.value / 2` to each address
via `.send`, but here the function is **not** marked `payable`, so solc 0.4.11 inserts the
non-payable value-rejection guard (`CALLVALUE ISZERO … INVALID`) at function entry, which is the
7-byte difference between this and the payable version. With the guard in place any call carrying
value reverts, so in practice the two sends transfer zero.

## Source

```solidity
contract Split {
    function split(address a, address b) {
        a.send(msg.value / 2);
        b.send(msg.value / 2);
    }
}
```

## Verification

```bash
solc-select use 0.4.11
solc --optimize --bin-runtime Split.sol
```

The executable body reproduces byte-for-byte; only the swarm metadata hash differs.

- runtime sha256 `40bc4d80ebaf09fb38782f75b694680374ed20cf6e7e20993d6dbeebbf4697ec`
