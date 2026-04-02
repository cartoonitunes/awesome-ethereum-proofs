# Store Contract Verification

Bytecode verification proof for a simple key-value store contract.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x62149267d120ac6f6a6f7bb317f9d77a5c3512fc` |
| Deployed | Dec 15, 2015 (block 691,754) |
| Compiler | soljson v0.1.6 (optimizer ON) |
| Runtime | 107 bytes |
| Creation | 123 bytes (16 init + 107 runtime, no constructor args) |
| Runtime SHA-256 | `70f9ea62ff8d19e17dc53e8a3101fbf60c4696c04794b8aefee35ea5a25657a3` |
| Creation SHA-256 | `2b5146c8c9cb11de7f72fb83aff04f88e30729197ba41d928812e2ce27ebd484` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Status

The contract was selfdestructed (killed) by the deployer. Creation bytecode is verified from the deploy transaction.

## Verification

```bash
node verify.js
```

The script downloads soljson v0.1.6, compiles `Store.sol` with optimizer ON, and compares the output byte-for-byte against the on-chain creation bytecode.

## Source

```solidity
contract Store {
    uint8 value;
    function set(uint8 v) { value = v; }
    function kill() { suicide(msg.sender); }
    function get() returns (uint8) { return value; }
}
```
