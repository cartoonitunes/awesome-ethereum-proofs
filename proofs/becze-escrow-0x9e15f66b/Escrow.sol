// Submitted by EthereumHistory (ethereumhistory.com)
// Time-locked two-party escrow deployed 2015-08-11 by Martin Becze (0xcd063b3081ea55535e5b60a21eff7f14e785a877).
// Block 69,444 — funded with 20 ETH. Compiler: soljson v0.1.1+commit.6ff4cd6, optimizer OFF.
contract Escrow {
    address owner;
    address recipient;
    uint releaseTime;
    function Escrow(address _recipient) {
        owner = msg.sender;
        recipient = _recipient;
        releaseTime = now + 432000;
    }
    function requestEther(uint amount) {
        if (msg.sender == owner && block.timestamp > releaseTime)
            owner.send(amount);
        if (msg.sender == recipient)
            owner.send(amount);
    }
}
