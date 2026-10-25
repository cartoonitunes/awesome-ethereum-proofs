# VerifySignature (0x5c773f07): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0x5c773f071bcd7ed1ff06229d1c9293921ab41c2d` |
| Deployed | Nov 7, 2015 (block 505,641) |
| Deployer | `0x6f4250b4c1db1b611e43cbd9a04c4138c7c0af39` |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 1592 bytes, exact byte-for-byte match |
| Creation | exact match |
| Runtime SHA-256 | `0c6baf3908664ed81775483c4b9fb5b49f60247a07ea89e309f1289f3add2659` |
| Identical deployments | 1 (see `addresses.json`) |
| Etherscan | verified |

## Source

handwritten reconstruction; parseAddr from the Oraclize API of the period.

Contract name: stand-in: an earlier iteration of the deployer's signature-verification experiment, deployed in the hours before the same author published the final version as VerifySignature in github.com/bertani/poolicy (verifysignature.sol, 2015-11-08), which is byte-exact for 0xee82e544eabcafa92f0bffc2c7131bdd586807ff.

## Verify

```
node verify.js
```
