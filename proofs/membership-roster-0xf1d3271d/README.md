# MembershipRoster Contract Verification

Bytecode verification proof for the Ethereum Public Trust MembershipRoster contract by Piper Merriam.

## Contract

| Field | Value |
|-------|-------|
| Address | `0xf1d3271d6d10826af877d99233869d7238aa0455` |
| Deployed | Aug 14, 2015 (block 85,716) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Creation | 1508 bytes (318 bytes init + 1190 bytes runtime) |
| Creation SHA-256 | `24e38ecb40ed73ff1edd473707d0ca5e93c03ecdfa8752b460b252575bd898b3` |
| Runtime SHA-256 | `f689affc6b70ba4bdfc80501cc23c6eee54154c94577fb28b3cd8d796def3cb7` |

## Details

| Field | Value |
|-------|-------|
| Contract name | `MembershipRoster` |
| Deployer | `0xd3CdA913deB6f67967B99D67aCDFa1712C293601` (Ethereum Foundation) |
| Functions | `kill()`, `addMember(address)`, `removeMember(address)`, `checkMembership(address)` |
| Pattern | owned + mortal + membership roster |

## Source

- **Repository:** [pipermerriam/ethereum-public-trust](https://github.com/pipermerriam/ethereum-public-trust)
- **File:** [`contracts/main.sol`](https://github.com/pipermerriam/ethereum-public-trust/blob/27ed96917651aa75d6a795851d06249c31833c11/contracts/main.sol)
- **Commit:** [`27ed969`](https://github.com/pipermerriam/ethereum-public-trust/commit/27ed96917651aa75d6a795851d06249c31833c11) ("update", Aug 13, 2015)

Note: the `master` branch later changed `address[] members` to `mapping(uint => address) members`, which changes the storage layout and produces different bytecode. The deployed contract uses the `address[]` version from commit `27ed969`.

## Verification

```bash
node verify.js
```

The script fetches `contracts/main.sol` directly from the [pipermerriam/ethereum-public-trust](https://github.com/pipermerriam/ethereum-public-trust) GitHub repository at commit `27ed969`, downloads soljson-v0.1.1, compiles with optimizer OFF, and compares the `MembershipRoster` contract bytecode byte-for-byte against the on-chain creation bytecode.
