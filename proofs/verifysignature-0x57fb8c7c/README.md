# VerifySignature (0x57fb8c7c): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0x57fb8c7c69524ab6cceb9416daff84310b6f5ed7` |
| Deployed | Nov 7, 2015 (block 505,509) |
| Deployer | `0x6f4250b4c1db1b611e43cbd9a04c4138c7c0af39` |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 1147 bytes, exact byte-for-byte match |
| Creation | exact match |
| Runtime SHA-256 | `a0eb2c70c379374446d7d0e7f38d2e9e53372a35b60519c1aace501bf2099da7` |
| Identical deployments | 2 (see `addresses.json`) |
| Etherscan | verified |

## Source

handwritten reconstruction; parseAddr from the Oraclize API of the period.

Contract name: stand-in: an earlier iteration of the deployer's signature-verification experiment, deployed in the hours before the same author published the final version as VerifySignature in github.com/bertani/poolicy (verifysignature.sol, 2015-11-08), which is byte-exact for 0xee82e544eabcafa92f0bffc2c7131bdd586807ff.

## Verify

```
node verify.js
```
