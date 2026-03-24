# Logger Contract Verification

Bytecode verification proof for the Logger contract deployed on Ethereum mainnet.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x7b6556b40a5a4d40118387495314f4445986239c` |
| Deployed | Oct 1, 2015 (block 319,519) |
| Deployer | `0xfd2605a2bf58fdbb90db1da55df61628b47f9e8c` |
| Compiler | soljson-v0.1.2+commit.d0d36e3 |
| Optimizer | OFF |
| Runtime | 131 bytes |
| Creation | 147 bytes |
| Runtime SHA-256 | `c74b94ab5e1ef26ae7b17e44996cc005ddeb0ca95d11c01b82be96c106e637c1` |
| Creation SHA-256 | `97ddf8b10672c77afbd8e8b8961f85e8d3c474dafd1a2e0ee4f6763eceb1d99b` |

## Verification

```bash
npm install  # no dependencies needed
node verify.js
```

The script downloads soljson-v0.1.2, compiles `Logger.sol` with optimizer OFF, and compares the output byte-for-byte against the on-chain runtime bytecode.

## Source

A single-function contract that emits a `MyEvent(uint256)` event. One of the simplest possible Solidity contracts from the Frontier era.

```solidity
contract Logger {
    event MyEvent(uint256 value);
    function log(uint256 value) {
        MyEvent(value);
    }
}
```
