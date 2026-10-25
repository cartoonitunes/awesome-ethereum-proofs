# VerifySignature (0x2609883a): Bytecode Proof

| Field | Value |
|-------|-------|
| Address | `0x2609883a9080a8149eaea995b8163e6e2d3e426f` |
| Deployed | Nov 7, 2015 (block 505,660) |
| Deployer | `0x6f4250b4c1db1b611e43cbd9a04c4138c7c0af39` |
| Compiler | soljson-v0.1.6+commit.d41f8b7c |
| Optimizer | ON |
| Runtime | 1779 bytes, exact byte-for-byte match |
| Creation | exact match |
| Runtime SHA-256 | `3546729c942fce8bcfc952b6ab87f5a96118129e55021f5ac6fedfae7517d69c` |
| Identical deployments | 1 (see `addresses.json`) |
| Etherscan | verified |

## Source

handwritten reconstruction; parseAddr from the Oraclize API of the period; selectors returnstrlength()/strlength(string) recovered by dictionary search.

Contract name: stand-in: an earlier iteration of the deployer's signature-verification experiment, deployed in the hours before the same author published the final version as VerifySignature in github.com/bertani/poolicy (verifysignature.sol, 2015-11-08), which is byte-exact for 0xee82e544eabcafa92f0bffc2c7131bdd586807ff.

## Verify

```
node verify.js
```
