# SplitOnDeploy (0x668cd325)

| Field | Value |
|-------|-------|
| Address | `0x668cd325f6a3411d15ed87cd29da5994890b3254` |
| Deployed | Mar 31, 2017 |
| Deployer | Vitalik Buterin (`0x1db3439a22ee7c4d034e9b26437d3960b5af0517`) |
| Compiler | solc v0.4.9-v0.4.11 (optimizer OFF) |
| Runtime | 51 bytes |
| Verification | `Near-exact bytecode match (swarm hash differs)` |

A one-shot payment splitter. All logic runs in the `payable` constructor: the deployed value is
split in half between two hard-coded addresses. There are no runtime functions, so the deployed
code is just the empty-fallback stub (`60606040525bfe00`) plus the compiler metadata trailer.

This contract is **byte-for-byte identical** to the verified sibling
[`0x15ba299cd634698f86c348793935df129bf4ae27`](https://www.ethereumhistory.com/contract/0x15ba299cd634698f86c348793935df129bf4ae27)
(same 51-byte runtime including the `bzzr://7cb0ceb6…` swarm hash), deployed by Vitalik four
minutes earlier in the same block range.

## Source

```solidity
contract SplitOnDeploy {
    function SplitOnDeploy() payable {
        address a = 0x1Db3439a222C519ab44bb1144fC28167b4Fa6eE6;
        address b = 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045;
        a.send(msg.value / 2);
        b.send(msg.value / 2);
    }
}
```

`a` is Vitalik's deployer account; `b` is `vitalik.eth`.

## Verification

```bash
solc-select use 0.4.11
solc --bin-runtime SplitOnDeploy.sol
```

Reproduces the executable runtime exactly:

```
60606040525bfe00
```

followed by the metadata trailer. As with the canonical sibling, the reconstructed source
reproduces the running code byte-for-byte; only the swarm metadata hash differs (the original
source whitespace/name is not recoverable from a metadata-only hash), so this is classified
`Near-exact bytecode match (swarm hash differs)`.

- runtime sha256 `b58317066f3739876a72c7772bfd5c8e055344e3443035fe7e92c2c1b48bf668`
