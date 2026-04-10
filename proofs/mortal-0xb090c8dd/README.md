# Mortal Contract Verification

Bytecode verification proof for a standalone Mortal contract — the classic self-destruct pattern. Identical bytecode to [mortal-0x28111823](../mortal-0x28111823).

## Contract

| Field | Value |
|-------|-------|
| Address | `0xb090c8dd5ddd7f505a2a4b66879a8a2b0962a963` |
| Deployed | Aug 14, 2015 (block 82,748) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 (also matches all native C++ solc 0.1.0 and 0.1.1 builds) |
| Optimizer | OFF |
| Runtime | 213 bytes |
| Creation | 276 bytes (63 bytes init + 213 bytes runtime) |
| Runtime SHA-256 | `356f31eccf6dd9541436094bec25b39db99ce19aaf289a7511478099c77894e1` |
| Creation SHA-256 | `9b815931ab17510176a0a57da958bdb75efd07d48b9dcd1d99a8c2ef3f1a0c1b` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `kill()` |
| Constructor args | none |
| Pattern | Mortal (owner + selfdestruct) |

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.1, compiles `Mortal.sol` with optimizer OFF, and compares the output byte-for-byte against the on-chain creation bytecode. No native compiler or Docker required.

## Source

```solidity
contract Mortal {

    address owner;

    function Mortal() {
        owner = msg.sender;
    }

    function kill() {
        if (msg.sender == owner) {
            suicide(owner);
        }
    }
}
```
