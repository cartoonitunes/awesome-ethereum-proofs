# Homestead ETH Forwarder (0xd8681c95) — Runtime Bytecode Proof

A minimal Homestead-era (March 2016) ETH-forwarding contract: fallback
receives ETH and immediately forwards `msg.value` to a hardcoded owner
address (stored in state slot 0), emitting a `Deposit(owner, value)` event
on success and reverting via `throw` on send failure.

Pre-metadata era (no Swarm/CBOR tail) — compile matches byte-for-byte
against the on-chain runtime.

| Field | Value |
|-------|-------|
| Address | `0xd8681c956d3a4c50fa491c4ede2bd9e0b8d29db0` |
| Deployed | March 21, 2016 (Homestead era) |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 150 bytes — **exact byte-for-byte match** |
| Runtime SHA-256 | `36ad6a0c46490762ec846550203d0d30ed936939e5c09a6a4449291b19cc377c` |
| Cluster | 805+ identical-runtime deployments |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/12) |

## Verify

```
node verify.js
```

Exit 0 = exact byte-for-byte match.

## Files

- `Forwarder.sol` — reconstructed source (EH attribution on line 1)
- `target_runtime.txt` — on-chain runtime bytecode
- `verify.js` — reproducible script
