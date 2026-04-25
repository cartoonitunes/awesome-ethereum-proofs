

contract owned {
    address public owner;
    function owned() {
        owner = msg.sender;
    }
    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _
    }
    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}

contract Congress is owned {
    uint public minimumQuorum;
    uint public debatingPeriodInMinutes;
    int public majorityMargin;
    Proposal[] public proposals;
    uint public numProposals;
    mapping (address => bool) public isMember;

    event ProposalAdded(uint proposalID, address recipient, uint amount, string description);
    event Voted(uint proposalID, bool position, address voter, string justification);
    event ProposalTallied(uint proposalID, int result, uint quorum, bool active);
    event MembershipChanged(address member, bool isMember);
    event ChangeOfRules(uint minimumQuorum, uint debatingPeriodInMinutes, int majorityMargin);

    struct Proposal {
        address recipient;
        uint amount;
        string description;
        uint votingDeadline;
        bool executed;
        bool proposalPassed;
        uint numberOfVotes;
        int currentResult;
        bytes32 proposalHash;
        Vote[] votes;
        mapping (address => bool) voted;
    }

    struct Vote {
        bool inSupport;
        address voter;
        string justification;
    }

    modifier onlyMembers {
        if (!isMember[msg.sender]) throw;
        _
    }

    function Congress(uint minimumQuorumForProposals, uint minutesForDebate, int marginOfVotesForMajority) {
        minimumQuorum = minimumQuorumForProposals;
        debatingPeriodInMinutes = minutesForDebate;
        majorityMargin = marginOfVotesForMajority;
    }

    function changeMembership(address targetMember, bool canVote) onlyOwner {
        isMember[targetMember] = canVote;
        MembershipChanged(targetMember, canVote);
    }

    function changeVotingRules(uint minimumQuorumForProposals, uint minutesForDebate, int marginOfVotesForMajority) onlyOwner {
        minimumQuorum = minimumQuorumForProposals;
        debatingPeriodInMinutes = minutesForDebate;
        majorityMargin = marginOfVotesForMajority;
        ChangeOfRules(minimumQuorum, debatingPeriodInMinutes, majorityMargin);
    }

    function newProposal(address beneficiary, uint etherAmount, string JobDescription, bytes transactionBytecode) onlyMembers returns (uint proposalID) {
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

    function checkProposalCode(uint proposalNumber, address beneficiary, uint etherAmount, bytes transactionBytecode) constant returns (bool codeChecksOut) {
        Proposal p = proposals[proposalNumber];
        return p.proposalHash == sha3(beneficiary, etherAmount, transactionBytecode);
    }

    function vote(uint proposalNumber, bool supportsProposal, string justificationText) onlyMembers returns (uint voteID) {
        Proposal p = proposals[proposalNumber];
        if (p.voted[msg.sender] == true) throw;
        p.voted[msg.sender] = true;
        p.numberOfVotes++;
        if (supportsProposal) {
            p.currentResult++;
        } else {
            p.currentResult--;
        }
        Voted(proposalNumber, supportsProposal, msg.sender, justificationText);
    }

    function executeProposal(uint proposalNumber, bytes transactionBytecode) returns (int result) {
        Proposal p = proposals[proposalNumber];
        if (now < p.votingDeadline || p.executed || p.proposalHash != sha3(p.recipient, p.amount, transactionBytecode) || p.numberOfVotes <= minimumQuorum) throw;
        if (p.currentResult > majorityMargin) {
            p.recipient.call.value(p.amount * 1 ether)(transactionBytecode);
            p.executed = true;
            p.proposalPassed = true;
        } else {
            p.executed = true;
            p.proposalPassed = false;
        }
        ProposalTallied(proposalNumber, p.currentResult, p.numberOfVotes, p.proposalPassed);
    }
}
