contract Invoice {
    struct FundManager {
        address addr;
    }

    address owner;
    mapping (uint => FundManager) fundManagers;

    event IncomingTx(uint indexed blockNumber, address sender, uint value, uint timestamp);
    event RefundInvoice(address invoiceAddress, uint timestamp);

    function Invoice() {
        owner = msg.sender;
    }

    function() {
        IncomingTx(block.number, msg.sender, msg.value, now);
        forwardFunds();
    }

    function setFundManager(address _fundManager) {
        if (msg.sender == owner) {
            address fm = _fundManager;
            fundManagers[0] = FundManager(fm);
        } else {
            throw;
        }
    }

    function getFundManager(address _fundManager) returns (address) {
        if (msg.sender == owner) {
            return fundManagers[0].addr;
        } else {
            throw;
        }
    }

    function changeOwner(address _newOwner) {
        if (msg.sender == owner) {
            owner = _newOwner;
        } else {
            throw;
        }
    }

    function forwardFunds() {
        fundManagers[0].addr.send(this.balance);
    }

    function refund(address investor) {
        if (msg.sender == owner) {
            RefundInvoice(this, now);
            suicide(investor);
        } else {
            throw;
        }
    }
}
