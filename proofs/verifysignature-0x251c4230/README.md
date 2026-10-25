# VerifySignature (0x251c4230): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0x251c4230387aebd6785d489c99392ff7b97c4620` |
| Deployed | Nov 7, 2015 (block 505,950) |
| Deployer | `0x6f4250b4c1db1b611e43cbd9a04c4138c7c0af39` |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 1287 bytes, exact byte-for-byte match |
| Creation | exact match |
| Runtime SHA-256 | `983de85a9a6562dc5b1cba1e6c8c5c9b3f34439ab71e8572aa7ab52da0ea916d` |
| Identical deployments | 1 (see `addresses.json`) |
| Etherscan | verified |

## Source

handwritten reconstruction; parseBytes32 adapted from the Oraclize parseAddr of the period; selector names parse2()/returnBytes(string) and event Log(byte[32]) recovered by dictionary search.

Contract name: stand-in: an earlier iteration of the deployer's signature-verification experiment, deployed in the hours before the same author published the final version as VerifySignature in github.com/bertani/poolicy (verifysignature.sol, 2015-11-08), which is byte-exact for 0xee82e544eabcafa92f0bffc2c7131bdd586807ff.

## Verify

```
node verify.js
```
