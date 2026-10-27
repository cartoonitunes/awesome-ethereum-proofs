# HashStore (0xf371377b) — Runtime Bytecode Proof

A trivial contract that stores a single `uint256` hash in storage slot 0
and exposes it via a `getHash()` view function. 151 bytes total (117 code
+ 34 swarm metadata).

| Field | Value |
|-------|-------|
| Address | `0xf371377b4c6c8433514d1df2a95c32ca172aaabe` |
| Compiler | soljson-v0.4.18+commit.9cf6e910 |
| Optimizer | ON, runs=200 |
| Runtime | 151 bytes |
| Match type | **Exact code match** (swarm metadata differs from source-formatting delta) |
| Cluster | 328+ identical-runtime deployments |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/12) |

## Verify

```
node verify.js
```

Exit 0 = code portion matches; only trailing swarm metadata differs.
