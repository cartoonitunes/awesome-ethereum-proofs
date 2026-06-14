contract Agreement {
    address owner;
    string text;
    function Agreement() { owner = msg.sender; }
    function kill() { if (msg.sender == owner) suicide(owner); }
    function returnContract() constant returns (string) { return text; }
}
