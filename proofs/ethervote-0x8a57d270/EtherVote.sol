pragma solidity ^0.4.11;
contract EtherVote {
    event LogVote(bytes32 indexed proposalHash, bool pro, address addr);

    /// @notice I `pro? agree : disagree` with the statement whose hash is `proposalHash`
    /// @param proposalHash hash of the proposal
    /// @param pro do you support it or not?
    function vote(bytes32 proposalHash, bool pro) {
        // Log the vote
        LogVote(proposalHash, pro, msg.sender);
    }
}
