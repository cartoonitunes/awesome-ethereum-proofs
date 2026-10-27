# StopLoss (Oraclize/ShapeShift, v1)

October 2015 Oraclize test that asks ShapeShift, through the oracle, for an ETH-to-BTC deposit address (0.2 ETH to `1AAcCo21EUc1jbocjssSQDzLna9Vem2UN5`) and parses the returned address in the callback. The constructor fires the query. The Oraclize address comes from resolver `0xda0181a763b533e532248f6ff859e564a470d9aa`, and the fee is paid with a plain `send` before `query(...)`. An early form of Oraclize's StopLoss example.

| Field | Value |
|-------|-------|
| Address | `0x9ce818b623b8bdd0083cdbdd2c2f1687e93b0607` |
| Deployed | Oct 24, 2015 (block 433,173) |
| Deployer | `0x0047a8033cc6d6ca2ed5044674fd421f44884de8` (the Oraclize operator account) |
| Deploy tx | `0xa55ed47e7c393dfe0067abc126863ccfa33aa1e856d5359e5468a842a903eb6b` |
| Compiler | soljson v0.1.6+commit.d41f8b7c (2015-10-16) |
| Optimizer | OFF |
| Runtime | 1,972 bytes |
| Creation | 2,979 bytes (no constructor arguments) |
| Runtime SHA-256 | `ba5f103edd68d62a0cdcb7d051894454974c1e97f141bec48efd6ca3e54033ea` |
| Creation SHA-256 | `2713940ca8ccf54d29e61a8a3df57259f8552edd36ebac21ca732dce6dc91b01` |
| Status | self-destructed; the proof is against the deploy transaction |
| Proved by | [@cartoonitunes](https://ethereumhistory.com/historian/cartoonitunes) |

## Verification

```bash
node verify.js
```

The script downloads `soljson-v0.1.6+commit.d41f8b7c`, compiles `StopLoss.sol` with the optimizer OFF, and checks both the runtime and the full creation code against the onchain bytes. Output ends with `VERIFIED: exact bytecode match`.

## Reconstruction

No source was published for this contract. The body follows Oraclize's later example (provable-things/ethereum-examples, first commit 2015-12-14), and the API layer was rebuilt from the bytecode: the Oraclize interface at the time had `query(uint256,string,string,string)` (later renamed `query2`), `getPrice(string)` and `cb_address()`. Contract names do not reach the bytecode, so the name is taken from the later example. The 0.1.5 nightlies from 2015-10-13 and the 0.1.6 nightlies of 2015-10-22/23 produce the same bytes.

## Files

- `StopLoss.sol`: reconstructed source
- `target_runtime.txt`, `target_creation.txt`: onchain runtime and deploy-transaction creation code
- `verify.js`: Node verification script
