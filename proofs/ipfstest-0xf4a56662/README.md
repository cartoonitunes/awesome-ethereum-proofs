## Contract

| Field | Value |
|-------|-------|
| Address | `0xf4a56662f39664a19a73a48ff4ef8cdebd90bc6f` |
| Deployed | Feb 5, 2016 (block 958,095) |
| Compiler | soljson-v0.2.0+commit.4dc2445e |
| Optimizer | ON |
| Runtime | 279 bytes |
| Creation | 517 bytes (238 bytes init) |
| Runtime SHA-256 | `34c52ed85701b2eda6e1b6bc1bd1930dbd3a15cc8ddeca3ea39018517330a23b` |
| Creation SHA-256 | `3fffaf14fea153c6ffb9a4a03e5f318752bba3f636b545027019b10fd39b04ab` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Notes

A single-variable contract storing one IPFS CIDv0 hash (`Qmd8ijSKemAE1NX2CbFcBP8wbtTweb4uqKKrd7aJe7bDN1`) as a public string. The `x()` auto-generated getter is the only external function.

Deployed by `0x0047A8033CC6d6Ca2ED5044674Fd421F44884dE8` (Thomas Bertani / Oraclize team), who had been actively experimenting with the Ethereum contract format since Sept 2015. A byte-for-byte identical sibling was deployed 6 blocks later at `0x4b26dcf0981355c8b1f8190f116945322a62a96a`, suggesting a scripted redeploy rather than a unique instance.

The content at the referenced CID is no longer retrievable on the IPFS network (no providers as of 2026), which is consistent with a throwaway prototype pin from the frontier era.

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.2.0, compiles `IPFSTest.sol` with optimizer ON, and compares the output byte-for-byte against the on-chain creation and runtime bytecode.
