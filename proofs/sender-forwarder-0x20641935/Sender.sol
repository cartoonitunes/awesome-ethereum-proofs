// Submitted by EthereumHistory (ethereumhistory.com)
contract Sender {
    address public sender;

    function setSender(address _sender) {
        sender = _sender;
    }

    function () {
        sender.send(this.balance);
    }
}
