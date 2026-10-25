# OraclizeAddrResolver (Oraclize, v2)

The corrected resolver, deployed 37 minutes after [`0xda0181a7`](../oraclizeaddrresolver-da0181/): `getAddress()` now returns the stored address. The logic is the same as the resolver Oraclize deployed 90 minutes later at `0x1d11e5eae3112dbd44f99266872ff1d07c77dce8`, but the state variables are declared after the functions, so the compiled function bodies come in a different order. It still points to `0x3a0aeee3d335fc256ef70626faf66f5e43605254`.

| Field | Value |
|-------|-------|
| Address | `0x3ae1631cf21fa7000ae72dd2f5daca8ed49b3529` |
| Deployed | Oct 24, 2015 (block 433,213) |
| Deployer | `0x0047a8033cc6d6ca2ed5044674fd421f44884de8` (the Oraclize operator account) |
| Deploy tx | `0xd3f6bdc4ea7f85830422540e49145c7f42ba856c8a420e9e1e02472177ab865f` |
| Compiler | soljson v0.1.6+commit.d41f8b7c (2015-10-16) |
| Optimizer | OFF |
| Runtime | 441 bytes |
| Creation | 504 bytes (no constructor arguments) |
| Runtime SHA-256 | `6ae3307201c56ff023a0ec95b3b333d18e137a427dad2250beaad330db72ace2` |
| Creation SHA-256 | `5bc633c544a94786195798d85b9b2d909e1726fe13988067d8c2ba40aba32964` |
| Status | live; verified on Etherscan and Sourcify |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/cartoonitunes) |

## Verification

```bash
node verify.js
```

The script downloads `soljson-v0.1.6+commit.d41f8b7c`, compiles `OraclizeAddrResolver.sol` with the optimizer OFF, and checks both the runtime and the full creation code against the onchain bytes. Output ends with `VERIFIED: exact bytecode match`.

## Reconstruction

Starting from the published `OraclizeAddrResolver` source, which compiles exactly to `0x1d11e5ea` with v0.1.6, the only change needed is the declaration order: constructor, `setAddr`, `getAddress`, then `addr` and `owner`. Contract names do not reach the bytecode; the name is taken from the later source.

## Files

- `OraclizeAddrResolver.sol`: reconstructed source
- `target_runtime.txt`, `target_creation.txt`: onchain runtime and deploy-transaction creation code
- `verify.js`: Node verification script
