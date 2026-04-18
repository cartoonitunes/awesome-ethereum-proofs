contract Pool {
    event log(uint256);

    address constant admin = 0x3c94923400ccc528e8ab0f849edafca06fe332e5;
    mapping(address => uint) public balances;

    function register(string a, string b, string c, uint d) returns (uint) {
        if (balances[msg.sender] > 0) return;
        log(11);
        balances[msg.sender] = 5 * msg.value;
        log(12);
    }

    function get() returns (uint) {
        return balances[msg.sender];
    }

    function finalize(address beneficiary, uint fixPoolSupply) {
        if (admin != msg.sender) return;
        if (fixPoolSupply > 0) {
            beneficiary.send(5 * balances[beneficiary]);
        }
        balances[beneficiary] = 0;
    }
}
