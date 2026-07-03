// Verified by EthereumHistory (ethereumhistory.com)
contract Split {
    function split(address a, address b) payable {
        a.send(msg.value / 2);
        b.send(msg.value / 2);
    }
}
