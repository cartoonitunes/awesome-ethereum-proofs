contract PiggyBank {
    address owner;

    event Deposit(address indexed user, uint256 indexed id, uint256 amount);

    function PiggyBank() {
        owner = msg.sender;
    }

    function() {
        if (msg.value > 0) {
            Deposit(msg.sender, 88, msg.value);
        }
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
