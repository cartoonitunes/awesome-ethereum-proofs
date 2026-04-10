# Sha3 Contract Verification

Bytecode verification proof for a simple SHA3 hashing contract. Identical bytecode to [sha3-0x82000e22](../sha3-0x82000e22), deployed by the same address 17 blocks earlier.

## Contract

| Field | Value |
|-------|-------|
| Address | `0xb179a893de8ec62bc2817eafb369412de74bf09d` |
| Deployed | Aug 9, 2015 (block 56,082) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 (also matches all native C++ solc 0.1.0 and 0.1.1 builds) |
| Optimizer | ON |
| Runtime | 44 bytes |
| Creation | 61 bytes (17 bytes init + 44 bytes runtime) |
| Runtime SHA-256 | `f71e00ea34b5f4006646924dc9497466c0d525b6fcf698f193fad47536026994` |
| Creation SHA-256 | `412718381f2aa0136b601f750cdb4fbe639460eae27cd31eb31769cd7e7efb94` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `s(uint256)` |
| Constructor args | none |
| Pattern | SHA3 hash utility |

## Sibling

`0x82000e228027bbfab26eff81c221024fe4b0690a` (block 56,099) has identical bytecode, deployed by the same address 17 blocks later.

## Verification

node verify.js

The script downloads soljson-v0.1.1, compiles `Sha3.sol` with optimizer ON, and compares the output byte-for-byte against the on-chain creation bytecode. No native compiler or Docker required.

## Source

contract Sha3 {
    function s(uint256 index) returns (bytes32) {
        return sha3(index);
    }
}
