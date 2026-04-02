contract Random {
    uint blockNumber = block.number;
    bytes32 randomValue = block.blockhash(blockNumber);

    function rand(uint256 min, uint256 max) returns (bytes32) {
        return randomValue;
    }
}
