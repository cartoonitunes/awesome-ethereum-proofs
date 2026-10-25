// Submitted by EthereumHistory (ethereumhistory.com)
contract TimeLock {
    mapping (address => mapping (uint => uint)) deposits;

    event Locked(address indexed owner, uint until, uint value);
    event Withdrew(address indexed owner, uint until, uint value);

    function lockUntil(uint until) returns (bool) {
        if (until > now) {
            deposits[msg.sender][until] += msg.value;
            Locked(msg.sender, until, msg.value);
            return true;
        } else {
            msg.sender.send(msg.value);
            return false;
        }
    }

    function withdrawAtTimestamp(uint until) returns (bool) {
        if (now >= until && deposits[msg.sender][until] > 0) {
            msg.sender.send(deposits[msg.sender][until]);
            deposits[msg.sender][until] = 0;
            Withdrew(msg.sender, until, deposits[msg.sender][until]);
            return true;
        } else {
            return false;
        }
    }
}
