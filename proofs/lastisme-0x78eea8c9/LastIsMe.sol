// Submitted by EthereumHistory (ethereumhistory.com)
contract LastIsMe {
    address owner;
    address public lastPlayer;
    uint public lastBlock;

    function MyBid() {
        owner = 0x6f4250b4c1db1b611e43cbd9a04c4138c7c0af39;
        lastPlayer = 0;
        lastBlock = 0;
    }

    function() {
        uint fee;
        uint payout;
        if (block.number - lastBlock > 200 && lastBlock > 0 && lastPlayer > 0 && this.balance >= 1 ether) {
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
