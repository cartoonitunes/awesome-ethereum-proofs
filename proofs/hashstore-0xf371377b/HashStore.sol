// Submitted by EthereumHistory (ethereumhistory.com)
pragma solidity ^0.4.0;

contract HashStore {
    uint256 hash;

    function getHash() constant returns (uint256) {
        return hash;
    }
}
