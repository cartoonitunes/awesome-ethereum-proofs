# ShippingEscrow2 Contract Verification

Bytecode verification proof for a shipping escrow contract with public getters, penalty system, and IPFS cargo documentation.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x47618f0CbA4E98886F169f2bD9E58F39b8f11b45` |
| Deployed | Jan 9, 2016 (block 822,661) |
| Compiler | soljson-v0.1.5+commit.23865e39 |
| Optimizer | OFF |
| Runtime | 2039 bytes |
| Creation | 3415 bytes (800 bytes init + 2615 bytes constructor args) |
| Runtime SHA-256 | `5836baf04de99deb5081400e00889ad3d344f5e58ff366ab2f634715c36e67b0` |
| Creation SHA-256 | `5b19627a48812d278e1437a3c1b61fbd99f15a6fbc404d5b46832fbea88001a9` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Identical Clones

Same deployer, same bytecode, different constructor args:
- `0xbfb62a95d7adc28d7e2af3b39ea7255b6922e668`
- `0xaddDDbD21963Ff1E5619F8B168F804594Cd22b79`

## Related

Sibling of [ShippingEscrow](https://ethereumhistory.com/contract/0x50fb8066db65333dcd07087263bdb534a2edbb59) (1155B runtime, same deployer, same day). ShippingEscrow2 adds public struct getters (seller, cargo, buyer) and uses lowercase function names.

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.6, compiles `ShippingEscrow2.sol` with optimizer OFF, and compares the output byte-for-byte against the on-chain runtime and creation bytecode.
