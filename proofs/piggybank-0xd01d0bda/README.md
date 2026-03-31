# PiggyBank Contract Verification

Bytecode verification proof for a simple ETH deposit/collect contract with per-instance event IDs.

## Contract

| Field | Value |
|-------|-------|
| Address | `0xd01d0bdaa0bdf2358ecfa278fe54eee8952f09fd` |
| Deployed | Feb 19, 2016 (block 1,026,739) |
| Compiler | soljson-v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Runtime | 543 bytes |
| Creation | 607 bytes (64 bytes init) |
| Runtime SHA-256 | `0ee1f2837600722396c810d0eaed253affa09e4fd1e4323e4b9fc2ef520fbe20` |
| Creation SHA-256 | `13b35653210ad3b09bc2078edb86f12d7bc145a683a0ec0d2374e7e86aa81ed0` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Copies

Multiple copies of this contract exist on-chain with different hardcoded instance IDs in the Deposit event. This instance uses ID 88.

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.1, compiles `PiggyBank.sol` with optimizer OFF, and compares the output byte-for-byte against the on-chain runtime and creation bytecode.

## Source

```solidity
contract PiggyBank {
    address owner;

    event Deposit(address indexed user, uint256 indexed id, uint256 amount);

    function PiggyBank() {
        owner = msg.sender;
    }

    function() {
        if (msg.value > 0) {
            Deposit(msg.sender, 88, msg.value);
        }
    }

    function kill() {
        if (msg.sender == owner) {
            suicide(owner);
        }
    }

    function collect() {
        if (msg.sender == owner) {
            owner.send(this.balance);
        }
    }
}
```
