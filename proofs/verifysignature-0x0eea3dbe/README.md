# VerifySignature (0x0eea3dbe): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0x0eea3dbe387b7950122231c998ef5c99a5f3cb31` |
| Deployed | Nov 7, 2015 (block 505,972) |
| Deployer | `0x6f4250b4c1db1b611e43cbd9a04c4138c7c0af39` |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 1338 bytes, exact byte-for-byte match |
| Creation | exact match |
| Runtime SHA-256 | `1e54e5b5abb5ccf50311a1b3867349d887118b483e84019a746044766486cb1f` |
| Identical deployments | 1 (see `addresses.json`) |
| Etherscan | verified |

## Source

handwritten reconstruction; parseBytes32 adapted from the Oraclize parseAddr of the period; selector names parse2()/returnBytes(string) and event Log(byte[32]) recovered by dictionary search.

Contract name: stand-in: an earlier iteration of the deployer's signature-verification experiment, deployed in the hours before the same author published the final version as VerifySignature in github.com/bertani/poolicy (verifysignature.sol, 2015-11-08), which is byte-exact for 0xee82e544eabcafa92f0bffc2c7131bdd586807ff.

## Verify

```
node verify.js
```
