contract SimpleAuction {
    address public beneficiary;
    uint public auctionStart;
    uint public biddingTime;
    address public highestBidder;
    uint public highestBid;
    bool ended;
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    function SimpleAuction(uint _biddingTime, address _beneficiary) {
        beneficiary = _beneficiary;
        auctionStart = now;
        biddingTime = _biddingTime;
    }
    function() { throw; }
    function bid() {
        if (now > auctionStart + biddingTime) throw;
        if (msg.value <= highestBid) throw;
        if (highestBidder != 0)
            highestBidder.send(highestBid);
        highestBidder = msg.sender;
        highestBid = msg.value;
        HighestBidIncreased(msg.sender, msg.value);
    }
    function auctionEnd() {
        if (ended) throw;
        AuctionEnded(highestBidder, highestBid);
        beneficiary.send(this.balance);
        ended = true;
    }
}
