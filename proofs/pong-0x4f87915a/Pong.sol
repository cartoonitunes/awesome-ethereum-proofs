contract Pong {
    address owner;
    int8 pongval;

    function Pong() {
        owner = msg.sender;
    }

    function setPongval(int8 val) {
        pongval = val;
    }

    function getPongval() returns (int8) {
        return pongval;
    }

    function kill() {
        if (msg.sender == owner) suicide(owner);
    }
}
