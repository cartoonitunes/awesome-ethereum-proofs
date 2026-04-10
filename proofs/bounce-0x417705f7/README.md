# Bounce Contract Verification

Bytecode verification proof for a simple Bounce contract that sends back any ETH received to the sender.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x417705f7e5dba87c3db5ce00295027ae27bcae0f` |
| Deployed | Aug 12, 2015 (block 74,739) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 (also matches all native C++ solc 0.1.0 and 0.1.1 builds) |
| Optimizer | ON |
| Runtime | 57 bytes |
| Creation | 74 bytes (17 bytes init + 57 bytes runtime) |
| Runtime SHA-256 | `d55740b83e42ccd82fb981584d18f6942e2020cad743c0c4776e36be71b7ae24` |
| Creation SHA-256 | `cb260d91d144319ecfb4764c5186aa73a90949d869c33cfd180e0db39dcbfe96` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | fallback only (no named functions) |
| Constructor args | none |
| Pattern | ETH bounce (returns all received ETH to sender) |

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.1, compiles `Bounce.sol` with optimizer ON, and compares the output byte-for-byte against the on-chain creation bytecode. No native compiler or Docker required.

## Source

```solidity
contract Bounce {
    function () {
        msg.sender.send(msg.value);
    }
}
```
