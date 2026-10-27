// Submitted by EthereumHistory (ethereumhistory.com)
contract Token {
    function transfer(address to, uint256 value);
}

contract DepositWallet {
    address owner;
    function DepositWallet() { owner = msg.sender; }
    event Deposit(address indexed from, uint256 value, uint256 indexed data);
    function() payable { if (msg.value > 0) Deposit(msg.sender, msg.value, 88); }
    function collectToken(address token, address to, uint256 amount) {
        if (msg.sender == owner) {
            var t = Token(token);
            t.transfer(to, amount);
        }
    }
    function kill() { if (msg.sender == owner) suicide(owner); }
    function collect() { if (msg.sender == owner) owner.send(this.balance); }
}
