contract DepositWalletV2 {
    address owner;
    function DepositWalletV2() { owner = msg.sender; }
    event Deposit(address indexed from, uint256 value);
    function() { Deposit(msg.sender, msg.value); }
    function kill() { if (msg.sender == owner) suicide(owner); }
    function collect() { if (msg.sender == owner) owner.send(this.balance); }
}
