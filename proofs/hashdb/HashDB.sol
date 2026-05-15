// Submitted by EthereumHistory (ethereumhistory.com)

contract tokenRecipient { function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData); }

contract HashDB {
    address owner;
    address public frontend;
    string public standard = "Token 0.1";
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    uint256 public sellPrice;
    uint256 public buyPrice;

    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);

    function HashDB(
        string tokenName,
        uint8 decimalUnits,
        string tokenSymbol,
        uint256 _sellPrice,
        uint256 _buyPrice
    ) {
        owner = msg.sender;
        name = tokenName;
        symbol = tokenSymbol;
        decimals = decimalUnits;
        sellPrice = _sellPrice;
        buyPrice = _buyPrice;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _
    }

    function setOwner(address _newOwner) onlyOwner {
        owner = _newOwner;
    }

    function setFrontend(address _address) onlyOwner {
        frontend = _address;
    }

    function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyOwner {
        if (totalSupply > 0) {
            if (newSellPrice > sellPrice) throw;
            if (newSellPrice > newBuyPrice) throw;
        }
        sellPrice = newSellPrice;
        buyPrice = newBuyPrice;
    }

    function buy() {
        uint amount = msg.value / buyPrice;
        uint refund = msg.value - amount * sellPrice;
        if (!owner.call.value(refund)()) throw;
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        Transfer(this, msg.sender, amount);
    }


    function sell(uint amount) {
        if (balanceOf[msg.sender] < amount) throw;
        if (totalSupply - amount > totalSupply) throw;
        balanceOf[msg.sender] -= amount;
        if (!msg.sender.call.value(amount * sellPrice)()) throw;
        Transfer(msg.sender, this, amount);
    }

    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value) throw;
        if (_value + balanceOf[_to] < balanceOf[_to]) throw;
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        Transfer(msg.sender, _to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool) {
        if (balanceOf[_from] < _value) throw;
        if (_value + balanceOf[_to] < balanceOf[_to]) throw;
        if (msg.sender != frontend && msg.sender != owner) {
            if (_value > allowance[_from][msg.sender]) throw;
            allowance[_from][msg.sender] -= _value;
        }
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        Transfer(_from, _to, _value);
        return true;
    }

    function approveAndCall(address _spender, uint256 _value, bytes _extraData) returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        tokenRecipient(_spender).receiveApproval(msg.sender, _value, this, _extraData);
        return true;
    }

    function () {
        throw;
    }
}
