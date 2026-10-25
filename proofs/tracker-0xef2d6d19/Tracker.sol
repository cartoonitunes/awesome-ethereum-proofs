// Submitted by EthereumHistory (ethereumhistory.com)
contract Tracker {
    address public operator;
    string public basePath;
    mapping(uint => Bounty) bounties;
    mapping(uint => bool) public bountyAvailable;
    mapping(address => bool) public isReviewer;

    // addReviewer adds a reviewer to the list of reviewers. This can only
    // be done from the operator account.
    function addReviewer(address reviewer) {
        if( msg.sender != operator || isReviewer[reviewer]) return;
        isReviewer[reviewer] = true;
    }

    // removeReviewer removes a reviewer from the list of reviewers.
    function removeReviewer(address reviewer) {
        if( msg.sender != operator || isReviewer[reviewer]) return;
        delete isReviewer[reviewer];
    }
    
    // Claim is an object assigned to bounties whenever a user
    // submits a bounty claim.
    struct Claim {
        // progress indicator
        bool inProgress;
        // owner of the claim
        address owner;
        // the initial claim deposit
        uint deposit;
        // reviewers of the claim
        address[2] reviewers;
        // review count
        uint ri;
    }
    
    // Bounty is a bounty submission
    struct Bounty {
        // valid till (0 = inf)
        uint validTill;
        // creator of the bounty
        address creator;
        // amount of wei to claim for resolving the bounty
        uint value;
        // claim details (if available).
        Claim claim;
    }
    
    // Fired as new bounties are being created.
    event NewBounty(uint number, address creator, uint validTill, uint value);
    // Fired when a bounty's value has changed.
    event ChangedBounty(uint indexed number, address mod, uint value);
    // Fired when a bounty has expired or removed
    event DeletedBounty(uint indexed number);
    // Fired when a bounty has been claimed (but not paid out).
    event ClaimBounty(uint indexed number, address claimer);
    // Fired when a bounty claim was successfull.
    event ClaimSuccess(uint indexed number, address indexed claimer, uint value);
    // Fired when a review is done on a claim.
    event Review(uint indexed number, address reviewer, bool approved);
    // Fired when a bounty claim failed / rejected.
    event ClaimFail(uint indexed number, address claimer);
    // Fired when a bounty claim is flagged as spam.
    event ClaimDelete(uint indexed number);
    
    // Bounty tracker constructor
    function Tracker() {
        operator = msg.sender;
        basePath = "ethereum/go-ethereum";
        // hardcoded temp values
        isReviewer[0x9df9878ae7b4f5133efea173733d16fc6ea5dde3] = true;
        isReviewer[0xc3fac3cc4feed25b6b4b258cdd57c5ce208d34dc] = true;
    }

    // refundBounty refunds the bounty back to the creator of the bounty
    function refundBounty(Bounty bounty) internal {
        bounty.creator.send(bounty.value);
    }

    // deleteBounty cleans state and removes it from the list of bounties
    function deleteBounty(uint number) internal {
            delete bounties[number];
            delete bountyAvailable[number];
    }

    // reclaimBounty deletes the bounty and returns funds to submitters. This
    // introduces centralisation and pof thru the operator.
    function reclaimBounty(uint number) {
        if( operator != msg.sender || !bountyAvailable[number] ) return;

        Bounty bounty = bounties[number];
        if( bounty.claim.inProgress ) {
            bounty.claim.owner.send(bounty.claim.deposit);
            ClaimDelete(number);
        }
        bounty.creator.send(bounty.value);

        deleteBounty(number);
        DeletedBounty(number);
    }

    // validateBounty returns if a bounty is still valid and available. If it notices
    // expiration it will delete it and refund the bounty back to the creator of
    // the bounty.
    function validateBounty(uint number) internal returns (bool) {
        if( !bountyAvailable[number] ) {
            return false;
        }

        Bounty bounty = bounties[number];
        // check if a bounty is expired and not in progress. When a bounty is in progress
        // we consider it to be valid and it won't be deleted.
        if( bounty.validTill != 0 && bounty.validTill < block.timestamp && !bounty.claim.inProgress ) {
            // refund the bounty and delete it
            refundBounty(bounty);
            deleteBounty(number);

            DeletedBounty(number);

            return false;
        }

        return true;
    }
    
    function failAndResend() {
        if( msg.value > 0 ) msg.sender.send( msg.value );
    }

    // submitBounty creates a new bounty with the number as identifier
    // whenever a bounty already exists add the bounty value to the existing
    // bounty.
    function submitBounty(uint number, uint validTill) {
        // bounty does not exist, create new bounty
        if( !validateBounty(number) ) {
            if( msg.value > 0 ) {
                Bounty memory bounty;
                bounty.validTill = validTill;
                bounty.creator = msg.sender;
                bounty.value = msg.value;

                bounties[number] = bounty;
                bountyAvailable[number] = true;
                
                NewBounty(number, msg.sender, validTill, msg.value);
            }
        } else { // dup bounties not permitted
            failAndResend();
        }
    }
    
    // getBountyValue returns the value for the bounty identified by the number.
    function getBountyValue(uint number) constant returns (uint) {
        return bounties[number].value;
    }
    
    // claimBounty claims the bounty and requires deposit to avoid spam
    function claimBounty(uint number) {
        if( validateBounty(number) && msg.value >= 10 ether) {
            Bounty bounty = bounties[number];
            if( bounty.claim.inProgress ) {
                // throw doesn't work now. just send back the deposit
                msg.sender.send(msg.value);
                return;
            }
            
            bounty.claim.inProgress = true;
            bounty.claim.owner = msg.sender;
            bounty.claim.deposit = msg.value;
            bounties[number] = bounty;
            
            ClaimBounty(number, msg.sender);
        } else {
            failAndResend();
        }
    }
    
    // resetClaimState is an internal method which resets the bounty's
    // claim state (i.e. it deleted the claim).
    function resetClaimState(uint number, Bounty bounty) internal {
        delete bounty.claim;
        bounties[number] = bounty;
    }
    
    // reviewClaim reviews a claim made on a bounty. If the critirea is met
    // payout bounty to the owner of the claim minus a fee for the reviewers.
    function reviewClaim(uint number, uint approve) {
        if( !isReviewer[msg.sender] || !bountyAvailable[number] ) return;
        
        Bounty bounty = bounties[number];
        if( !bounty.claim.inProgress ) return;

        // prevent double voting
        for(var j = 0; j < bounty.claim.reviewers.length; j++) {
            if( bounty.claim.reviewers[j] == msg.sender ) return;
        }
        
        Review(number, msg.sender, approve>0);
        if( approve == 0 ) {
            bounty.claim.owner.send(bounty.claim.deposit);
            resetClaimState(number, bounty);
            
            ClaimFail(number, bounty.claim.owner);
            return;
        }

        bounty.claim.reviewers[bounty.claim.ri] = msg.sender;
        bounty.claim.ri++;
        if(bounty.claim.ri == 2) {
            // calculate cut for the reviewers
            uint rcut = bounty.value / 100 * 10;
            // pay out bounty to owner of the claim minus the review cut
            bounty.claim.owner.send(bounty.value - (rcut*2) + bounty.claim.deposit);
            // pay out review cut
            for(var i = 0; i < bounty.claim.reviewers.length; i++) {
                bounty.claim.reviewers[i].send(rcut);
            }
            
            deleteBounty(number);
            
            ClaimSuccess(number, bounty.claim.owner, bounty.value);
        }
    }
    
    // getReviewCount returns the amount of reviews received on the
    // claim.
    function getReviewCount(uint number) constant returns (uint) {
        return bounties[number].claim.ri;
    }
    
    // flagSpam removes the claim from the bounty and transfer deposits in 
    // to the tracker creator's account.
    function flagSpam(uint number) {
        if( !bountyAvailable[number] || msg.sender != operator) return;
        
        Bounty bounty = bounties[number];
        resetClaimState(number, bounty);
        
        operator.send(bounty.claim.deposit); // operator takes all ;-)
        
        ClaimDelete(number);
    }

    function kill() {
        if( msg.sender == operator ) suicide(operator);
    }
}
//10 ether = 10000000000000000000
