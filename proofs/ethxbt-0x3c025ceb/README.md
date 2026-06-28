# EthXbt (DEVCON1 Oraclize ticker) - Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x3c025ceb9fcf6e761f102c58a7f9c00aa9dd3142` |
| Deployed | November 19, 2015 (block 563655) |
| Deployer | `0x0047a8033cc6d6ca2ed5044674fd421f44884de8` |
| Deploy tx | `0xb1f265cd37979a4af69d3bf13363f7a4f1ff543042f0d3a0e224c947c1116c09` |
| Compiler | `soljson v0.1.6+commit.d41f8b7c` |
| Optimizer | ON |
| Runtime | 2,276 bytes |
| Creation | 3,822 bytes (1,546 init + 2,276 runtime payload, 0 constructor args) |
| Runtime SHA-256 | `77a4131967d4b179374fbf73fe5a167782d5cf1c38cefd5c60ef112ac02d3575` |
| Creation SHA-256 | `6ce714bd48f1a93b606c0c158a1d7940ad7b3f9c5e28187f9b162d4a478dd30c` |
| Byte match | exact (runtime + creation) |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Contract

EthXbt is an Oraclize-powered price feed that tracks the ETH/XBT (Ether against
Bitcoin) exchange rate. Its `update()` function asks the Oraclize service to fetch
the price from Kraken's public ticker API, using the `URL` data source and the JSON
query `json(https://api.kraken.com/0/public/Ticker?pair=ETHXBT).result.XETHXXBT.c.0`.
When Oraclize delivers the result, `__callback` stores the returned price string in
the public `ETHXBT` state variable and immediately schedules the next query with a
180 second delay, so the contract refreshes its price roughly every three minutes on
its own. A `kill()` function lets the deploying account selfdestruct the contract.

It was deployed on November 19, 2015, the week after DEVCON1, Ethereum's first
developer conference, held in London from November 9 to 13, 2015. Each query is paid
for with a promotional coupon code, `DEVCON1`, that Oraclize distributed so attendees
and developers could run oracle queries free of charge. The coupon string is embedded
in the bytecode and is applied through the Oraclize `useCoupon` mechanism before every
query. The constructor requests the TLSNotary plus IPFS proof type.

Off-chain delivery relies on the Oraclize service (later Provable). The contract
resolves the live Oraclize address at call time through the Oraclize Address Resolver
at `0x1d11e5eae3112dbd44f99266872ff1d07c77dce8`, the resolver Oraclize ran on mainnet
in this period. The contract is one of the earliest oracle-consuming contracts on
Ethereum mainnet, years before Chainlink and the DeFi era, and a direct artifact of
DEVCON1.

## Verification

Compile `EthXbt.sol` with soljson v0.1.6+commit.d41f8b7c, optimizer ON, and compare
the runtime against `target_runtime.txt` and the creation init prefix against the
on-chain creation bytecode. Both match byte-for-byte (the constructor takes no
arguments, so the on-chain creation has no trailing ABI-encoded args).

```bash
# soljson v0.1.6 via solc-js: compileJSON(source, 1)  // 1 = optimizer ON
# contract name "EthXbt"; compare bytecode (creation) and runtimeBytecode against the on-chain hex.
```

## Notes

- Source vintage matters: the December 2015 `oraclizeAPI` is the match. Its `oraclizeAPI`
  modifier declares a local `OraclizeAddrResolverI OAR` (an extra `PUSH1 0x00`), and the
  DEVCON1 coupon is applied via a `coupon(string)` modifier, not a function call.
- Storage slot order is `cb` (slot 1) before `string public ETHXBT` (slot 2); slot 0 is
  the Oraclize address. `kill()` uses `suicide(msg.sender)` (CALLER), not `suicide(cb)`.
- `update()` uses the 4-argument `oraclize_query` overload with timestamp 180 (the
  self-renewing delay), not 0.
- Function declaration order `__callback, kill, EthXbt, update` is required for an exact
  post-dispatch body layout (found via the permutation search).
- The constructor calls `oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS)` (0x11);
  omitting it leaves the creation code ~299 bytes short.

## Storage layout

| Slot | Type | Name |
|------|------|------|
| 0 | `OraclizeI` (address) | `oraclize` (from `usingOraclize`) |
| 1 | `address` | `cb` (owner, set in constructor) |
| 2 | `string` | `ETHXBT` (public; the last fetched price) |
