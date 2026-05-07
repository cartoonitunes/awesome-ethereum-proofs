// Submitted by EthereumHistory (ethereumhistory.com)
/*

Solc: '0.2.1-91a6b35f/.-Emscripten/clang/int linked to libethereum-' with optim
Address: 0xc7e9dDd5358e08417b1C88ed6f1a73149BEeaa32

testnet unicorn: 0x21E6fc92f93C8A1Bb41e2Be64b4E1f88a54d3576
Meat Grinders Association Address: 0x7cb292Ab6d4170D263609572ee087Bc78b85A92b

Alice: 0xDC9974d8D61EBb673b1D132E0b767f4e38FBA057
Bob: 0x5F8f68a0D1CbC75f6eF764a44619277092C32DF0
Eve: 0xafA55A04adE6645f676F50e45CdE7C90F75Fab99*/
/* The token is used as a voting shares */
contract token {
    mapping (address => uint256) public balanceOf;
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
    function mintToken(address target, uint256 mintedAmount);
}

/* define 'owned' */
contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _
    }

}


contract MeatCalculator {
    function calculateMeat(uint amountOfUnicorns) constant returns (uint amountOfMeat);
}

/* The democracy contract itself */
contract MeatGrindersAssociation is owned {

    /* Contract Variables and events */
    uint public minimumQuorum;
    uint public debatingPeriodInMinutes;
    uint public rejectionMultiplier;
    Proposal[] public proposals;
    uint public numProposals;

    mapping (address => uint256) public unicornsKilled;
    uint public totalUnicornsKilled;

    token public unicornTokenAddress;
    token public meatTokenAddress;
    MeatCalculator public meatProvider;

    event ProposalAdded(uint proposalID, address recipient, uint amount, string description);
    event Voted(uint proposalID, bool position, address voter);
    event ProposalTallied(uint proposalID, int result, uint quorum, bool active);
    event ChangeOfRules(uint minimumQuorum, uint debatingPeriodInMinutes, address sharesTokenAddress);

    struct Proposal {
        address recipient;
        uint amount;
        string description;
        uint votingDeadline;
        bool executed;
        bool proposalPassed;
        uint numberOfVotes;
        bytes32 proposalHash;
        Vote[] votes;
        mapping (address => bool) voted;
    }

    struct Vote {
        bool inSupport;
        uint bribe;
        address voter;
    }



    /* modifier that allows only shareholders to vote and create new proposals */
    modifier onlyShareholders {
        if (unicornTokenAddress.balanceOf(msg.sender) == 0) throw;
        _
    }

    /* First time setup */
    function MeatGrindersAssociation(
        address unicornAddress,
        address meatAddress,
        uint minimumUnicornsToPassAVote,
        uint minutesForDebate,
        uint multiplierForVotesAgainst,
        address meatCalculator
    ) {
        if (minimumUnicornsToPassAVote == 0 ) minimumUnicornsToPassAVote = 1;
        changeVotingRules( unicornAddress,  meatAddress,  minimumUnicornsToPassAVote,  minutesForDebate,  multiplierForVotesAgainst);
        changeMeatProvider(meatCalculator);
    }

    /*change rules*/
    function changeVotingRules(address unicornAddress, address meatAddress, uint minimumSharesToPassAVote, uint minutesForDebate, uint multiplierForVotesAgainst) onlyOwner {
        unicornTokenAddress = token(unicornAddress);
        meatTokenAddress = token(meatAddress);
        minimumQuorum = minimumSharesToPassAVote;
        debatingPeriodInMinutes = minutesForDebate;
        rejectionMultiplier = multiplierForVotesAgainst;
        ChangeOfRules(minimumQuorum, debatingPeriodInMinutes, unicornTokenAddress);
    }

    function changeMeatProvider(address newMeatProvider) {
        meatProvider = MeatCalculator(newMeatProvider);
    }

    /* Function to create a new proposal */
    function newProposal(address beneficiary, uint etherAmount, string JobDescription, bytes transactionBytecode) onlyShareholders returns (uint proposalID) {
        proposalID = proposals.length++;
        Proposal p = proposals[proposalID];
        p.recipient = beneficiary;
        p.amount = etherAmount;
        p.description = JobDescription;
        p.proposalHash = sha3(beneficiary, etherAmount, transactionBytecode);
        p.votingDeadline = now + debatingPeriodInMinutes * 1 minutes;
        p.executed = false;
        p.proposalPassed = false;
        p.numberOfVotes = 0;
        ProposalAdded(proposalID, beneficiary, etherAmount, JobDescription);
        numProposals = proposalID+1;
    }


    /* function to check if a proposal code matches */
    function checkProposalCode(uint proposalNumber, address beneficiary, uint etherAmount, bytes transactionBytecode) constant returns (bool codeChecksOut) {
        Proposal p = proposals[proposalNumber];
        return p.proposalHash == sha3(beneficiary, etherAmount, transactionBytecode);
    }

    /* */
    function vote(uint proposalNumber, bool supportsProposal) onlyShareholders returns (uint voteID){
        Proposal p = proposals[proposalNumber];
        if (p.voted[msg.sender] == true) throw;

        voteID = p.votes.length++;
        p.votes[voteID] = Vote({inSupport: supportsProposal, voter: msg.sender, bribe: sqrt(msg.value + msg.gas*tx.gasprice)});
        p.voted[msg.sender] = true;
        p.numberOfVotes = voteID +1;
        Voted(proposalNumber,  supportsProposal, msg.sender);
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }

    function executeProposal(uint proposalNumber, bytes transactionBytecode) returns (int result) {
        Proposal p = proposals[proposalNumber];
        /* Check if the proposal can be executed */
        if (now < p.votingDeadline  /* has the voting deadline arrived? */
            ||  p.executed        /* has it been already executed? */
            ||  p.proposalHash != sha3(p.recipient, p.amount, transactionBytecode)) /* Does the transaction code match the proposal? */
            throw;

        /* tally the votes */
        uint quorum = 0;
        uint yea = 0;
        uint nay = 0;

        for (uint i = 0; i <  p.votes.length; ++i) {
            Vote v = p.votes[i];
            uint voteWeight = unicornTokenAddress.balanceOf(v.voter);
            quorum += voteWeight * v.bribe;
            if (v.inSupport) {
                yea += voteWeight * v.bribe;
            } else {
                nay += voteWeight * v.bribe;
            }
        }

        /* execute result */
        if (quorum <= minimumQuorum) {
            /* Not enough significant voters */
            throw;
        } else if (yea > nay ) {
            /* has quorum and was approved */
            p.recipient.call.value(p.amount * 1 ether)(transactionBytecode);
            p.executed = true;
            p.proposalPassed = true;
        } else {
            p.executed = true;
            p.proposalPassed = false;
        }
        // Fire Events
        ProposalTallied(proposalNumber, result, quorum, p.proposalPassed);
    }

    function receiveApproval(address _from, uint256 _value, address _token) {
        if(token(_token) != unicornTokenAddress) throw;
        if (!unicornTokenAddress.transferFrom(_from, address(this), _value)) throw;

        meatTokenAddress.mintToken(_from, meatProvider.calculateMeat(_value));
        unicornsKilled[_from] += _value;
        totalUnicornsKilled += _value;
    }

    function grindUnicorns(uint256 amountOfUnicornsToGrind) {
        unicornTokenAddress.transferFrom(msg.sender, address(this), amountOfUnicornsToGrind);
        meatTokenAddress.mintToken(msg.sender, meatProvider.calculateMeat(amountOfUnicornsToGrind));
        unicornsKilled[msg.sender] += amountOfUnicornsToGrind;
        totalUnicornsKilled += amountOfUnicornsToGrind;
    }

    function sqrt(uint x) constant returns (uint y) {
        if (x == 0) return 0;
        else if (x <= 3) return 1;
        uint z = (x + 1) / 2;
        y = x;
        while (z < y)
        /// @why3 invariant { to_int !_z = div ((div (to_int arg_x) (to_int !_y)) + (to_int !_y)) 2 }
        /// @why3 invariant { to_int arg_x < (to_int !_y + 1) * (to_int !_y + 1) }
        /// @why3 invariant { to_int arg_x < (to_int !_z + 1) * (to_int !_z + 1) }
        /// @why3 variant { to_int !_y }
        {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
