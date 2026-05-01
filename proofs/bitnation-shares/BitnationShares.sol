// Submitted by EthereumHistory (ethereumhistory.com)
contract tokenRecipient {
    function sendApproval(address _to, uint256 _value, address _token);
}

contract BitnationShares {
    event Transfer(address indexed from, address indexed to, uint256 value);

    function BitnationShares(uint256 initialSupply, string tokenName, uint8 decimalUnits, string tokenSymbol) {
        balanceOf[msg.sender] = initialSupply;
        name = tokenName;
        symbol = tokenSymbol;
        decimals = decimalUnits;
    }

    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value) throw;
        if (balanceOf[_to] + _value < balanceOf[_to]) throw;
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        Transfer(msg.sender, _to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        if (balanceOf[_from] < _value) throw;
        if (balanceOf[_to] + _value < balanceOf[_to]) throw;
        if (spentAllowance[_from][msg.sender] + _value > allowance[_from][msg.sender]) throw;
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        spentAllowance[_from][msg.sender] += _value;
        Transfer(msg.sender, _to, _value);
    }

    function approve(address _spender, uint256 _value) returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        tokenRecipient spender = tokenRecipient(_spender);
        spender.sendApproval(msg.sender, _value, this);
    }

    function () {
        throw;
    }

    string public name;
    string public symbol;
    uint8 public decimals;
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint)) public allowance;
    mapping (address => mapping (address => uint)) public spentAllowance;
}
