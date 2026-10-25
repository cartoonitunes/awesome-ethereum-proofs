// Submitted by EthereumHistory (ethereumhistory.com)
contract LastIsMe {
    address owner;
    address public lastPlayer;
    uint public lastBlock;
    uint public blocks;
    uint public price;
    uint public totalWinnings;
    address[] public winners;
    uint[] public winnersPot;

    function LastIsMe() {
        owner = msg.sender;
        price = 1 ether;
        blocks = 200;
        totalWinnings = 0;
    }

    function elapsed() returns (uint) {
        return block.number - lastBlock;
    }

    function remaining() returns (uint) {
        var e = elapsed();
        if (blocks > e)
            return blocks - elapsed();
        else
            return 0;
    }

    function totalWinners() returns (uint) {
        return winners.length;
    }

    function() {
        uint pot = 0;
        uint fee;
        uint payout;
        if (this.balance > msg.value)
            pot = this.balance - msg.value;
        if (remaining() == 0 && lastPlayer > 0 && pot >= 100) {
            fee = pot / 100;
            payout = pot - fee;
            owner.send(fee);
            lastPlayer.send(payout);
            winners[winners.length++] = lastPlayer;
            winnersPot[winnersPot.length++] = payout;
            totalWinnings += payout;
        }
        if (msg.value >= price) {
            lastPlayer = msg.sender;
            lastBlock = block.number;
            if (msg.value > price)
                lastPlayer.send(msg.value - price);
        }
    }
}
