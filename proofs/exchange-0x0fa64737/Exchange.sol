contract token { function deposit(bytes32 _id) {} }

contract Exchange {

    address owner;

    event AnonymousDeposit(address indexed _from, uint256 _value);
    event Deposit(address indexed _from, bytes32 indexed _id, uint256 _value);
    event Transfer(bytes32 indexed _from, address indexed _to, uint256 _value);
    event IcapTransfer(bytes32 indexed _from, address indexed _to, bytes32 _id, uint256 _value);

    function Exchange() {
        owner = msg.sender;
    }

    function () {
        AnonymousDeposit(msg.sender, msg.value);
    }

    function deposit(bytes32 _id) {
        Deposit(msg.sender, _id, msg.value);
    }

    function transfer(bytes32 _from, address _to, uint256 _value) {
        if (msg.sender == owner) {
            _to.send(_value);
            Transfer(_from, _to, _value);
        }
    }

    function icapTransfer(bytes32 _from, address _to, bytes32 _id, uint256 _value) {
        if (msg.sender == owner) {
            token(_to).deposit.value(_value)(_id);
            IcapTransfer(_from, _to, _id, _value);
        }
    }

}
