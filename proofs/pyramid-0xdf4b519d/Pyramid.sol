contract Pyramid {
    mapping(address => bool) joined;
    address[] public people;
    function Pyramid() {
        joined[msg.sender] = true;
        people.length = 1;
        people[0] = msg.sender;
    }
    function add(address account) {
        if (!joined[msg.sender] || joined[account]) return;
        joined[account] = true;
        uint l = people.length;
        people.length = l + 1;
        people[l] = account;
    }
    function claim() {
        uint256 share = this.balance / people.length;
        for (uint i = 0; i < people.length; i++) {
            people[i].send(share);
        }
    }
}
