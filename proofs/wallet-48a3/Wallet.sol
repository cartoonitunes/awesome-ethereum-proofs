contract Wallet {
    address owner;

    event Deposit(address indexed _from, uint256 _value);

    function Wallet() {
        owner = msg.sender;
    }

    function() {
        Deposit(msg.sender, msg.value);
    }

    function kill() {
        if (msg.sender == owner) {
            suicide(owner);
        }
    }

    function collect() {
        if (msg.sender == owner) {
            owner.send(this.balance);
        }
    }
}
