contract MyToken {
    address public owner;
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    mapping (address => uint256) public balanceOf;
    mapping (address => bool) public frozenAccount;
    mapping (address => mapping (address => uint256)) public allowance;
    mapping (address => mapping (address => uint256)) public spentAllowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event FrozenFunds(address target, bool frozen);

    function MyToken(uint256 initialSupply, string tokenName, uint8 decimalUnits, string tokenSymbol, address centralMinter) {
        if(centralMinter != 0 ) owner = centralMinter;
        balanceOf[msg.sender] = initialSupply;
        totalSupply = initialSupply;
        name = tokenName;
        symbol = tokenSymbol;
        decimals = decimalUnits;
    }

    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value) throw;
        if (balanceOf[_to] + _value < balanceOf[_to]) throw;
        if (frozenAccount[msg.sender]) throw;
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        Transfer(msg.sender, _to, _value);
    }

    function approve(address _spender, uint256 _value) returns (bool success) {
        allowance[msg.sender][_spender] = _value;
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        if (balanceOf[_from] < _value) throw;
        if (balanceOf[_to] + _value < balanceOf[_to]) throw;
        if (frozenAccount[_from]) throw;
        if (spentAllowance[_from][msg.sender] + _value > allowance[_from][msg.sender]) throw;
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        spentAllowance[_from][msg.sender] += _value;
        Transfer(msg.sender, _to, _value);
        /* no explicit return true */
    }

    function mintToken(address target, uint256 mintedAmount) {
        if (msg.sender != owner) throw;
        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;
        Transfer(owner, target, mintedAmount);
    }

    function freezeAccount(address target, bool freeze) {
        if (msg.sender != owner) throw;
        frozenAccount[target] = freeze;
        FrozenFunds(target, freeze);
    }

    function transferOwnership(address newOwner) {
        if (msg.sender != owner) throw;
        owner = newOwner;
    }

    function() {
        owner.send(msg.value);
    }
}
