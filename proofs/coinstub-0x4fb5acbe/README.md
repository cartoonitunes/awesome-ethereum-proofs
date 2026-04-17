# CoinStub Contract Verification

A Frontier-era skeleton of the Ethereum "Coin" tutorial: a public `coinBalanceOf` mapping and an empty `sendCoin(address, uint256) returns (bool)` that always returns false. No constructor body, no transfer logic — likely a compilation/deployment test.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x4fb5acbe16ffdda225cb14c64aa84c7e253b08ae` |
| Deployed | August 8, 2015 (block 54126) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Runtime | 181 bytes |
| Creation | 200 bytes (19 bytes init + 181 bytes runtime) |
| Runtime SHA-256 | `3d8708e762410420c6422c16bf9d3a9e11a739cf3d5ab3d179f2f99946da3fc2` |
| Creation SHA-256 | `3f5dc8ad6c180db35f9761ac05e8b608508f18951dd451703cb8eba496963295` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | `coinBalanceOf(address)` (auto-getter), `sendCoin(address,uint256)` |
| Constructor args | none |
| Pattern | Coin tutorial stub — mapping getter + empty function returning default bool |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `CoinStub.sol` with the optimizer OFF, and compares the resulting creation and runtime bytecode (byte-for-byte and SHA-256) against the on-chain bytecode in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check.

## Notes on the source

Two code generation quirks were needed to match exactly:

1. **Named return variable** `returns (bool r)` with an empty body. This produces a compact `PUSH 0 / JUMPDEST / SWAP3 SWAP2 POP POP JUMP` epilogue — 7 bytes shorter than an explicit `return false`.
2. **Explicit empty constructor** `function C() {}`. This emits the `5b5b` (two JUMPDESTs) in the creation header, 2 bytes more than omitting the constructor entirely. The original has these bytes.

## Source

```solidity
contract C {

    mapping(address => uint256) public coinBalanceOf;

    function C() {
    }

    function sendCoin(address to, uint256 amount) returns (bool r) {
    }

}
```
