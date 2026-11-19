# Fixed-Destination ETH Sweeper (0xeb15f63a) — Runtime Bytecode Proof

A minimal Solidity ETH sweeper: a payable fallback that immediately transfers
the contract's entire ETH balance to a single hardcoded destination address
(`0xd293a88c7ef49dad48b58bdf87a426ffaab338d4`). No owner check, no other
functions — everything the contract does is in the fallback.

The contract's runtime is 136 bytes total, of which 102 bytes are code and
the trailing 34 bytes are the standard Swarm/CBOR metadata hash. Compiled
with `soljson-v0.4.15+commit.bbb8e64f`, optimizer ON, `runs=200`, the
reconstructed source produces the **byte-for-byte identical code**; only
the swarm metadata differs because the exact source's whitespace/comments
are not preserved. Etherscan tolerates a source submission with this
formatting-only swarm delta.

| Field | Value |
|-------|-------|
| Address | `0xeb15f63aaeed4c5d8f2197832d7c1240f76cb3e1` |
| Deployed | Jan 23, 2018 (block 4,958,359) |
| Deployer | `0x4dcee5d5cbcd37cacb262290d40bec3bf61d07ec` |
| Sweep destination | `0xd293a88c7ef49dad48b58bdf87a426ffaab338d4` (hardcoded in bytecode) |
| Compiler | soljson-v0.4.15+commit.bbb8e64f |
| Optimizer | ON, runs=200 |
| Runtime | 136 bytes total (102 code + 34 swarm metadata) |
| Match type | **Exact code match** (swarm metadata hash differs from source-formatting differences) |
| Cluster | ~1,900 identical-runtime deployments, all sweeping to the same destination |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/12) |

## Verify

```
node verify.js
```

Exit 0 = the compiled code portion matches the on-chain runtime byte-for-byte;
only the trailing swarm metadata hash differs.

## Files

- `Sweeper.sol` — reconstructed source (attribution line at top does not
  affect bytecode)
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `verify.js` — reproducible script that downloads the compiler and
  asserts code-only match
