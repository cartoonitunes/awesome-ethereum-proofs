// Reconstruction of 0x1e918dddfaf23688efd884e60f0d13cf04b422c1
// Compiler: solc v0.1.1 (native C++ build), optimized
contract MessageStore {
    struct Message {
        uint64 timestamp;
        string content;
    }
    mapping(address => mapping(bytes32 => Message)) public messages;
    mapping(address => bytes32[]) public hashes;
    uint256 public nonce;

    function getMessageHashes() public returns (bytes32[]) {
        return hashes[msg.sender];
    }
    function getMessageTime(bytes32 key) public returns (uint64) {
        return messages[msg.sender][key].timestamp;
    }
    function getMessageContents(bytes32 key) public returns (string) {
        return messages[msg.sender][key].content;
    }
    function sendMessage(address recipient, string message) public {
        nonce = nonce + 1;
        var key = bytes32(nonce);
        messages[recipient][key].timestamp = 4;
        messages[recipient][key].content = message;
        hashes[recipient].length += 1;
        hashes[recipient][hashes[recipient].length - 1] = key;
    }
    function deleteMessage(bytes32 key) public {
        messages[msg.sender][key].timestamp = 0;
        delete messages[msg.sender][key].content;
        for (uint256 i = 0; i < hashes[msg.sender].length; i++) {
            if (hashes[msg.sender][i] == key) {
                hashes[msg.sender][i] = 0;
            }
        }
    }
}
