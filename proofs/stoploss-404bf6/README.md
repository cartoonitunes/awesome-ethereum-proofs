# StopLoss (Oraclize/ShapeShift, v2)

Later the same day: the same ShapeShift deposit-address request, now behind a resolver address held in storage (`0x1d11e5eae3112dbd44f99266872ff1d07c77dce8`, the address Oraclize's December 2015 API used) and with an empty constructor, so the query is sent by calling `update()`.

| Field | Value |
|-------|-------|
| Address | `0x404bf6720abc894aff4ba13c83dda240ef651e40` |
| Deployed | Oct 24, 2015 (block 433,797) |
| Deployer | `0x0047a8033cc6d6ca2ed5044674fd421f44884de8` (the Oraclize operator account) |
| Deploy tx | `0x3396b73ef5f64aca323f77bb1e79bc19a3e60080aadd43cc6f2687cf745261a0` |
| Compiler | soljson v0.1.6+commit.d41f8b7c (2015-10-16) |
| Optimizer | OFF |
| Runtime | 1,972 bytes |
| Creation | 2,238 bytes (no constructor arguments) |
| Runtime SHA-256 | `812ab7a98139e37b8992d67850599ed4f42c502ab776d7f79052d7033c58e688` |
| Creation SHA-256 | `136ffb685c380c036932d887640be51da98ffdb0d9e969b94bc7852d2ff7ae8d` |
| Status | live; verified on Etherscan and Sourcify |
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
