contract Mortal {

    address owner;

    function Mortal() {
        owner = msg.sender;
    }

    function kill() {
        if (msg.sender == owner) {
            suicide(owner);
        }
    }
}
