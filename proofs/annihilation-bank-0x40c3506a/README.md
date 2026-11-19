# Annihilation Bank (0x40c3506a, 0x480d57db): Bytecode Proof

| Field | Value |
|-------|-------|
| Addresses | `0x40C3506A8446bb5D806FE0030d451142c8044f77` (Bank.sol), `0x480D57DbF6C3b49916b9325E2C5Ed92401c54efC` (BankPublic.sol) |
| Deployed | Sep 13, 2015 |
| Deployer | `0x147013436BD5C7DeF49a8E27c7FBA8AC2b9dFe1F` |
| Compiler | soljson v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Runtime | 3099 / 3229 bytes, exact byte-for-byte match |
| Creation | exact match, constructor argument `delay = 60` |
| Runtime SHA-256 | `dee413c7893d9f15dd3afe3646d9bfd262b72a2657009b7d884a68e86e9b481d` / `b77582b381e3af8ea596f33bfe01297c107f70cd06a02216a35281400923a1af` |

## What it is

Three contracts in one deployment:

- `Bank`: `store(address)` credits sent ETH to an address; `transfer(address,uint)` debits the sender and deploys a `TimeLock` for the recipient that releases after `delay` seconds.
- `TimeLock`: the recipient can `release()` after `releaseTime`; the owner can `cancel()` before. The owner can also call `requestAnnihilation(uint deadline)`, which moves the locked balance into a new `Support` contract.
- `Support`: a crowd-support campaign whose goal is the locked balance and whose recipient is address 0. If supporters match the goal before the deadline, every supporter is refunded and the locked funds are burned. Otherwise `release()` returns them to the owner.

## Source reconstruction

No original source is known. It was rebuilt from the bytecode. Recovered names:

- `0fe65b36` = `requestAnnihilation(uint256)`, found by dictionary brute force. It matches the burn-to-address-0 semantics above.
- `c9e7e29b` = `supportNeeded()`
- event `8fc4de83…` = `Supported(address,uint256)`
- `27e235e3` = `balances(address)` and `6a42b8f8` = `delay()`. These are public only in the `0x480d57db` deployment.

Contract, parameter and local names are not in the bytecode.

## Verify

```
node one.js soljson-v0.1.1+commit.6ff4cd6.js Bank.sol 0 Bank         # == runtime.hex
node one.js soljson-v0.1.1+commit.6ff4cd6.js BankPublic.sol 0 Bank   # == runtime_public.hex
```
