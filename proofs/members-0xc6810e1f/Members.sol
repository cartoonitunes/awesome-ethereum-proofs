contract owned {
    address owner;
    function owned() {
        owner = msg.sender;
    }
    modifier onlyOwner { if (msg.sender == owner) _ }
}

contract Members is owned {

    uint nextId = 0;
    uint count = 0;
    mapping(uint => address) members;
    mapping(address => bool) isMember;
    mapping(address => uint) memberId;

    modifier onlyMembers() {
        if (isMember[msg.sender] == true) _
    }

    function Members() {
        isMember[msg.sender] = true;
        members[nextId] = msg.sender;
        memberId[msg.sender] = nextId;
        count++;
        nextId++;
    }

    function kill() {
        if (msg.sender == owner) {
            suicide(owner);
        }
    }

    function addMember(address account) onlyMembers returns (bool) {
        if (isMember[account]) {
            return false;
        }
        isMember[account] = true;
        members[nextId] = account;
        memberId[account] = nextId;
        count++;
        nextId++;
        return true;
    }

    function removeMember(address account) onlyMembers returns (bool) {
        if (!isMember[account]) {
            return false;
        }
        isMember[account] = false;
        members[memberId[account]] = 0;
        count--;
        return true;
    }

    function checkMembership(address account) returns (bool) {
        return isMember[account];
    }

}
