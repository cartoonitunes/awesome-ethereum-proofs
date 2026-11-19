# Escrow (withdraw/refund) 0x68322340 — Runtime Bytecode Proof

A simple owner-controlled ERC-20 escrow: two owner-only functions,
`withdraw()` and `refund()`, each pushing a fixed amount of a specific
ERC-20 token to a specific recipient stored in state. `withdraw()` sends
to the beneficiary; `refund()` sends to the refund recipient.

The 552-byte runtime is 518 code bytes plus 34 bytes of standard
Swarm/CBOR metadata. Compiling with `soljson-v0.4.24+commit.e67f0147`,
optimizer ON, `runs=200`, produces **byte-for-byte identical code**;
only the swarm metadata hash differs because the exact source formatting
is not preserved. Etherscan tolerates a source submission with this
formatting-only swarm delta.

| Field | Value |
|-------|-------|
| Address | `0x68322340ff01215643b0615ba1980a10a9db5c57` |
| Deployed | Nov 10, 2018 |
| Compiler | soljson-v0.4.24+commit.e67f0147 |
| Optimizer | ON, runs=200 |
| Runtime | 552 bytes (518 code + 34 swarm metadata) |
| Match type | **Exact code match** (swarm metadata hash differs from source-formatting delta) |
| Cluster | 4,463+ identical-runtime deployments |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/12) |

## Verify

```
node verify.js
```

Exit 0 = the compiled code portion matches the on-chain runtime byte-for-byte;
only the trailing swarm metadata hash differs.

## Files

- `Escrow.sol` — reconstructed source (attribution line at top does not
  affect bytecode)
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `verify.js` — reproducible script that downloads the compiler and
  asserts code-only match
