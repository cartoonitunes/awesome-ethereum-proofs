# Whiterabbit0xc3ffccd7 - Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0xc3ffccd710676d1bab6e206f14225cb1ba6c684d` |
| Deployed | March 1, 2016 (block 1082632) |
| Deployer | `0xfa5c91c9b4d0bebf79c1963ba13c760ff83fde09` |
| Deploy tx | `0x8863f1f078ac8fd0afffe1e55b4df0181925418cdb87c9f3614359a565ccaeaf` |
| Compiler | `v0.1.7+commit.b4e666cc` |
| Optimizer | ON |
| Runtime | 1,093 bytes |
| Creation (init code) | 1,582 bytes |
| On-chain creation tx | 1,870 bytes = 1,582 init + 288 ABI-encoded constructor args (9 words) |
| Runtime SHA-256 | `494b02fded7d9992e6e747e049d7fcb9bde7fb776205b6d27f99974d6d537d38` |
| Creation SHA-256 | `e08adb1f47c2e2b1e68633715a86e4c94f35da21b960ee0017311f0115c79eea` |
| Byte match | 100% exact - runtime AND creation init reproduced byte-for-byte |

> _Note from /draft confirm:_ Byte-exact on both runtime (1,093 B) and creation
> init code (1,582 B). The on-chain creation transaction is 1,870 B because it
> appends 288 B of ABI-encoded constructor arguments (call input, not compiler
> output). Compiler soljson-v0.1.7+commit.b4e666cc, optimizer ON. White Rabbit (WR)
> token, frontier era 2016-03-01.

## Contract

White Rabbit (symbol `WR`, `decimals = 0`) is a non-divisible, administrator-controlled
ERC-20-style token deployed to Ethereum mainnet at block 1,082,632 on March 1, 2016,
roughly two weeks before the Homestead hard fork. It was not verified on Etherscan; the
source here was recovered by reconstructing the exact compiler output from the on-chain
bytecode.

The contract designates a single `issuer` (set at construction to the supplied
`centralMinter`, defaulting to the deployer). Only the issuer may `mintToken` (credit new
balance) or `freezeAccount` (set a per-address freeze flag). `transfer` enforces the
balance check, an overflow guard, and a sender-not-frozen check, reverting via `throw` on
any failure. These admin hooks are typical of early, pre-standard token designs that
predate ERC-20's formalization.

The deployer `0xfa5c91c9b4d0bebf79c1963ba13c760ff83fde09` was responsible for 64 contract
deployments across blocks 933,290-1,196,730. Its six Etherscan-verified siblings are all
instances of a token named Godlcoin, each compiled with the same Solidity v0.1.7. No
public website, announcement, or community record for this specific White Rabbit (WR)
deployment has been located; it is preserved here primarily as a verified-bytecode
artifact of frontier-era token experimentation.

## Verification

Compile `Whiterabbit0xc3ffccd7.sol` with `v0.1.7+commit.b4e666cc`, optimizer ON, and
compare against the on-chain bytecode. Both the runtime and the creation init code match
byte-for-byte; only the 288-byte trailing constructor arguments differ (those are deploy
input, not compiler output).

```bash
# Runtime: compiled --bin-runtime equals target_runtime.txt exactly.
sha256sum <(xxd -r -p target_runtime.txt)
# -> 494b02fded7d9992e6e747e049d7fcb9bde7fb776205b6d27f99974d6d537d38

# Creation: the compiled --bin (1,582 B init) is a byte-exact prefix of the
# on-chain creation tx input (1,870 B); the remaining 288 B are the ABI-encoded
# constructor args (initialSupply, tokenName, decimals, tokenSymbol, centralMinter).
```

## Notes

- **Guards use `throw`, not `return`.** Every failure path (`mintToken`/`freezeAccount`
  issuer check, and all three `transfer` conditions) compiles to the v0.1.x invalid-jump
  (`PUSH2 0x0002 JUMP`). A `return` would have produced a clean epilogue jump and broken
  the match.
- **`frozenAccount` is `mapping(address => bool)`.** In v0.1.7 `bool` and `uint8` storage
  produce identical bytecode (same masking trampoline), so either type spelling reproduces
  the same output.
- **`issuer` occupies slot 3.** Early recon decompilation missed it and inferred
  `balanceOf` at slot 3; the byte-exact match confirms the true layout below.

## Storage layout

| Slot | Type | Name |
|------|------|------|
| 0 | `string` | `name` |
| 1 | `string` | `symbol` |
| 2 | `uint8` | `decimals` |
| 3 | `address` | `issuer` |
| 4 | `mapping(address => uint256)` | `balanceOf` |
| 5 | `mapping(address => bool)` | `frozenAccount` |
