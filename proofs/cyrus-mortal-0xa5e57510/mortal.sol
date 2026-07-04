contract mortal {
    address owner;
    function mortal() { owner = msg.sender; }
    function kill() { if (msg.sender == owner) suicide(owner); }
}
