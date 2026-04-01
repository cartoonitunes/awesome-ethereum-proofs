# Wallet — 0x48A3 Deposit/Collect Contract

Bytecode verification proof for a simple Ethereum wallet contract: deposit ETH via fallback, owner calls `collect()` to drain it.

## Contract

| Field | Value |
|-------|-------|
| Canonical address | `0x986058b63c1d3ed610b7ca4cb9cd869a6767da20` |
| Deployer | `0x48a33958A96276E41c11e1359a9989BbaDfDb74A` |
| Deployed | Feb 8, 2016 (all 50 copies deployed 05:28–05:29 UTC) |
| Total copies | 50 |
| Compiler | soljson v0.1.3+commit.028f561d (optimizer OFF) |
| Runtime | 531 bytes |
| Runtime SHA-256 | `bbd1f639cd29974895a5005efb2f03a7e18eced89769a8586ce0287d4e373cea` |
| Deploy TX | `0xb1ba867fb98d05f1d1faf3b0cf190901d2ee0afb77eb48e84addfc627e862327` |

## How it works

- Any ETH sent to the contract emits `Deposit(address indexed _from, uint256 _value)` 
- Owner calls `collect()` to send the full balance to themselves
- Owner calls `kill()` to selfdestruct

All 50 copies were deployed within 61 seconds on Feb 8, 2016 — likely a scripted deployment. The same deployer sent 70 ETH to the NameRegistry contract (`0xa1a111bc`) on Aug 14, 2015, placing them among the earliest Ethereum participants.

## Verification

```bash
node verify.js
```

Downloads soljson v0.1.3, compiles `Wallet.sol` with optimizer OFF, compares runtime against `target_runtime.txt` byte-for-byte.
