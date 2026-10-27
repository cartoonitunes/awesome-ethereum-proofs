// Submitted by EthereumHistory (ethereumhistory.com)
pragma solidity ^0.4.0;

contract Forwarder {
    address dest;

    function Forwarder(address _dest) public {
        dest = _dest;
    }

    function () payable {
        dest.transfer(msg.value);
    }
}
