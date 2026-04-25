# EtherVote Verification

Bytecode verification proof for the EtherVote contract — the voting contract for [ethereum/stake-voice](https://github.com/ethereum/stake-voice), deployed by Alex Van de Sande (avsa) on July 10, 2017.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x8a57d2708d1f228dac2f7934f5311cd2a0a1cda4` |
| Deployed | Jul 10, 2017 (block 4,004,456) |
| Deployer | `0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb` (alex.vandesande.eth) |
| Compiler | soljson v0.4.11+commit.68ef5810 (optimizer OFF) |
| Runtime | 267 bytes |
| Runtime SHA-256 | `a76b0b79c4461925eacb8d860f5fafece4a4b261421197af27b87726b7aab80c` |

## Notes

Source from [ethereum/stake-voice](https://github.com/ethereum/stake-voice/blob/master/contract.sol) at commit near the deployment date. This deployment omits the `function() { throw; }` fallback present in the upstream repo.

Code section matches exactly. The CBOR metadata hash (last 43 bytes) differs from the deployed bytecode, indicating the original compilation used a slightly different source file encoding or filename than recovered here.

## Verification

```bash
node verify.js
```

## Source

See `EtherVote.sol` in this directory.
