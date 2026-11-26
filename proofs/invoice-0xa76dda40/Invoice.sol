contract Invoice {
    address owner;
    bool fundManagerSet;
    address fundManager;

    event IncomingTx(uint indexed blockNumber, address sender, uint value, uint timestamp);
    event RefundInvoice(address invoiceAddress, uint timestamp);

    function Invoice() {
        owner = msg.sender;
        fundManagerSet = false;
    }

    function() {
        IncomingTx(block.number, msg.sender, msg.value, now);
        if (fundManagerSet == true) {
            forwardFunds();
        } else {
            throw;
        }
    }

    function setFundManager(address _fundManager) {
        if (msg.sender == owner) {
            address fm = _fundManager;
            fundManager = fm;
            fundManagerSet = true;
        } else {
            throw;
        }
    }

    function getFundManager(address _fundManager) returns (address) {
        address fm = _fundManager;
        fundManager = fm;
        return fm;
    }

    function changeOwner(address _newOwner) {
        if (msg.sender == owner) {
            owner = _newOwner;
        } else {
            throw;
        }
    }

    function forwardFunds() {
        if (fundManagerSet == true) {
            fundManager.send(this.balance);
        } else {
            throw;
        }
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
