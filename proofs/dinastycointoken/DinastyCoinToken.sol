contract DinastyCoinToken {
    mapping (address => uint256) public balanceOf;
    string public name;
    string public symbol;
    uint8 public decimals;

    event Transfer(address indexed from, address indexed to, uint256 value);

    function DinastyCoinToken(uint256 initialSupply, string tokenName, uint8 decimalUnits, string tokenSymbol) {
        if (initialSupply == 0) initialSupply = 1000000;
        balanceOf[msg.sender] = initialSupply;
        name = tokenName;
        symbol = tokenSymbol;
        decimals = decimalUnits;
    }

    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value || balanceOf[_to] + _value < balanceOf[_to]) throw;
        Transfer(msg.sender, _to, _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
    }
}
