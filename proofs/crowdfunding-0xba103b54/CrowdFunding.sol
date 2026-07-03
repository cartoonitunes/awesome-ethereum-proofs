// Verified by EthereumHistory (ethereumhistory.com)
contract CrowdFunding {
    struct Funder { address addr; uint amount; }
    address beneficiary;
    uint goal;
    uint deadline;
    uint numRefunded;
    Funder[] funders;
    function contribute() {
        if (now > deadline) throw;
        funders.push(Funder(msg.sender, msg.value));
    }
    function refund() {
        if (now > deadline && this.balance < goal) {
            uint j = numRefunded;
            while (j < funders.length && msg.gas > 100000) {
                funders[j].addr.send(funders[j].amount);
                j++;
            }
            numRefunded = j;
        }
    }
    function payout() {
        if (now > deadline && this.balance >= goal)
            beneficiary.send(this.balance);
    }
}
