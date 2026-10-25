# VerifySignature (0x4d2063e2): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0x4d2063e2be1b90269022e936fd9d4574336e526e` |
| Deployed | Nov 7, 2015 (block 506,217) |
| Deployer | `0x6f4250b4c1db1b611e43cbd9a04c4138c7c0af39` |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 1740 bytes, exact byte-for-byte match |
| Creation | exact match |
| Runtime SHA-256 | `b1fa3073a415a73cf973770f0be76179c0dc33a39fa7181d362ff35f967fd8c9` |
| Identical deployments | 1 (see `addresses.json`) |
| Etherscan | verified |

## Source

handwritten reconstruction; parseBytes32 adapted from the Oraclize parseAddr of the period; selector names parse2()/returnBytes(string) and event Log(byte[32]) recovered by dictionary search.

Contract name: stand-in: an earlier iteration of the deployer's signature-verification experiment, deployed in the hours before the same author published the final version as VerifySignature in github.com/bertani/poolicy (verifysignature.sol, 2015-11-08), which is byte-exact for 0xee82e544eabcafa92f0bffc2c7131bdd586807ff.

## Verify

```
node verify.js
```
