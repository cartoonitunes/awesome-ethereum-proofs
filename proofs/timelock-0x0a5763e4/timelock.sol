contract Scheduler {
    function scheduleCall(uint targetBlock) returns (address);
}

contract Timelock {
    address public beneficiary;
    uint public releaseBlock;

    function Timelock(address b, uint r, Scheduler s) {
        beneficiary = b;
        releaseBlock = r;
        s.scheduleCall.value(2 ether)(r);
    }

    function releaseFunds() {
        if (this.balance == 0 || block.number < releaseBlock) return;
        beneficiary.send(this.balance);
    }

    function () {
        releaseFunds();
    }
}
