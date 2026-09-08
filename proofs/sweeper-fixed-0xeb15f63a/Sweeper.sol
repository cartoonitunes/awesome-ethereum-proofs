// Submitted by EthereumHistory (ethereumhistory.com)
pragma solidity ^0.4.0;

contract Sweeper {
    function () payable {
        address(0xd293a88c7ef49dad48b58bdf87a426ffaab338d4).transfer(this.balance);
    }
}
