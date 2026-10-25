# VerifySignature (0x2cbbf3f4): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0x2cbbf3f492215ecb7acf2172954b9f24b86174c0` |
| Deployed | Nov 7, 2015 (block 505,613) |
| Deployer | `0x6f4250b4c1db1b611e43cbd9a04c4138c7c0af39` |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 1500 bytes, exact byte-for-byte match |
| Creation | exact match |
| Runtime SHA-256 | `c9c8801295bf2c5d18aea4e3cca896e3aa1d138257d6f4e2109aa112b4d4ec2d` |
| Identical deployments | 2 (see `addresses.json`) |
| Etherscan | verified |

## Source

handwritten reconstruction; parseAddr from the Oraclize API of the period.

Contract name: stand-in: an earlier iteration of the deployer's signature-verification experiment, deployed in the hours before the same author published the final version as VerifySignature in github.com/bertani/poolicy (verifysignature.sol, 2015-11-08), which is byte-exact for 0xee82e544eabcafa92f0bffc2c7131bdd586807ff.

## Verify

```
node verify.js
```
