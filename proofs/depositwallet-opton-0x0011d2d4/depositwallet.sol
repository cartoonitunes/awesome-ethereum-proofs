contract DepositWallet {
    address owner;
    function DepositWallet() { owner = msg.sender; }
    event Deposit(address indexed from, uint256 value, uint256 indexed data);
    function() { if (msg.value > 0) Deposit(msg.sender, msg.value, 88); }
    function kill() { if (msg.sender == owner) suicide(owner); }
    function collect() { if (msg.sender == owner) owner.send(this.balance); }
}
