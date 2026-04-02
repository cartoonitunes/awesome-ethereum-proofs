# Multiply7 — Tutorial Contract

Bytecode verification proof for the classic Solidity `multiply(uint) * 7` tutorial contract from the ethereum.org documentation.

## Contract

| Field | Value |
|-------|-------|
| Canonical address | `0xfc3c994faebcbed3353ef552cb2058e21f90d3d6` |
| Deployer | `0x8D0b69cC5dE9cbB2d565C3Ec9Ff0cF5Adc1A2016` |
| First deployed | Sep 22, 2015 (very early Frontier) |
| Total copies | 120 identical deployments (Oct 2015–Feb 2016) |
| Compiler | soljson v0.1.3+ with optimizer ON (matches v0.1.3 through v0.2.1) |
| Runtime | 42 bytes |
| Runtime SHA-256 | `see verify.js output` |
| Deploy TX | `0x71c7fe80323d8f40c10068c2e9f13c13d6b8206d053f4abbb3476bcad3787767` |

## Notes

This is the hello-world of Solidity — the first example in the ethereum.org documentation. 120 copies were deployed by the same address, likely a tutorial platform or automated testing system.

## Verification

```bash
node verify.js
```
