// Submitted by EthereumHistory (ethereumhistory.com)
contract VerifySignature {
    address owner;

    function VerifySignature() {
        owner = msg.sender;
    }

    function kill() {
        if (msg.sender == owner) suicide(msg.sender);
    }

    function verify(bytes a, bytes b, bytes c) {
    }
}
