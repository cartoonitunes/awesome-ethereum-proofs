# StringLib (Piper Merriam) — `0x4f830b11…` & `0xe6b35563…`

Byte-for-byte reproduction of **Piper Merriam's `StringLib`** string-utility library,
deployed twice (identical bytecode) from the Piper Merriam collection on the
Ethereum History archive.

**Both the runtime (248 bytes) and creation (265 bytes) bytecode reproduce byte-for-byte exactly.**

| Field | Value |
|-------|-------|
| Addresses | `0x4f830b115c86d93a1a4e324548ef80b0f2dd4c76` · `0xe6b35563dc56b5e3b390801a05702772cdb2340c` |
| Network | Ethereum Mainnet |
| Deployer | `0xd3cda913deb6f67967b99d67acdfa1712c293601` (Piper Merriam) |
| Deployed | 2015-10-21 (blocks 419,242 / 419,518) |
| Language | Solidity |
| Compiler | **soljson v0.1.5-nightly.2015.10.13+commit.e11e10f8**, optimizer **ON** |
| Runtime | 248 bytes — **EXACT match** |
| Creation | 265 bytes — **EXACT match** |

## How the compiler was pinned

Early solc (this era) prepends every **library** runtime with a `PUSH6 <version> POP`
version stamp emitted by `CompilerContext::injectVersionStampIntoSub`. The 6-byte value is
`binaryVersion()` = `[0, 0, minor, patch] ++ commitHash[0:4]`, big-endian-trimmed. On-chain
the two libraries begin with:

```
65 0105e11e10f8 50   →  PUSH6 0x0105e11e10f8 ; POP
```

which decodes to **v0.1.5, commit `e11e10f8`** — pinning the compiler to
`soljson-v0.1.5-nightly.2015.10.13+commit.e11e10f8` with **no guessing**. (For comparison,
Piper's separately-verified `StringLib` at `0xcca8353a` carries `0105 23865e39` = v0.1.5 release
commit `23865e39`.) The rest of the runtime is byte-identical to that verified StringLib; only the
6-byte compiler stamp differs.

## Source

Piper Merriam's `StringLib` / `StringUtils` (String Utils v0.1). The deployed contract is the
`StringLib` library — `uintToBytes(uint)` and `bytesToUInt(bytes32)`. See `StringLib.sol`.

## Reproduce

```bash
npm i solc@0.4.26
node verify.js      # compiles StringLib.sol and compares creation + runtime byte-for-byte
```

Targets: `target_creation.txt` (265 B, EH-preserved creation) and `target_runtime.txt`
(248 B, on-chain deployed runtime, `eth_getCode`).
