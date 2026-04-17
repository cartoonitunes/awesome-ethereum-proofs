contract T {
    function set(uint256 x);
}

contract Controller {
    T target = T(0x9e0ae8ffd946d12d1d393c6f3bca0eecadc9428e);

    function set(uint256 x) {
        T t = target;
        t.set(x);
    }

    function get() returns (uint8) {
        return 0xff;
    }
}
