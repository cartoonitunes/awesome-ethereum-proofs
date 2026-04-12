contract T {
    address owner;
    bool flag;

    function T() { owner = msg.sender; }

    function kill() { suicide(owner); }

    function get() returns (address) { return owner; }

    function getBool() returns (bool) { return flag; }

    function test() {
        flag = (msg.sender == 0x8b9346aa412b52954b5138dbb72adab97273766e);
    }
}
