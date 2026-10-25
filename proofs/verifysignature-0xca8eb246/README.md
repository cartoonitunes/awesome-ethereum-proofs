# VerifySignature (0xca8eb246): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0xca8eb2465bc1ec4bed43f35612a3cd79331090ef` |
| Deployed | Nov 7, 2015 (block 505,762) |
| Deployer | `0x6f4250b4c1db1b611e43cbd9a04c4138c7c0af39` |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 933 bytes, exact byte-for-byte match |
| Creation | exact match |
| Runtime SHA-256 | `8eaa7eb68453051ade59b66f3f0f1309179826ef31425f6c9c679380424a7e25` |
| Identical deployments | 3 (see `addresses.json`) |
| Etherscan | verified |

## Source

handwritten reconstruction; parseBytes adapted from the Oraclize parseAddr of the period; returnBytes(string) recovered by dictionary search.

Contract name: stand-in: an earlier iteration of the deployer's signature-verification experiment, deployed in the hours before the same author published the final version as VerifySignature in github.com/bertani/poolicy (verifysignature.sol, 2015-11-08), which is byte-exact for 0xee82e544eabcafa92f0bffc2c7131bdd586807ff.

## Verify

```
node verify.js
```
