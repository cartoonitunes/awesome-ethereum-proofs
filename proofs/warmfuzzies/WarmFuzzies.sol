// Submitted by EthereumHistory (ethereumhistory.com)

contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _
    }
}

contract tokenRecipient { function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData); }

contract WarmFuzzies is owned {
    string public standard = "Token 0.1";
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    uint256 public buyPrice;

    mapping (address => uint256) public balanceOf;
    mapping (address => bool) public frozenAccount;
    mapping (address => mapping (address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event FrozenFunds(address target, bool frozen);

    function WarmFuzzies(
        uint256 initialSupply,
        string tokenName,
        uint8 decimalUnits,
        string tokenSymbol,
        uint256 initialPrice,
        address centralMinter
    ) {
        if (centralMinter != 0) owner = centralMinter;
        balanceOf[owner] = initialSupply;
        totalSupply = initialSupply;
        name = tokenName;
        symbol = tokenSymbol;
        decimals = decimalUnits;
        buyPrice = initialPrice;
    }

    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value) throw;
        if (balanceOf[_to] + _value < balanceOf[_to]) throw;
        if (frozenAccount[msg.sender]) throw;
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        Transfer(msg.sender, _to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        if (frozenAccount[_from]) throw;
        if (balanceOf[_from] < _value) throw;
        if (balanceOf[_to] + _value < balanceOf[_to]) throw;
        if (_value > allowance[_from][msg.sender]) throw;
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        Transfer(_from, _to, _value);
        return true;
    }

    function approveAndCall(address _spender, uint256 _value, bytes _extraData)
        returns (bool success) {
        if (allowance[msg.sender][_spender] == 0) {
            allowance[msg.sender][_spender] = _value;
        } else {
            if (allowance[msg.sender][_spender] + _value < allowance[msg.sender][_spender]) throw;
            allowance[msg.sender][_spender] += _value;
        }
        tokenRecipient spender = tokenRecipient(_spender);
        spender.receiveApproval(msg.sender, _value, this, _extraData);
        return true;
    }

    function buy() {
        if (msg.value < buyPrice) throw;
        uint amount = msg.value / buyPrice;
        uint cost = amount * buyPrice;
        uint refund = msg.value - cost;
        if (balanceOf[this] < amount) throw;
        if (balanceOf[msg.sender] + amount < balanceOf[msg.sender]) throw;
        balanceOf[msg.sender] += amount;
        balanceOf[this] -= amount;
        if (refund > 0) {
            if (refund < msg.value) {
                msg.sender.send(refund);
            }
        }
        Transfer(this, msg.sender, amount);
    }

    function mintToken(address target, uint256 mintedAmount) onlyOwner {
        if (balanceOf[target] + mintedAmount < balanceOf[target]) throw;
        if (totalSupply + mintedAmount < totalSupply) throw;
        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;
        Transfer(0, owner, mintedAmount);
        Transfer(owner, target, mintedAmount);
    }

    function freezeAccount(address target, bool freeze) onlyOwner {
        frozenAccount[target] = freeze;
        FrozenFunds(target, freeze);
    }

    function setPrice(uint256 _price) onlyOwner {
        buyPrice = _price;
    }

    function withdraw(uint256 amount) onlyOwner {
        if (this.balance < amount) {
            owner.send(this.balance);
        } else {
            owner.send(amount);
        }
    }

    function destroy() onlyOwner {
        suicide(owner);
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }

    function () {
        throw;
    }
}
