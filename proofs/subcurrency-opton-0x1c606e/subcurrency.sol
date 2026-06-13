// 0x1C606eE0c43f60166AB497B33548f7E4E909d447  (deploy block 930142, 2016-01-31)
// CRACKED byte-exact: soljson 0.1.3-0.2.0, optimizer ON, runtime 375 bytes.
//
// The "Coin" subcurrency from the official Solidity documentation, deployed under a contract
// whose name is NOT "Coin" -> the intended constructor `function Coin()` became a PUBLIC
// callable function (early-Solidity constructor footgun): ANYONE can call Coin() to overwrite
// `minter` and seize minting rights. Function declaration order is Coin, send, mint (matters
// for byte-exactness: the last-declared body falls through to the shared epilogue).
contract Subcurrency {
    address public minter;
    mapping (address => uint) public balances;

    event Sent(address from, address to, uint amount);

    function Coin() {
        minter = msg.sender;
    }

    function send(address receiver, uint amount) {
        if (balances[msg.sender] < amount) return;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        Sent(msg.sender, receiver, amount);
    }

    function mint(address receiver, uint amount) {
        if (msg.sender != minter) return;
        balances[receiver] += amount;
    }
}
