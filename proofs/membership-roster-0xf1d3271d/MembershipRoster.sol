contract owned {
        function owned() { owner = msg.sender; }
        address owner;

        modifier onlyowner { if (msg.sender == owner) _ }
}

contract mortal is owned {
        function kill() onlyowner {
                suicide(owner);
        }
}


contract MembershipRoster is mortal {
        address[] members;
        uint currentIndex = 0;
        uint memberCount = 0;

        mapping (address => bool) isMember;
        mapping (address => uint) memberIndex;

        modifier onlymember { if (isMember[msg.sender] == true) _ }

        function MembershipRoster() {
                isMember[msg.sender] = true;
                members[currentIndex] = msg.sender;
                memberIndex[msg.sender] = currentIndex;
                memberCount++;
                currentIndex++;
        }

        function addMember(address _address) onlymember public returns (bool successful) {
                if ( isMember[_address] ) {
                        return false;
                }

                isMember[_address] = true;
                members[currentIndex] = _address;
                memberIndex[_address] = currentIndex;
                memberCount++;
                currentIndex++;

                return true;
        }

        function removeMember(address _address) onlymember public returns (bool successful) {
                if ( !isMember[_address] ) {
                        return false;
                }
                isMember[_address] = false;
                members[memberIndex[_address]] = 0x0;

                memberCount--;

                return true;
        }

        function checkMembership(address _address) public returns (bool addressIsMember) {
                return isMember[_address];
        }
}


contract EthereumPublicTrust is mortal{
        address membershipRoster;

        function setMembershipRoster(address _address) onlyowner public {
                membershipRoster = _address;
        }
}
