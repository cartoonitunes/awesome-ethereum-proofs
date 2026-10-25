// Submitted by EthereumHistory (ethereumhistory.com)
contract SubmissionPhase {
  struct Submission {
    string btcaddress;
    //link to proposal
    string linktoproposal;
    uint weightedVote;
  }

  uint endtime;
  address plantoid;
  bool isvoted = false;

  modifier onlyowner { if (msg.sender == plantoid) _ }
  modifier submissionlive { if (isvoted == false) _ }

  Submission[] public submissions;

  event WinnerVoted(string s, string link);
  event Submitted(string s);
  event SubmissionState(string s);

  function SubmissionPhase() {
    //endtime is in 30 days of start date
    endtime = now + (60 * 60 * 24 * 30);
    plantoid = tx.origin;
  }

  function newSubmission(string _artistbtc, string _linktoproposal) submissionlive {
    submissions.push(Submission({btcaddress: _artistbtc, linktoproposal: _linktoproposal, weightedVote: 0}));
    Submitted(_linktoproposal);
  }

  function newVote(uint _weightedVote, uint submissionid) onlyowner {
    submissions[submissionid].weightedVote += _weightedVote;
  }

  function isEnd() submissionlive {
    if (now >= endtime) {
      isvoted = true;
      SubmissionState("Submission and Voting has ended. Votes will be counted now");
    }
  }

  function countVotes() onlyowner {
    Submission winner = submissions[0];
    //TODO: What if 2 submissions have the same amount of votes?
    for (uint i = 1; i < submissions.length; i++) {
      if (winner.weightedVote < submissions[i].weightedVote) {
        winner = submissions[i];
      }
    }

    WinnerVoted("The Winner of the Vote:", winner.linktoproposal);
  }
}


contract Plantoid {
  struct Heart {
    //Bitcoin address of the plant. Has to be string.
    address ethaddress;
    string btcaddress;
    // ethereum address of the creator of the plant, can also be changed to the twitter handle of the person
    address artist;
    //Address of the parent
    address parent;
    // if False, it means that it is a single node with no children
    bool isParent;
    uint threshold;
    uint256 fundsraised;
  }

  struct Recipient {
    bytes32 name;
    string btcaddress;
    uint amount;
  }

  Heart public plant;
  // List of all recipients that receive a percentage of donations
  Recipient[] public recipients;
  // we keep track of all nodes (children) this plant has
  address[] public nodes;

  event SubmissionState(string s, address a);

  modifier onlyowner { if (msg.sender == plant.ethaddress) _ }
  modifier artist_plant { if ((msg.sender == plant.ethaddress) || (msg.sender == plant.artist)) _ }

  function Plantoid(string _btcaddr, address _artist, address _parent, uint _threshold) {
    plant.btcaddress = _btcaddr;
    plant.ethaddress = msg.sender;
    plant.artist = _artist;
    plant.parent = _parent;
    plant.isParent = false;
    plant.threshold = _threshold;
    // This plant is one of the recipients and receives 1% of funds
    recipients.push(Recipient({name: "Parent Plant", btcaddress: _btcaddr, amount: 1}));
  }

  function newFunds(uint256 _amount) onlyowner {
    plant.fundsraised += _amount;

    if (plant.fundsraised >= plant.threshold) {
      plant.fundsraised = 0;
      address submissionsaddr = address(new SubmissionPhase());
      SubmissionState("Submission Phase started", submissionsaddr);
    }
  }

  // The artist him/herself will decide the payout structure for second and subsequent layers
  function addRecipients(bytes32 _name, string _btc_address, uint _amount) artist_plant {
    recipients.push(Recipient({name: _name, btcaddress: _btc_address, amount: _amount}));
  }

  // Once a child plant has been successfully created, we will link it to this plant (the parent)
  function addChild(address _nodeaddress) onlyowner {
    plant.isParent = true;
    nodes.push(_nodeaddress);
  }
}
