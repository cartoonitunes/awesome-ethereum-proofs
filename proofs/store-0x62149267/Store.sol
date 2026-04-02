contract Store {
    uint8 value;
    function set(uint8 v) { value = v; }
    function kill() { suicide(msg.sender); }
    function get() returns (uint8) { return value; }
}
