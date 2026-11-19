# PriceTicker (Oraclize ETH/BTC ticker)

October 2015 Oraclize price ticker: stores the Kraken ETH/XBT price in a public string, refreshed by the oracle callback every 60 seconds. It predates Oraclize's December 2015 API rewrite: the Oraclize connector address is hardcoded in storage and the callback is authenticated with the connector's `cb_address()`.

| Field | Value |
|-------|-------|
| Address | `0x29599b97021154edee168420a5c64e818ee5660b` |
| Deployed | Oct 23, 2015 (block 428,496) |
| Deployer | `0x0047a8033cc6d6ca2ed5044674fd421f44884de8` (the Oraclize operator account) |
| Deploy tx | `0x44ce689ede7f50fd2474214ca9b92a8e98a07c1364a192357952964570db7186` |
| Compiler | soljson v0.1.6+commit.d41f8b7c (2015-10-16) |
| Optimizer | OFF |
| Runtime | 1,261 bytes |
| Creation | 1,936 bytes (no constructor arguments) |
| Runtime SHA-256 | `e1f95c1ce5505a2a2915ad89284fa255e3534e7193bd459e7db5e8fbd15b1cd8` |
| Creation SHA-256 | `b53b16b9ed6496f0926ab8fa7099c1a1c139228976f2d0534a0c4627b131327d` |
| Status | live; verified on Etherscan |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/cartoonitunes) |

## Verification

```bash
node verify.js
```

The script downloads `soljson-v0.1.6+commit.d41f8b7c`, compiles `PriceTicker.sol` with the optimizer OFF, and checks both the runtime and the full creation code against the onchain bytes. Output ends with `VERIFIED: exact bytecode match`.

## Reconstruction

No source was published for this contract. The body follows Oraclize's later example (provable-things/ethereum-examples, first commit 2015-12-14), and the API layer was rebuilt from the bytecode: the Oraclize interface at the time had `query(uint256,string,string,string)` (later renamed `query2`), `getPrice(string)` and `cb_address()`. Contract names do not reach the bytecode, so the name is taken from the later example. The 0.1.5 nightlies from 2015-10-13 and the 0.1.6 nightlies of 2015-10-22/23 produce the same bytes.

## Files

- `PriceTicker.sol`: reconstructed source
- `target_runtime.txt`, `target_creation.txt`: onchain runtime and deploy-transaction creation code
- `verify.js`: Node verification script
