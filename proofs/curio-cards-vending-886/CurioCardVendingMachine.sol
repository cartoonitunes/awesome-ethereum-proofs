// Submitted by EthereumHistory (ethereumhistory.com)
// Curio Cards 886-byte vending machine (2017). ABI/function names recovered from
// the original site JS (curiocards.github.io/js/vending.js). solc v0.4.11, optimizer OFF.
// Runtime executable code matches on-chain byte-for-byte across the whole 886B card
// family; the trailing bzzr0 metadata/swarm hash differs (original source-file text
// not recovered) -> classified near_exact_match.
pragma solidity ^0.4.0;

contract Token {
    function transferFrom(address from, address to, uint256 value) returns (bool);
}

contract CurioCardVendingMachine {
    address holdingAddress;
    uint public available;
    uint public amountRaised;
    uint public price;
    Token token;
    bool ended;

    function CurioCardVendingMachine(address _holdingAddress, address _token, uint256 _budget, uint256 _rate) {
        holdingAddress = _holdingAddress;
        token = Token(_token);
        available = _budget;
        price = _rate;
    }

    function() payable {
        if (ended) throw;
        uint amount = msg.value;
        uint numberOfCards = amount / price;
        amountRaised += amount;
        if (numberOfCards > available) throw;
        token.transferFrom(holdingAddress, msg.sender, numberOfCards);
        available -= numberOfCards;
    }

    function CloseVending() { ended = true; }

    function claimFunding() {
        if (!holdingAddress.send(amountRaised)) throw;
        amountRaised = 0;
    }
}
