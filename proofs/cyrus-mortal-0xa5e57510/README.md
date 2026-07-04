# mortal (Cyrus Adkisson) — `0xa5e57510…` & `0x63989aae…`

Byte-for-byte reproduction of the canonical **`mortal`** contract (owner-set-in-constructor +
owner-gated `kill()` / `suicide`), deployed twice (identical bytecode) by **Cyrus Adkisson**.

**The creation bytecode (126 bytes) reproduces byte-for-byte exactly.**

| Field | Value |
|-------|-------|
| Addresses | `0xa5e57510a8e38931b13cf7e1885b587f0117eef1` · `0x63989aaec3c6ae6d29c9673cea430322a8ac2cfa` |
| Network | Ethereum Mainnet |
| Deployer | `0xcf684dfb8304729355b58315e8019b1aa2ad1bac` (Cyrus Adkisson) |
| Deployed | 2015-10-17 (blocks 398,248 / 398,262) |
| Language | Solidity |
| Compiler | **solc v0.1.x**, optimizer **ON** |
| Creation | 126 bytes — **EXACT match** |
| Runtime | 92 bytes (self-destructed on-chain; see below) |

## Notes

`mortal` is the textbook self-destructing base contract. Both deployments have since had
`kill()` called, so `eth_getCode` now returns empty — the Ethereum History archive preserves the
historical **creation** bytecode, which this proof reproduces exactly (init sets `owner = msg.sender`
then returns the 92-byte runtime).

Because these contracts are **not libraries**, the bytecode carries no compiler version stamp, and
the `mortal` codegen is **identical across solc v0.1.2 – v0.3.6** (optimizer ON). The v0.1.1 release
emits 127 bytes (one byte longer), so the compiler is **v0.1.2 or later**; the 2015-10-17 deploy
date places it in the **v0.1.4 / v0.1.5** window. `verify.js` uses `v0.1.5+commit.23865e39` as a
representative; any version in that range yields the identical 126-byte creation code.

## Source

See `mortal.sol` — the canonical Solidity `mortal` pattern.

## Reproduce

```bash
npm i solc@0.4.26
node verify.js      # compiles mortal.sol and compares creation byte-for-byte
```

Target: `target_creation.txt` (126 B, EH-preserved creation bytecode).
