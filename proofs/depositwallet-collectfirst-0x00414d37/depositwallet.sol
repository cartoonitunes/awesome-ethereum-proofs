// DepositWallet with collect() declared before kill() — that source order is the only
// difference from DepositWallet.sol and it flips the two function bodies' placement in the
// runtime, making it byte-exact (runtime-substring proof) for:
//   0x00414D37c3fC0b72F81E43570cef409D22a04e48 (123 deploys, 543B runtime) — solc 0.1.1 opt OFF
contract DepositWallet {
    address owner;
    function DepositWallet() { owner = msg.sender; }
    event Deposit(address indexed from, uint256 value, uint256 indexed data);
    function() { if (msg.value > 0) Deposit(msg.sender, msg.value, 88); }
    function collect() { if (msg.sender == owner) owner.send(this.balance); }
    function kill() { if (msg.sender == owner) suicide(owner); }
}
