// Submitted by EthereumHistory (ethereumhistory.com)
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



contract DigixbotEthereum {

  address config;

  mapping(bytes32 => uint) balances;

  event UserIdLogger(bytes32 indexed _debug);

  function DigixbotEthereum(address _config) {
    config = _config;
  }

  function() {
    bytes32 _userid = getUserId(msg.sender);
    UserIdLogger(_userid);
    balances[_userid] += msg.value;
  }

  function depositCoin(bytes32 _userid, uint _amount) ifbot {
    balances[_userid] += _amount;
  }

  function getConfig() public returns (address) {
    return config;
  }

  function getUsersContract() public returns (address) {
    return DigixbotConfiguration(config).getUsersContract();
  }

  function getBotContract() public returns (address) {
    return DigixbotConfiguration(config).getBotContract();
  }

  function getUserId(address _address) public returns (bytes32) {
    return DigixbotUsers(getUsersContract()).getUserId(_address);
  }

  function getUserAccount(bytes32 _userid) public returns(address) {
    return DigixbotUsers(getUsersContract()).getUserAccount(_userid);
  }

  modifier ifbot { if (msg.sender == getBotContract()) _ }
  modifier ifusers { if (msg.sender == getUsersContract()) _ }

  function sendCoin(bytes32 _sender, bytes32 _recipient, uint _amt) ifbot {
    if (_amt >= 100000000000000000) {
      if (balances[_sender] >= _amt) {
        balances[_sender] -= _amt;
        balances[_recipient] += _amt;
      }
    }
  }

  function withdrawCoin(bytes32 _user, uint _amount) ifbot {
    address _requester = getUserAccount(_user);
    if (_requester != 0x0000000000000000000000000000000000000000) {
      if (_amount >= 1000000000000000000) {
        if (balances[_user] >= _amount) {
          balances[_user] -= _amount;
          _requester.send(_amount);
        }
      }
    }
  }

  function withdrawCoinExt(uint _amount) {
    bytes32 _requester = getUserId(msg.sender);
    if (balances[_requester] >= _amount) {
      balances[_requester] -= _amount;
      address(msg.sender).send(_amount);
    }
  }

  function getBalance(bytes32 _uid) public returns (uint) {
    return balances[_uid];
  }

  function totalBalance() public returns (uint) {
    return this.balance;
  }

}

