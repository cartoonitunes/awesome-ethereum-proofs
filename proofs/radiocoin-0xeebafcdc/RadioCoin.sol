// Submitted by EthereumHistory (ethereumhistory.com)
contract RadioCoin {
    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value) throw;
        if (balanceOf[_to] + _value < balanceOf[_to]) throw;
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        Transfer(msg.sender, _to, _value);
    }

    string public name;
    string public symbol;
    uint8 public decimals;
    mapping (address => uint256) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint256 value);

    function MyToken(uint256 initialSupply, string tokenName, string tokenSymbol, uint8 decimalUnits) {
        if (initialSupply == 0) initialSupply = 1000000;
        balanceOf[msg.sender] = initialSupply;
        name = "RadioCoin";
        symbol = "📡";
        decimals = 0;
    }
}
