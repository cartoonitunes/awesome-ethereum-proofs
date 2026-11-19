# Wallet (ERC-223 tokenFallback) 0x850c3bea — Runtime Bytecode Proof

An owner-controlled multi-purpose wallet that accepts ETH via a payable
fallback, forwards ETH out via an owner-only `transfer(address, uint256)`,
sweeps ERC-20 tokens via `transferToken(address, address, uint256)`, allows
ownership handover via `changeOwner(address)`, and implements the ERC-223
`tokenFallback(address, uint256, bytes)` receiver so it can accept ERC-223
tokens without them being trapped.

Depends on `ERC20Basic` interface, `SafeMath` library, and `BasicToken` base
contract (used only for the `balanceOf` interface when sweeping tokens).

| Field | Value |
|-------|-------|
| Address | `0x850c3beae3766e3efcf76ade7cbd6e3e0aec517e` |
| Compiler | soljson-v0.4.15+commit.bbb8e64f |
| Optimizer | ON, runs=200 |
| Runtime | 870 bytes (836 code + 34 swarm metadata) |
| Match type | **Exact code match** (swarm metadata hash differs from source-formatting delta) |
| Cluster | 1,374+ identical-runtime deployments |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/12) |

## Verify

```
node verify.js
```

Exit 0 = compiled code portion matches on-chain runtime byte-for-byte;
only the trailing 34-byte swarm metadata differs.
