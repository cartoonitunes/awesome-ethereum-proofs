# Sha3 Contract Verification

Bytecode verification proof for a simple SHA3 hashing contract with function `sh(uint256)`.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x627a6ebfc21a2dc63efac99a68c8e0d85c25bce8` |
| Deployed | Aug 9, 2015 (block 56,121) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 (also matches all native C++ solc 0.1.0 and 0.1.1 builds) |
| Optimizer | ON |
| Runtime | 44 bytes |
| Creation | 61 bytes (17 bytes init + 44 bytes runtime) |
| Runtime SHA-256 | `28de38301fff9aa24721fe7cf4367cd306b5414a66aef040d97a52813cc83197` |
| Creation SHA-256 | `66fc61575ca747548567a1e185d71c5c885528d1d7bbb114e21de6b5ce760b0b` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `sh(uint256)` |
| Constructor args | none |
| Pattern | SHA3 hash utility |

## Verification

node verify.js

The script downloads soljson-v0.1.1, compiles `Sha3.sol` with optimizer ON, and compares the output byte-for-byte against the on-chain creation bytecode. No native compiler or Docker required.

## Source

contract Sha3 {
    function sh(uint256 amount) returns (bytes32) {
        return sha3(amount);
    }
}
