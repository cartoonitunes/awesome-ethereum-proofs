// Submitted by EthereumHistory (ethereumhistory.com)
contract Support {
    struct Supporter {
        address addr;
        uint amount;
    }
    address public fallback;
    address public recipient;
    uint public supportNeeded;
    uint public deadline;
    Supporter[] public supporters;
    uint public supportTotal;

    event Supported(address supporter, uint amount);

    function Support(address _fallback, address _recipient, uint _supportNeeded, uint _deadline) {
        fallback = _fallback;
        recipient = _recipient;
        supportNeeded = _supportNeeded;
        deadline = _deadline;
    }

    function release() {
        if (now >= deadline) {
            refund();
            suicide(fallback);
        }
    }

    function support() {
        if (msg.value > 0) {
            supporters[supporters.length++] = Supporter(msg.sender, msg.value);
            supportTotal += msg.value;
            Supported(msg.sender, msg.value);
            if (supportTotal >= supportNeeded) {
                refund();
                suicide(recipient);
            }
        }
    }

    function refund() internal {
        for (uint i = 0; i < supporters.length; i++) {
            Supporter s = supporters[i];
            s.addr.send(s.amount);
        }
    }
}

contract TimeLock {
    address public owner;
    address public recipient;
    uint public releaseTime;

    function TimeLock(address _owner, address _recipient, uint _releaseTime) {
        owner = _owner;
        recipient = _recipient;
        releaseTime = _releaseTime;
    }

    function release() {
        if (now >= releaseTime) {
            suicide(recipient);
        }
    }

    function cancel() {
        if (msg.sender == owner) {
            suicide(owner);
        }
    }

    function requestAnnihilation(uint deadline) returns (address) {
        if (msg.sender == owner) {
            address r = 0;
            address s = new Support(owner, r, this.balance, deadline);
            suicide(s);
            return s;
        }
    }
}

contract Bank {
    uint delay;
    mapping (address => uint) balances;

    function Bank(uint _delay) {
        delay = _delay;
    }

    function store(address addr) {
        balances[addr] += msg.value;
    }

    function transfer(address to, uint amount) returns (address) {
        address from = msg.sender;
        if (balances[from] < amount) return 0;
        address t = new TimeLock(from, to, now + delay);
        balances[from] -= amount;
        return t;
    }
}
