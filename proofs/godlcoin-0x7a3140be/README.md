# Godlcoin (GOD) Contract Verification

Bytecode verification proof for a token contract based on the ethereum.org advanced token tutorial with mint, freeze, and transfer functionality.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x7a3140be78649bc8a9cf4a116c8bb3023a7d2449` |
| Deployed | Feb 28, 2016 (block 1,074,263) |
| Compiler | soljson-v0.1.7+commit.b4e666cc |
| Optimizer | ON |
| Runtime | 1093 bytes |
| Creation | 1870 bytes (1582 bytes init + 288 bytes constructor args) |
| Runtime SHA-256 | `6c9ca7f60225038b2801bf86470ccb9875cad359f41581e42d81f6cac76bc912` |
| Creation SHA-256 | `00627899866b4b5a052b5347b25164002d19ccda21c819674dff99b9a53756c3` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Token Details

| Field | Value |
|-------|-------|
| Name | Godlcoin |
| Symbol | GOD |
| Decimals | 0 |
| Initial Supply | 1,000,000 |

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.7, compiles `Godlcoin.sol` with optimizer ON, and compares the output byte-for-byte against the on-chain runtime and creation bytecode.

## Source

```solidity
contract Godlcoin {
    string public name;
    string public symbol;
    uint8 public decimals;
    address public issuer;
    mapping (address => uint256) public balanceOf;
    mapping (address => bool) public frozenAccount;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event FrozenFunds(address target, bool frozen);

    function Godlcoin(uint256 initialSupply, string tokenName, uint8 decimalUnits, string tokenSymbol, address centralMinter) {
        if (initialSupply == 0) initialSupply = 1000000;
        if (centralMinter == 0) centralMinter = msg.sender;
        issuer = centralMinter;
        balanceOf[centralMinter] = initialSupply;
        name = tokenName;
        symbol = tokenSymbol;
        decimals = decimalUnits;
    }

    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value || balanceOf[_to] + _value < balanceOf[_to] || frozenAccount[msg.sender]) throw;
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        Transfer(msg.sender, _to, _value);
    }

    function mintToken(address target, uint256 mintedAmount) {
        if (msg.sender != issuer) throw;
        balanceOf[target] += mintedAmount;
        Transfer(0, target, mintedAmount);
    }

    function freezeAccount(address target, bool freeze) {
        if (msg.sender != issuer) throw;
        frozenAccount[target] = freeze;
        FrozenFunds(target, freeze);
    }
}
```
