// Submitted by EthereumHistory (ethereumhistory.com)
contract LastIsMe {
    address owner;
    address public lastPlayer;
    uint public lastBlock;

    function MyBid() {
        owner = msg.sender;
        lastPlayer = msg.sender;
        lastBlock = block.number;
    }

    function() {
        uint fee;
        uint payout;
        if (this.balance > 0 && block.number - lastBlock > 200) {
            fee = this.balance / 100;
            payout = this.balance - fee;
            owner.send(fee);
            lastPlayer.send(payout);
        }
        if (msg.value >= 1 ether) {
            lastPlayer = msg.sender;
            lastBlock = block.number;
        }
    }
}
