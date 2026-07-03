// Verified by EthereumHistory (ethereumhistory.com)
contract CrowdFunding {
    struct Funder { address addr; uint amount; }
    Funder[] funders;
    uint goal;
    uint public deadline;
    address beneficiary;
    function fund() {
        funders.push(Funder(msg.sender, msg.value));
    }
    function refund() {
        if (now > deadline && this.balance < goal) {
            uint i = 0;
            while (i < funders.length) {
                funders[i].addr.send(funders[i].amount);
                i++;
            }
        }
    }
    function collect() {
        if (now > deadline && this.balance >= goal)
            beneficiary.send(this.balance);
    }
}
