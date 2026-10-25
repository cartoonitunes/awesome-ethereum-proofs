# VerifySignature (0xe967be51): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0xe967be515ceb9ca52b18abfef5f12bf43e8f3253` |
| Deployed | Nov 7, 2015 (block 505,627) |
| Deployer | `0x6f4250b4c1db1b611e43cbd9a04c4138c7c0af39` |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 1499 bytes, exact byte-for-byte match |
| Creation | exact match |
| Runtime SHA-256 | `6cbbbecf0acb4c8c2749d7fea0fa7e4b0b78f621b4a3317dc8ca5c6fae27d388` |
| Identical deployments | 2 (see `addresses.json`) |
| Etherscan | verified |

## Source

handwritten reconstruction; parseAddr from the Oraclize API of the period.

Contract name: stand-in: an earlier iteration of the deployer's signature-verification experiment, deployed in the hours before the same author published the final version as VerifySignature in github.com/bertani/poolicy (verifysignature.sol, 2015-11-08), which is byte-exact for 0xee82e544eabcafa92f0bffc2c7131bdd586807ff.

## Verify

```
node verify.js
```
