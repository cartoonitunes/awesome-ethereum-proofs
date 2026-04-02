# Greeter Contract Verification

Bytecode verification proof for a classic Greeter contract from the official Solidity tutorial, storing and returning the string "Hello World!".

## Contract

| Field | Value |
|-------|-------|
| Address | `0x7350d2a8ef53ccb81977bc078b98830121acd373` |
| Deployed | Jan 2, 2016 (block 785,230) |
| Compiler | soljson-v0.2.0+commit.4dc2445e |
| Optimizer | ON |
| Runtime | 366 bytes |
| Creation | 670 bytes (208 bytes init + 366 bytes runtime + 96 bytes constructor args) |
| Runtime SHA-256 | `29b9f310afd2cf020c41a47eecc7f865806d725c0b32c4a479864d2d082296a7` |
| Creation SHA-256 | `5d4584d8c1790ccf5226434a4c4c6cba72cbdf6812d55a4433693605481eb841` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Details

| Field | Value |
|-------|-------|
| Functions | `kill()`, `greet()` |
| Constructor arg | `"Hello World!"` |
| Pattern | mortal + greeter inheritance (official Solidity tutorial) |

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.2.0, compiles `Greeter.sol` with optimizer ON, and compares the output byte-for-byte against the on-chain runtime bytecode.

## Source

```solidity
contract mortal {
    address owner;
    function mortal() { owner = msg.sender; }
    function kill() { if (msg.sender == owner) suicide(owner); }
}

contract greeter is mortal {
    string greeting;
    function greeter(string _greeting) public {
        greeting = _greeting;
    }
    function greet() constant returns (string) {
        return greeting;
    }
}
```
