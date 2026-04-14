contract CoinFlip {
    function () {
        var v = msg.value;
        var t = block.timestamp;
        if (t % 2 == 0) {
        } else {
            msg.sender.send(2 * v);
        }
    }
}
