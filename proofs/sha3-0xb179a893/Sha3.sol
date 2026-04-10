contract Sha3 {
    function s(uint256 index) returns (bytes32) {
        return sha3(index);
    }
}
