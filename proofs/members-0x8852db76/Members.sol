contract Members {
    address public owner;
    mapping (address => uint) public memberId;
    Member[] public members;

    struct Member {
        address member;
        string name;
    }

    event MemberAdded(address member, string name, uint id);
    event MemberRemoved(address member, string name, uint id);
    event MemberUpdated(address member, string name, uint id);
    event PayOut(uint value, uint count, uint share);

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _
    }

    function Members() {
        members.length++;
        members[0] = Member({member: 0, name: ""});
    }

    function claimOwnership() {
        if (owner != 0) throw;
        owner = msg.sender;
    }

    function addMember(address targetMember, string memberName) onlyOwner {
        if (memberId[targetMember] != 0) throw;
        uint id = members.length++;
        memberId[targetMember] = id;
        members[id] = Member({member: targetMember, name: memberName});
        MemberAdded(targetMember, memberName, id);
    }

    function changeMemberAddress(address newAddress) {
        uint id = memberId[msg.sender];
        if (members[id].member == msg.sender) {
            members[id].member = newAddress;
            MemberUpdated(newAddress, members[id].name, id);
        }
    }

    function removeMember(address targetMember) onlyOwner {
        if (memberId[targetMember] == 0) throw;
        uint id = memberId[targetMember];
        string memory name = members[id].name;
        delete members[id];
        memberId[targetMember] = 0;
        for (uint i = id; i < members.length - 1; i++) {
            members[i] = members[i + 1];
            memberId[members[i].member] = i;
        }
        members.length--;
        MemberRemoved(targetMember, name, id);
    }

    function killContract() onlyOwner {
        suicide(owner);
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }

    function() {
        uint share = msg.value / (members.length - 1);
        for (uint i = 1; i < members.length; i++) {
            members[i].member.send(share);
        }
        PayOut(msg.value, members.length - 1, share);
    }
}
