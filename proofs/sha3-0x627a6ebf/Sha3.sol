contract Sha3 {
    function sh(uint256 amount) returns (bytes32) {
        return sha3(amount);
    }
}
