# VerifySignature (0xdd5cecf3): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0xdd5cecf342f3022d22098e85aeb28c05c0227250` |
| Deployed | Nov 7, 2015 (block 505,600) |
| Deployer | `0x6f4250b4c1db1b611e43cbd9a04c4138c7c0af39` |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 1331 bytes, exact byte-for-byte match |
| Creation | exact match |
| Runtime SHA-256 | `e3fe3d6c7cd619c4436e22e9e23064e0dcc20f2ed9bbf6f6b62adbafc0fd31e4` |
| Identical deployments | 1 (see `addresses.json`) |
| Etherscan | verified |

## Source

handwritten reconstruction; parseAddr from the Oraclize API of the period.

Contract name: stand-in: an earlier iteration of the deployer's signature-verification experiment, deployed in the hours before the same author published the final version as VerifySignature in github.com/bertani/poolicy (verifysignature.sol, 2015-11-08), which is byte-exact for 0xee82e544eabcafa92f0bffc2c7131bdd586807ff.

## Verify

```
node verify.js
```
