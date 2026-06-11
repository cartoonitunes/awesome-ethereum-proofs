# token / Coin subcurrency (0x012a5642) - Runtime Bytecode Proof

The canonical **"Dapps for Beginners" subcurrency** from the early ethereum.org contract
tutorial - a minimal token with a `sendCoin` transfer, a public `coinBalanceOf` mapping,
and a `CoinTransfer` event. Deployed on Frontier, Aug 2015.

| Field | Value |
|-------|-------|
| Address | `0x012a5642306b0deb8d65f281d289998223dfb7c7` |
| Deployed | Aug 2015 (block 72085) |
| Deployer | `0xf070bcfed253b1ddd1989c2db18b5cd92df0bdc6` |
| Compiler (runtime) | soljson-v0.1.3+commit.028f561d |
| Optimizer | OFF |
| Runtime | 495 bytes - **exact byte-for-byte match** |
| Runtime SHA-256 | `7277c22283b2141a5595fd8092ed99578884f867e678842dc0bb0e9c1790bafa` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Scope

This proof establishes an **exact match of the on-chain runtime bytecode** (the code stored
at the contract address). The event topic `keccak("CoinTransfer(address,address,uint256)")`
= `16cdf17...926146` is present on-chain, confirming the event signature.

The **creation/constructor** bytecode is not reproduced here: the contract's constructor
applies a `supply != 0 ? supply : 10000` default whose ternary-style codegen is not emitted
by any soljson v0.1.x build (the `?:` operator only parses from v0.2.1, which changes the
runtime). The original was almost certainly compiled with a **native C++ Aug-2015 solc**
build; reproducing the creation byte-for-byte is left for a follow-up with that toolchain.

## Verify

```
node verify.js
```

Downloads `soljson-v0.1.3+commit.028f561d`, compiles `token.sol` (optimizer OFF), and checks
the compiled runtime equals `target_runtime.txt` byte for byte.

## Files

- `token.sol` - reconstructed source (canonical ethereum.org tutorial subcurrency)
- `target_runtime.txt` - on-chain runtime bytecode (eth_getCode)
- `target_creation.txt` - on-chain creation bytecode (deploy tx input, incl. 32-byte ctor arg = 100)
- `verify.js` - reproducible runtime verification script
