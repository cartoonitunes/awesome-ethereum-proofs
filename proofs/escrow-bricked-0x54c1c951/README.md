# Escrow, bricked variant (0x54c1c951)

| Field | Value |
|-------|-------|
| Address | `0x54c1c951e5781d5bdd107fe0f49b07d9fa345629` |
| Deployed | May 17, 2017 |
| Deployer | Vitalik Buterin (`0x1db3439a22ee7c4d034e9b26437d3960b5af0517`) |
| Compiler | solc 0.4.11 (optimizer ON) |
| Runtime | 355 bytes |
| Verification | `Near-exact bytecode match (swarm hash differs)` |

An optimized build of the two-party Escrow (buyer / seller / arbitrator; `finalize()` pays the
seller, `refund()` pays the buyer). The access guard is written with a **buggy `||`** instead of
`&&`:

```solidity
if (msg.sender != buyer || msg.sender != arbitrator) throw;
```

Since no single caller can equal both `buyer` and `arbitrator` at once, `(sender != buyer || sender
!= arbitrator)` is **always true**, so both functions always `throw`. The contract is effectively
bricked — any funds sent to it can never be released. This exact operator choice is what reproduces
the target's `EQ ISZERO DUP1 … EQ ISZERO` short-circuit codegen (the `&&` form comes out 2 bytes
longer).

## Verification

```bash
solc-select use 0.4.11
solc --optimize --bin-runtime Escrow.sol
```

The executable body reproduces byte-for-byte; only the trailing swarm metadata hash differs.

- runtime sha256 `b1e345aaecdee9afa5ddc48f57dbc700faafcbbf16250c0a35791825bfd65442`
