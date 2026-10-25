// Submitted by EthereumHistory (ethereumhistory.com)
contract DigixbotUsers {

  struct User {
    bytes32 id; 
    address account;
    bool configured;
    bool lockaccount;
    bool locktip;
  }

  address owner;
  address config;

  mapping(bytes32 => User) users;
  mapping(address => bytes32) ids;

  event EventLog(uint indexed _eventType, bytes32 indexed _eventData);
  enum EventTypes { AddUser, SetAccount }

  function DigixbotUsers(address _config) {
    owner = msg.sender;
    config = _config;
  }

  function getOwner() public returns (address) {
    return owner;
  }

  function getConfig() public returns (address) {
    return config;
  }

  function getBotContract() public returns (address) {
    return DigixbotConfiguration(config).getBotContract();
  }

  modifier ifowner { if (msg.sender == owner) _ }
  modifier ifbot { if (msg.sender == getBotContract()) _ }

  function addUser(bytes32 _id) ifbot {
    users[_id].id = _id;
    users[_id].configured = true;
    users[_id].lockaccount = false;
    users[_id].locktip = false;
    EventLog(uint(EventTypes.AddUser), _id);
  }

  function userCheck(bytes32 _id) public returns (bool) {
    return users[_id].configured;
  }

  function setUserAccount(bytes32 _id, address _account) ifbot {
    bool _acctlock = accountLockCheck(_id);
    if (_acctlock == false) {
      users[_id].account = _account;
      ids[_account] = _id; 
      EventLog(uint(EventTypes.SetAccount), _id);
    }
  }

  function accountLockCheck(bytes32 _id) public returns (bool) {
    return users[_id].lockaccount;
  }

  function lockAccount(bytes32 _id) ifbot {
    if (userAddressCheck(_id) == true) {
      users[_id].lockaccount = true;
    }
  }

  function userAddressCheck(bytes32 _id) public returns (bool) {
    address _user = getUserAccount(_id); 
    return _user != 0x0000000000000000000000000000000000000000;
  }

  function unlockAccount(bytes32 _id) ifbot {
    users[_id].lockaccount = false;
  }

  function tipLockCheck(bytes32 _id) public returns (bool) {
    return users[_id].locktip;
  }
  
  function lockTip(bytes32 _id) ifbot {
    if (userAddressCheck(_id) == true) {
      users[_id].locktip = true;
    }
  }

  function unlockTip(bytes32 _id) ifbot {
    users[_id].locktip = false;
  }

  function getUserId(address _account) public returns (bytes32) {
    return ids[_account];
  }

  function getUserAccount(bytes32 _id) public returns (address) {
    return users[_id].account;
  }

}


contract DigixbotConfiguration {

  struct Coin {
    bytes4 name;
    address wallet;
    bool locked;
  }

  address owner;
  address botcontract;
  address userscontract;
  bool locked;

  mapping(bytes4 => Coin) coins;

  modifier ifowner { if (msg.sender == owner) _ }
  modifier unlesslocked { if (locked == false) _ }

  function DigixbotConfiguration() {
    owner = msg.sender;
    locked = false;
  }

  function getOwner() public constant returns (address) {
    return owner;
  }

  function setBotContract(address _botcontract) ifowner unlesslocked {
    botcontract = _botcontract;
  }
  
  function getBotContract() public returns (address) {
    return botcontract;
  }

  function setUsersContract(address _userscontract) ifowner unlesslocked {
    userscontract = _userscontract;
  }

  function getUsersContract() public returns (address) {
    return userscontract;
  }

  function lockConfiguration() ifowner {
    locked = true;
  }

  function addCoin(bytes4 _name, address _wallet) ifowner {
    Coin _cta = coins[_name];
    if (_cta.locked == false) {
      _cta.name = _name;
      _cta.wallet = _wallet;
      _cta.locked = true;
    }
  }

  function getCoinWallet(bytes4 _coin) public constant returns (address) {
    return coins[_coin].wallet;
  }

} 



contract Coin {
  function getBotContract() returns(address );
  function getUserId(address _address) returns(bytes32 );
  function withdrawCoin(bytes32 _user,uint256 _amount);
  function depositCoin(bytes32 _uid,uint256 _amt);
  function getBalance(bytes32 _uid) returns(uint256 );
  function totalBalance() returns(uint256 );
  function getConfig() returns(address );
  function getUsersContract() returns(address );
  function sendCoin(bytes32 _sender,bytes32 _recipient,uint256 _amt);
}

contract Digixbot {
  address owner;
  address config;

  function Digixbot(address _config) {
    owner = msg.sender;
    config = _config;
  }

  modifier ifowner { if(msg.sender == owner) _ }

  function getConfig() public returns (address) {
    return config;
  }

  function addUser(bytes32 _userid) ifowner {
    DigixbotUsers(getUsersContract()).addUser(_userid); 
  }

  function setUserAccount(bytes32 _userid, address _account) ifowner {
    bool _acctlock = accountLockCheck(_userid);
    if (_acctlock == false) {
      DigixbotUsers(getUsersContract()).setUserAccount(_userid, _account);
    }
  }

  function getUserAccount(bytes32 _userid) public returns (address) {
    return DigixbotUsers(getUsersContract()).getUserAccount(_userid);
  }

  function getUsersContract() public returns (address) {
    return DigixbotConfiguration(config).getUsersContract();
  }

  function getCoinWallet(bytes4 _coin) public returns(address) {
    return DigixbotConfiguration(config).getCoinWallet(_coin);
  }

  function userCheck(bytes32 _id) public returns(bool) {
    return DigixbotUsers(getUsersContract()).userCheck(_id);
  }

  function sendCoin(bytes4 _coin, bytes32 _from, bytes32 _to, uint _amount) ifowner {
    bool _tiplock = tipLockCheck(_from);
    if (_tiplock == false) {
      Coin(getCoinWallet(_coin)).sendCoin(_from, _to, _amount); 
    }
  }
    
  function withdrawCoin(bytes4 _coin, bytes32 _userid, uint _amount) ifowner {
    Coin(getCoinWallet(_coin)).withdrawCoin(_userid, _amount);
  }

  function getCoinBalance(bytes4 _coin, bytes32 _userid) public returns(uint) {
    return Coin(getCoinWallet(_coin)).getBalance(_userid);
  }

  function getTotalBalance(bytes4 _coin) public returns(uint) {
    return Coin(getCoinWallet(_coin)).totalBalance();
  }

  function accountLockCheck(bytes32 _id) public returns (bool) {
    return DigixbotUsers(getUsersContract()).accountLockCheck(_id);
  }
  
  function tipLockCheck(bytes32 _id) public returns (bool) {
    return DigixbotUsers(getUsersContract()).tipLockCheck(_id);
  }

  function lockAccount(bytes32 _id) ifowner {
    DigixbotUsers(getUsersContract()).lockAccount(_id);
  }

  function lockTip(bytes32 _id) ifowner {
    DigixbotUsers(getUsersContract()).lockTip(_id);
  }

  function unlockAccount() {
    address _userscontract = getUsersContract();
    bytes32 _userid = DigixbotUsers(_userscontract).getUserId(msg.sender);
    DigixbotUsers(_userscontract).unlockAccount(_userid);
  }

  function unlockTip() {
    address _userscontract = getUsersContract();
    bytes32 _userid = DigixbotUsers(_userscontract).getUserId(msg.sender);
    DigixbotUsers(_userscontract).unlockTip(_userid);
  }
  

}

