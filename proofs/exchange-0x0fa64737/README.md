# Exchange Contract Verification

A minimal owner-controlled exchange/custody contract with deposit, transfer, and ICAP transfer events. The owner can forward ETH to any address; anonymous sends emit an `AnonymousDeposit`.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x0fa647372d8535054f3a9c269f1c5d8299fd0bf6` |
| Deployed | 10 Aug 2015 2015 (block 65826) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Runtime | 850 bytes |
| Creation | 914 bytes (64 bytes init + 850 bytes runtime) |
| Runtime SHA-256 | `df53633df94e7a8e7be5e232d308ea9676c5d687af5f0584275f66637f9e18e3` |
| Creation SHA-256 | `77e7364be31df097eef923db364bfafb58e27597a60b3243cd8315a61ed49105` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | fallback (AnonymousDeposit), `deposit(bytes32)`, `transfer(bytes32,address,uint256)`, `icapTransfer(...)` |
| Constructor args | none |
| Pattern | Owner-controlled custody contract with Deposit/Transfer/IcapTransfer events |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `Exchange.sol` with the optimizer OFF, and compares the resulting creation and runtime bytecode (byte-for-byte and SHA-256) against the on-chain bytecode in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check.
