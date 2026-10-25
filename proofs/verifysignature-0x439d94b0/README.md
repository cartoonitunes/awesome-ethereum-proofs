# VerifySignature (0x439d94b0): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0x439d94b02a1c7cd458a198fc12126d522ebcf6db` |
| Deployed | Nov 7, 2015 (block 505,964) |
| Deployer | `0x6f4250b4c1db1b611e43cbd9a04c4138c7c0af39` |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 1350 bytes, exact byte-for-byte match |
| Creation | exact match |
| Runtime SHA-256 | `033f9c295c4b13a1d67f4cdb5d002c21848afcf82a740e80a8169a1c984c1993` |
| Identical deployments | 2 (see `addresses.json`) |
| Etherscan | verified |

## Source

handwritten reconstruction; parseBytes32 adapted from the Oraclize parseAddr of the period; selector names parse2()/returnBytes(string) and event Log(byte[32]) recovered by dictionary search.

Contract name: stand-in: an earlier iteration of the deployer's signature-verification experiment, deployed in the hours before the same author published the final version as VerifySignature in github.com/bertani/poolicy (verifysignature.sol, 2015-11-08), which is byte-exact for 0xee82e544eabcafa92f0bffc2c7131bdd586807ff.

## Verify

```
node verify.js
```
