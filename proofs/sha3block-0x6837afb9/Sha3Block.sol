// Reconstructed source for 0x6837afb9e9fc1a908f9ce54756d3dba55a87ea27
// Compiler: solc 0.1.0 (no optimization)
// Match: 100% bytecode match against creation_bytecode.bin

contract C {
    function sha(uint256 amount) returns (bytes32 r) {
        r = sha3(block.blockhash(amount));
    }
}
