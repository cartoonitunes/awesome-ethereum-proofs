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

contract MyToken is owned {
    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;

    /* Public variables of the token */
    string public name;
    string public symbol;
    uint8 public decimals;
    uint currentChallenge = 1;

    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function MyToken(
        uint256 initialSupply,
        string tokenName,
        uint8 decimalUnits,
        address centralMinter
        ) {
        if(centralMinter != 0 ) owner = msg.sender;
        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
        name = tokenName;                                   // Set the name for display purposes
        decimals = decimalUnits;                            // Amount of decimals for display purposes
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value || balanceOf[_to] + _value < balanceOf[_to]) throw;
        balanceOf[msg.sender] -= _value;                     // Subtract from the sender
        balanceOf[_to] += _value;                            // Add the same to the recipient
        Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
    }

    function rewardMathGeniuses(uint answerToCurrentReward, uint nextChallenge) {
        if (answerToCurrentReward**3 != currentChallenge) throw; // If answer is wrong do not continue
        balanceOf[msg.sender] += 1;         // Reward the player
        currentChallenge = nextChallenge;   // Set the next challenge
    }
}
