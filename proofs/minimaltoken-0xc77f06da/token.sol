contract token {
    mapping (address => uint256) public balanceOf;
    event Transfer(address indexed from, address indexed to, uint256 value);
    function token(uint256 initialSupply) {
        balanceOf[msg.sender] = initialSupply;
    }
    function transfer(address _to, uint256 _value) {
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        Transfer(msg.sender, _to, _value);
    }
}
