// Submitted by EthereumHistory (ethereumhistory.com)
contract LastIsMe {
    address owner;
    address public lastPlayer;
    uint public lastBlock;
    uint public blocks;
    uint public price;

    function LastIsMe() {
        owner = msg.sender;
        blocks = 200;
        price = 1 ether;
    }

    function elapsed() returns (uint) {
        return block.number - lastBlock;
    }

    function remaining() returns (uint) {
        return blocks - elapsed();
    }

    function() {
        uint pot = this.balance - msg.value;
        uint fee;
        uint payout;
        if (remaining() < 0 && pot >= price && lastPlayer > 0 && lastBlock > 0) {
            fee = pot / 100;
            payout = pot - fee;
            owner.send(fee);
            lastPlayer.send(payout);
        }
        uint refund = msg.value - price;
        if (refund >= 0) {
            lastPlayer = msg.sender;
            lastBlock = block.number;
            if (refund > 0) lastPlayer.send(refund);
        }
    }
}
