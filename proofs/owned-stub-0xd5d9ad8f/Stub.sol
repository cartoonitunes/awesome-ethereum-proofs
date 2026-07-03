// Submitted by EthereumHistory (ethereumhistory.com)
// Minimal owner-recording stub deployed 2016-01-02 06:48:39 UTC (block 908,565) by
// Hudson Jameson (0x80d63799b1e08a80f73fb7a83264b5c31600bf3a), 89 seconds before his
// Marriage Registry (0x58641c…). Runtime is the 6-byte empty body 0x606060405200;
// the constructor records the deployer. Compiler: soljson v0.1.5+commit.23865e39, optimizer ON.
contract Stub {
    address owner;
    function Stub() {
        owner = msg.sender;
    }
}
