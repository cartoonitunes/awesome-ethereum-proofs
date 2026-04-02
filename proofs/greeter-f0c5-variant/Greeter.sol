contract mortal {
    address owner;
    function mortal() { owner = msg.sender; }
    function kill() { if (msg.sender == owner) suicide(owner); }
}
contract greeter is mortal {
    string greeting;
    function greeter(string _greeting) {
        greeting = _greeting;
    }
    function greet() returns (string) {
        return greeting;
    }
}
