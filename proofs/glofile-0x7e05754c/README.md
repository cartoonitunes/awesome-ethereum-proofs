# Glofile (0x7e05754c, 0xfe80cdb9, 0x01eb0112): Bytecode Proof

| Field | Value |
|-------|-------|
| Addresses | `0x7E05754CA55673358F424C695A243fd0412eE97A`, `0xfE80CDb9a559cE7F8ed6392e3F4c38113E1e0D4D`, `0x01Eb011239275178445C870dC34455228b0714F5` |
| Deployed | Sep 22, 2015 |
| Deployer | `0x8674c218F0351A62c3Ba78C34Fd2182A93da94E2` |
| Source | github.com/ethernomad/glofile-ethereum: commits 7e7bec2, 0424874, dc79582, `glofile.sol` unchanged apart from the attribution line |
| Compiler | soljson v0.1.1+commit.6ff4cd6, optimizer ON (0x7e05754c). Native cpp-ethereum 2d8e135 (2015-08-18), `--optimize 1` (all three) |
| Match | exact runtime and exact creation code |

Glofile was an early on-chain profile system for Ethereum accounts, described in the repo as a "Gravatar clone for Ethereum accounts". It stores a display name, location, colours, multilingual bios, and IPFS hashes for avatars and cover images. The deployer published one contract per development commit on Sep 22, 2015.

## Which compiler

All three runtimes carry the v0.1.1-era trailing STOP before the data section. The soljson v0.1.1 optimizer compiles commit 7e7bec2 exactly, but on 0424874 and dc79582 it throws an `OptimizerException` ("Expected arguments not present"). cpp-ethereum commit 2d8e135 (Aug 18, 2015), "Detect unavailable items and do not optimise the chunk in that case", fixed that crash before the STOP was dropped in v0.1.2. A native build of that commit reproduces all three deployments byte for byte.

Etherscan verification is only possible for `0x7e05754c`, because Etherscan runs soljson.

## Verify

```
node one.js soljson-v0.1.1+commit.6ff4cd6.js Glofile.sol 1 Glofile      # == runtime.hex
# native (docker solc-aug2015, monorepo worktree at 2d8e135, build per docker/BUILD-PRE-V011-COMPILER.md):
solc --optimize 1 --combined-json binary Glofile_0424874.sol
solc --optimize 1 --combined-json binary Glofile_dc79582.sol
```
