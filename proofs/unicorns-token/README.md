# Unicorns Token (MyToken) — Full Source Recovery

Eight ERC-20 token contracts deployed by Alex Van de Sande (avsa, ENS: `alex.vandesande.eth`, `0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb`) on February 11, 2016 as part of the official [Ethereum Token Tutorial](https://github.com/ethereum/ethereum.org). All use the name "Unicorns" with symbol 🦄 (U+1F984).

Source code fully recovered by bytecode analysis and verified on Etherscan and Sourcify. All 8 contracts are now verified.

## Contracts

Three distinct source variants produce two runtime sizes:

### Variant 1802c — `MyToken_1802c.sol` (1802 bytes)

Functions declared **before** state variables in MyToken body; `transferOwnership` in MyToken; fallback throws.

| Address | Block | centralMinter |
|---------|-------|---------------|
| [`0xe36905580fa8cc3006c14bafab9d0ecf39c9c124`](https://etherscan.io/address/0xe36905580fa8cc3006c14bafab9d0ecf39c9c124) | 988921 | `0x0` (deployer) |
| [`0xab15f08da9b99cbd2f71922953af9a38942d05ec`](https://etherscan.io/address/0xab15f08da9b99cbd2f71922953af9a38942d05ec) | 988935 | `0xfb6916...` |

### Variant 1830a — `MyToken_1830a.sol` (1830 bytes)

`transfer`/`mintToken`/`freezeAccount`/`transferOwnership` declared **before** state vars; `transferFrom`/`approve`/fallback **after**; fallback forwards ETH to owner (no throw).

| Address | Block | centralMinter |
|---------|-------|---------------|
| [`0x1a3970be1fcfc610a588b268e3f4e8fa8add1076`](https://etherscan.io/address/0x1a3970be1fcfc610a588b268e3f4e8fa8add1076) | 987976 | `0x0` (deployer) |
| [`0x59a273f78e4d22fcde1a254251941a49295c6786`](https://etherscan.io/address/0x59a273f78e4d22fcde1a254251941a49295c6786) | 987979 | `0x0` (deployer) |
| [`0x1f75047233517dcf67970d9e3c3bb385cb647f30`](https://etherscan.io/address/0x1f75047233517dcf67970d9e3c3bb385cb647f30) | 987982 | `0x0` (deployer) |

### Variant 1830b — `MyToken_1830b.sol` (1830 bytes)

State variables declared **before** all functions in MyToken; `transferOwnership` in `owned` base contract; fallback forwards ETH to owner (no throw).

| Address | Block | centralMinter |
|---------|-------|---------------|
| [`0x8cb1f47bf87ba23221053933e10933f92f74105b`](https://etherscan.io/address/0x8cb1f47bf87ba23221053933e10933f92f74105b) | 988798 | `0xfb6916...` |
| [`0x41a7820c86f4bea29e6c9239aeb0fbdba12dd790`](https://etherscan.io/address/0x41a7820c86f4bea29e6c9239aeb0fbdba12dd790) | 988807 | `0xfb6916...` |
| [`0x6bbfe039121bc99e907303c533b81f7048e840e6`](https://etherscan.io/address/0x6bbfe039121bc99e907303c533b81f7048e840e6) | 988814 | `0xfb6916...` |

(`0xfb6916...` = `0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359`, the Ethereum Foundation multisig)

## Verification

| Field | Value |
|-------|-------|
| Compiler | Solidity `v0.2.0-nightly.2016.1.13+commit.d2f18c73` |
| Optimizer | ON (`--optimize`, 200 runs) |
| Method | Perfect bytecode match (exact runtime match) |
| Verification | Etherscan + Sourcify |

### Bytecode Hashes

| Variant | Runtime Size | SHA-256 |
|---------|-------------|---------|
| 1802c | 1802 bytes | `4fec9e5f6c0ba65aa6a0283a39ee25c2becbf9ffb1ca17fe898c9058f2ef6f95` |
| 1830a | 1830 bytes | `ba3c503d9ddb1ea29fef5275e2d533cdcca5543733c2abef2ff29228c28ea997` |
| 1830b | 1830 bytes | `fd5d86122628fd21110428702162ffb14c64adbad8c6143325b2419d2b8a8462` |

## Source Recovery Methodology

All three variants share identical Solidity logic. The three different compiled outputs arise from differences in **declaration order** within the source, which determines C++ pointer order in Solidity 0.2.0's `appendFunctionsWithoutCode()` — and therefore the order of code blocks in the compiled output.

Key insight: The position of the **string copy helper** (used by `name()` and `symbol()` getters) relative to function bodies reveals whether functions were declared before or after state variables:

- **1802c**: All explicit functions in MyToken body declared before state vars → string helper appears late (after all function bodies)
- **1830a**: Four functions before state vars, three after → string helper appears mid-bytecode
- **1830b**: State vars before all functions; `transferOwnership` in `owned` base → string helper appears early

The `BlockDeduplicator` keeps the **first** occurrence of duplicate blocks, so the string copy loop (shared between `name()` and `symbol()`) anchors to the first function that uses it — which differs by variant.

Compiled and verified using a rebuilt `solc` binary at exact commit `d2f18c73` of the [webthree-umbrella](https://github.com/ethereum/webthree-umbrella) repository, running inside the `solc-umbrella` Docker container.

## Proved by

[@neo](https://ethereumhistory.com/historian/neo-historian) — [EthereumHistory](https://ethereumhistory.com)

Source repository: [cartoonitunes/avsa-mytoken-verification](https://github.com/cartoonitunes/avsa-mytoken-verification)

## Verify

```bash
# Compile with solc v0.2.0-nightly.2016.1.13+commit.d2f18c73
# (requires solc-umbrella Docker container with the correct binary)
docker run --rm -v $(pwd):/work solc-umbrella bash -c \
  '/work/solc-d2f18c73 --optimize --bin-runtime /work/MyToken_1802c.sol'

# Compare output to target_runtime_1802c.hex (strip 0x prefix)
# Repeat for MyToken_1830a.sol -> target_runtime_1830a.hex
# Repeat for MyToken_1830b.sol -> target_runtime_1830b.hex
```
