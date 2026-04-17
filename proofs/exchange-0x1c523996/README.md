# Exchange Contract Verification

Another deployment of the tutorial "Exchange" contract (owner-controlled custody with Deposit/Transfer/IcapTransfer events). Byte-identical creation bytecode to the sibling Exchange at 0x0fa64737.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x1c523996cb7cb5b0a4a48d8097e45093626b23f0` |
| Deployed | 12 Aug 2015 2015 (block 73529) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Runtime | 850 bytes |
| Creation | 914 bytes (64 init + 850 runtime) |
| Runtime SHA-256 | `df53633df94e7a8e7be5e232d308ea9676c5d687af5f0584275f66637f9e18e3` |
| Creation SHA-256 | `77e7364be31df097eef923db364bfafb58e27597a60b3243cd8315a61ed49105` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | fallback, `deposit(bytes32)`, `transfer(bytes32,address,uint256)`, `icapTransfer(...)` |
| Constructor args | none |
| Pattern | Owner-controlled custody contract with ICAP-style transfer events |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `Exchange.sol` with the optimizer OFF, and compares the compiled creation and runtime bytecode (byte-for-byte and SHA-256) against the target in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check.
