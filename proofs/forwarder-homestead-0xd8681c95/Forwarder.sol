// Submitted by EthereumHistory (ethereumhistory.com)
contract Forwarder {
    address owner;
    event Deposit(address _to, uint _value);

    function () {
        if (owner.send(msg.value)) {
            Deposit(owner, msg.value);
        } else {
            throw;
        }
    }
}
