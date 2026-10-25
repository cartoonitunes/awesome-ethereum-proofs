# VerifySignature (0x8bd14148): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0x8bd14148477c23ede851e45af0aaf22e91d34177` |
| Deployed | Nov 7, 2015 (block 505,577) |
| Deployer | `0x6f4250b4c1db1b611e43cbd9a04c4138c7c0af39` |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 1212 bytes, exact byte-for-byte match |
| Creation | exact match |
| Runtime SHA-256 | `81c076d9cd344132b3cc699166aeb1dfb8317eb07c992ed46584d33cecc639fd` |
| Identical deployments | 1 (see `addresses.json`) |
| Etherscan | verified |

## Source

handwritten reconstruction; parseAddr from the Oraclize API of the period.

Contract name: stand-in: an earlier iteration of the deployer's signature-verification experiment, deployed in the hours before the same author published the final version as VerifySignature in github.com/bertani/poolicy (verifysignature.sol, 2015-11-08), which is byte-exact for 0xee82e544eabcafa92f0bffc2c7131bdd586807ff.

## Verify

```
node verify.js
```
