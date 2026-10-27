// Submitted by EthereumHistory (ethereumhistory.com)
pragma solidity ^0.4.0;

contract ERC20 {
    function transfer(address to, uint256 value) public returns (bool);
}

contract Escrow {
    address owner;         // slot 0
    address refundAddr;    // slot 1
    address benefAddr;     // slot 2
    address unused3;       // slot 3
    uint256 amount;        // slot 4
    address unused5;       // slot 5
    address token;         // slot 6

    function withdraw() public {
        require(msg.sender == owner);
        ERC20(token).transfer(benefAddr, amount);
    }

    function refund() public {
        require(msg.sender == owner);
        ERC20(token).transfer(refundAddr, amount);
    }
}
