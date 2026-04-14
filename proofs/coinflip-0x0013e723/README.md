# CoinFlip Contract Verification

A tiny Frontier-era "double or nothing" contract: on each call, if `block.timestamp` is odd, it sends back twice the sent value; otherwise it keeps the ether.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x0013e723f574bafd47cc1542532cdcd98c1c2989` |
| Deployed | August 8, 2015 (block 55847) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 (also matches native solc-0.1.0-056180fb2) |
| Optimizer | ON |
| Runtime | 80 bytes |
| Creation | 97 bytes (17 bytes init + 80 bytes runtime) |
| Runtime SHA-256 | `75d089df4e711b997b96d8b0d3393cd73dd7a3a04b364e09f28b4f147d9c7532` |
| Creation SHA-256 | `a72680d1ae7e35030c221f48b09e28a2a1dac36e8e725e727289dace18b0adcf` |
| Proved by | [@gpersoon](https://www.ethereumhistory.com/historian/169) |

## Details

| Field | Value |
|-------|-------|
| Functions | fallback only |
| Constructor args | none |
| Pattern | Timestamp-parity coinflip; payout is `2 * msg.value` via `send` |

## Verification

    node verify.js

Downloads soljson v0.1.1, compiles `CoinFlip.sol` with the optimizer ON, and compares the resulting creation and runtime bytecode (byte-for-byte and SHA-256) against the on-chain bytecode in `target_runtime.txt`. Optionally fetches the deployment transaction from Etherscan for an additional on-chain check.

## Notes on the source

The decompiled source expresses the logic as `if (t % 2 != 0) { send(...) }`, but the optimizer's output for that shape is a shorter `EQ+JUMPI` pattern. The original bytecode uses the longer `EQ+ISZERO+JUMPI` + explicit else-jump pattern, which 0.1.1 only emits for an explicit `if/else` form — hence the inverted condition with an empty `if` branch. `msg.value` and `block.timestamp` are also lifted into local vars so the compiler pushes them once and `DUP`s later, matching the original stack layout.

## Source

```solidity
contract CoinFlip {
    function () {
        var v = msg.value;
        var t = block.timestamp;
        if (t % 2 == 0) {
        } else {
            msg.sender.send(2 * v);
        }
    }
}
```
