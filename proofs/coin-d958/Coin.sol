contract Coin {
    mapping (address => uint) public coinBalanceOf;
    event CoinTransfer(address sender, address receiver, uint amount);

    function Coin(uint amount) {
        coinBalanceOf[msg.sender] = 1000000;
    }

    function sendCoin(address receiver, uint amount) returns(uint sufficient) {
        if (coinBalanceOf[msg.sender] < amount) return 0;
        coinBalanceOf[msg.sender] -= amount;
        coinBalanceOf[receiver] += amount;
        CoinTransfer(msg.sender, receiver, amount);
        return 1;
    }

    function balance(address addr) returns (uint) {
        return coinBalanceOf[msg.sender];
    }
}
