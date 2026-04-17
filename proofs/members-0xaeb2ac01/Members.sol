contract owned {
    address owner;
    function owned() {
        owner = msg.sender;
    }
    modifier onlyOwner { if (msg.sender == owner) _ }
}

contract Members is owned {

    address[] members;
    uint numMembers = 0;
    uint numActiveMembers = 0;
    mapping(address => bool) isMember;
    mapping(address => uint) memberIndex;

    modifier onlyMembers() {
        if (isMember[msg.sender] == true) _
    }

    function Members() {
        isMember[msg.sender] = true;
        members[numMembers] = msg.sender;
        memberIndex[msg.sender] = numMembers;
        numActiveMembers++;
        numMembers++;
    }

    function kill() {
        if (msg.sender == owner) {
            suicide(owner);
        }
    }

    function addMember(address member) onlyMembers returns (bool) {
        if (isMember[member]) {
            return false;
        }
        isMember[member] = true;
        members[numMembers] = member;
        memberIndex[member] = numMembers;
        numActiveMembers++;
        numMembers++;
        return true;
    }

    function removeMember(address member) onlyMembers returns (bool) {
        if (!isMember[member]) {
            return false;
        }
        isMember[member] = false;
        members[memberIndex[member]] = address(0);
        numActiveMembers--;
        return true;
    }

    function checkMembership(address member) returns (bool) {
        return isMember[member];
    }

}
