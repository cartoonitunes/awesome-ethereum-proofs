// Compiler: solc 0.1.0 (all 0.1.0 builds match, no optimization)
// Exact match: true
contract C {
    function kill(address account) {
        suicide(account);
    }

    function multiply2(uint256 amount) returns (uint256) {
        return amount * 2;
    }
}
