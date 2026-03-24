contract Logger {
    event MyEvent(uint256 value);
    function log(uint256 value) {
        MyEvent(value);
    }
}