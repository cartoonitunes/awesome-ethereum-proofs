# Escrow (0x3d1570c8)

| Field | Value |
|-------|-------|
| Address | `0x3d1570c8d4f9cd75265a603c057abd55af6c4aec` |
| Deployed | Mar 31, 2017 |
| Deployer | Vitalik Buterin (`0x1db3439a22ee7c4d034e9b26437d3960b5af0517`) |
| Compiler | solc 0.4.10 (optimizer OFF) |
| Runtime | 734 bytes |
| Verification | `Near-exact bytecode match (swarm hash differs)` |

The two-party escrow with arbitrator (buyer / seller / arbitrator). `finalize()` (callable by buyer
or arbitrator) releases the balance to the seller; `refund()` (callable by seller or arbitrator)
returns it to the buyer. Functionally identical to the verified Escrow at
[`0x139a5a08`](https://www.ethereumhistory.com/contract/0x139a5a0812bfc9b3d9234c9fd2d8c5d790f71e18);
this build uses storage order buyer/seller/arbitrator and a newer compiler (0.4.10), which is why
its runtime is larger and carries a swarm metadata trailer.

## Verification

```bash
solc-select use 0.4.10
solc --bin-runtime Escrow.sol
```

The executable body reproduces byte-for-byte; only the trailing swarm metadata hash differs.

- runtime sha256 `4fa8ca20d18ccb13e594b6329f047d32c52e33065e36db8ba4d8d37e4f2256df`
