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
