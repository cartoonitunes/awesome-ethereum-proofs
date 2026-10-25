// Submitted by EthereumHistory (ethereumhistory.com)
contract LastIsMe {
    address owner;
    address public lastPlayer;
    uint public lastBlock;

    function LastIsMe() {
        owner = msg.sender;
    }

    function elapsed() returns (uint) {
        return block.number - lastBlock;
    }

    function() {
        uint pot = this.balance - msg.value;
        uint fee;
        uint payout;
        if (elapsed() > 10 && pot >= 1 ether && lastPlayer > 0 && lastBlock > 0) {
            fee = pot / 100;
            payout = pot - fee;
            owner.send(fee);
            lastPlayer.send(payout);
        }
        if (msg.value >= 1 ether) {
            lastPlayer = msg.sender;
            lastBlock = block.number;
        }
    }
}
