contract WeiFaucet {

    uint256 amount;
    mapping(address => uint256) lastAccess;
    uint256 cooldown;

    function WeiFaucet() {
        amount = 10000000000000000;
        cooldown = 5760;
    }

    function getWei() returns (bool) {
        if (lastAccess[msg.sender] < block.number - cooldown && address(this).balance > amount) {
            msg.sender.send(amount);
            lastAccess[msg.sender] = block.number;
            return true;
        } else {
            return false;
        }
    }

}
