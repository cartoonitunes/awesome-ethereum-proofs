# Payment Split (0xc9cd61c6)

| Field | Value |
|-------|-------|
| Address | `0xc9cd61c6f278dc6e4cd0f8fe6a8ad1d595b6ec8b` |
| Deployed | May 17, 2017 |
| Deployer | Vitalik Buterin (`0x1db3439a22ee7c4d034e9b26437d3960b5af0517`) |
| Compiler | solc 0.4.11 (optimizer ON) |
| Runtime | 261 bytes |
| Verification | `Near-exact bytecode match (swarm hash differs)` |

A payable payment splitter. `split(address a, address b)` forwards `msg.value / 2` to each of the
two addresses via `.send` (no revert on failure). The executable runtime reproduces byte-for-byte;
only the trailing swarm metadata hash differs.

## Source

```solidity
contract Split {
    function split(address a, address b) payable {
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

The executable body (everything before the `a165627a7a72305820…0029` metadata trailer) reproduces
byte-for-byte. Only the swarm metadata hash differs, since the original source's exact whitespace
and identifiers are not recoverable from a metadata-only hash.

- runtime sha256 `0562931d3e50bc6ca55cb9192d4dc76b470aae1f333b4b4cdcaf238bfad84396`
