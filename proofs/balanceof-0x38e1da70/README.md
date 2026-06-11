# balanceOf token (0x38e1da70) — Runtime + Creation Bytecode Proof

A minimal Homestead-era token shell: a single public `balanceOf` mapping
(`mapping(address => uint) public balanceOf;`) and nothing else. The public
mapping auto-generates the `balanceOf(address)` getter (selector `0x70a08231`),
which is the only entry in the dispatch table. Deployed the day Homestead
launched, Mar 14 2016.

| Field | Value |
|-------|-------|
| Address | `0x38e1da7063094fcca07c11d071372918f741a81a` |
| Deployed | Mar 14, 2016 (block 1149190) |
| Deployer | `0xc0d4b32728acc42b8a610b2a87c867b3ba3810db` |
| Compiler | soljson-v0.1.3+commit.028f561d |
| Optimizer | ON |
| Runtime | 59 bytes — **exact byte-for-byte match** |
| Creation | 75 bytes — **exact byte-for-byte match** |
| Runtime SHA-256 | `19fe48530f862f3f61aeec7ddba8c3bed669185ca79347380e96fcce75db93fa` |
| Creation SHA-256 | `0ea860a8b8d64f52b615aed78cccacc7c452f63544022fcbee075337e668b1db` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Scope

This proof establishes an **exact match of both the on-chain creation and runtime
bytecode**. Compiling `token.sol` with soljson-v0.1.3 (optimizer ON) reproduces
the deploy-tx input (75 bytes) and the stored runtime (59 bytes) byte for byte.

The contract has no functions of its own — only the compiler-generated getter for
the public `balanceOf` mapping. There are no events (zero LOG opcodes) and no
constructor arguments.

soljson-v0.1.4 (optimizer ON) also reproduces both, as expected for adjacent
v0.1.x patch releases; v0.1.3 is the canonical match given the Mar 2016 deploy
date.

## Verify

```
node verify.js
```

Downloads `soljson-v0.1.3+commit.028f561d`, compiles `token.sol` (optimizer ON),
and checks the compiled runtime **and** creation bytecode equal
`target_runtime.txt` / `target_creation.txt` byte for byte.

## Files

- `token.sol` — reconstructed source
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy-tx input)
- `verify.js` — reproducible runtime + creation verification script
