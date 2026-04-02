# Unicorns Token (MyToken) - Source Reconstruction

Three ERC-20 token contracts deployed by avsa (Alex Van de Sande, `0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb`) on February 11, 2016. All use the name "Unicorns" with symbol "unicorn emoji" (U+1F984), deployed as test tokens during early Ethereum development.

## Instances

| Instance | Address | Block | ETH Balance | centralMinter |
|----------|---------|-------|-------------|---------------|
| A (= C) | [`0x1f75047233517dcf67970d9e3c3bb385cb647f30`](https://ethereumhistory.com/contract/0x1f75047233517dcf67970d9e3c3bb385cb647f30) | 987982 | 0.01 ETH | `0x0` (deployer) |
| B | [`0x41a7820c86f4bea29e6c9239aeb0fbdba12dd790`](https://ethereumhistory.com/contract/0x41a7820c86f4bea29e6c9239aeb0fbdba12dd790) | 988807 | 0.001 ETH | `0xfb6916...` |
| C | [`0x59a273f78e4d22fcde1a254251941a49295c6786`](https://ethereumhistory.com/contract/0x59a273f78e4d22fcde1a254251941a49295c6786) | 987979 | 0 | `0x0` (deployer) |

Instances A and C have identical runtime bytecode. Instance B has different runtime (different internal code layout) but the same source.

## Verification

| Field | Value |
|-------|-------|
| Compiler | Solidity v0.1.1 (native C++, webthree-umbrella, commit 6ff4cd6) |
| Optimizer | ON |
| Method | Source reconstructed - identical code block multiset confirmed |
| Runtime (A, C) | 1830 bytes |
| Runtime (B) | 1830 bytes |
| Runtime SHA-256 (A, C) | `ba3c503d9ddb1ea29fef5275e2d533cdcca5543733c2abef2ff29228c28ea997` |
| Runtime SHA-256 (B) | `fd5d86122628fd21110428702162ffb14c64adbad8c6143325b2419d2b8a8462` |
| Proved by | [@neo](https://ethereumhistory.com/historian/neo-historian) |

## Source Reconstruction Notes

The source (`MyToken.sol`) was reconstructed by analyzing the on-chain bytecode. Key findings:

- **ERC-20 base**: Standard transfer, approve, transferFrom, totalSupply, balanceOf, allowance, decimals, name, symbol
- **Extended**: mintToken, freezeAccount, transferOwnership
- **Storage layout**: `owner` (slot 0), `name` (slot 1), `symbol` (slot 2), `decimals` (slot 3), `totalSupply` (slot 4), `balanceOf` (slot 5), `frozenAccount` (slot 6), `allowance` (slot 7), `spentAllowance` (slot 8)
- **Overflow checks**: Both `transfer()` and `transferFrom()` include `if (balanceOf[_to] + _value < balanceOf[_to]) throw;`
- **mintToken**: Emits a single Transfer event: `Transfer(owner, target, mintedAmount)` (not two events)
- **approve()**: Returns `bool success` but no explicit `return true` - returns implicitly
- **transferFrom()**: Emits `Transfer(msg.sender, _to, _value)` (sender, not _from) - known early template quirk
- **Gas formula**: String getter uses `15 * numWords + 3` call gas (v0.1.1 C++ pattern)
- **String storage**: Old Solidity v0.1.1 string packing format (pre-v0.1.3 change)

The code blocks of the compiled source match the on-chain bytecode exactly (same block multiset after normalizing jump destinations). The layout difference between instances A/C and B suggests they were compiled from the same source with the same compiler, with the optimizer producing slightly different code ordering for each compilation run.

## Source

See `MyToken.sol` in this directory.

## Verify

```bash
# Compile with native v0.1.1 (requires docker)
cat MyToken.sol | docker run --rm -i ghcr.io/cartoonitunes/solc:0.1.1 \
  /bin/sh -c "cat > /tmp/t.sol && /umbrella/build/solidity/solc/solc --optimize --bin-runtime /tmp/t.sol"

# The block structure matches target_runtime_A.hex and target_runtime_B.hex
# (exact jump destinations may differ depending on optimizer run)
```
