contract GetSet {
    uint reserved;
    address target = 0x9e0ae8ffd946d12d1d393c6f3bca0eecadc9428e;

    function set(uint256 x) {
        target.call("set", x);
    }

    function get() returns (uint8) {
        return 0xff;
    }
}
