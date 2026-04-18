contract owned {
    address owner;
    function owned() {
        owner = msg.sender;
    }
    modifier onlyOwner { if (msg.sender == owner) _ }
}

contract MemberRegistry is owned {

    address[] members;
    uint numMembers = 0;
    uint activeMemberCount = 0;
    mapping(address => bool) isMember;
    mapping(address => uint) memberIndex;

    modifier onlyMember() {
        if (isMember[msg.sender] == true) _
    }

    function MemberRegistry() {
        isMember[msg.sender] = true;
        members[numMembers] = msg.sender;
        memberIndex[msg.sender] = numMembers;
        activeMemberCount++;
        numMembers++;
    }

    function kill() {
        if (msg.sender == owner) {
            suicide(owner);
        }
    }

    function addMember(address member) onlyMember returns (bool) {
        if (isMember[member]) {
            return false;
        }
        isMember[member] = true;
        members[numMembers] = member;
        memberIndex[member] = numMembers;
        activeMemberCount++;
        numMembers++;
        return true;
    }

    function removeMember(address member) onlyMember returns (bool) {
        if (!isMember[member]) {
            return false;
        }
        isMember[member] = false;
        members[memberIndex[member]] = address(0);
        activeMemberCount--;
        return true;
    }

    function checkMembership(address member) returns (bool) {
        return isMember[member];
    }

}
