library Directory {

  struct AddressBytesMap { mapping(address => bytes32) bytesentries; }

  struct AddressAddressMap { mapping(address => address) addrentries; }

  struct AddressBoolMap { mapping(address => bool) boolentries; }

  function insert(AddressBytesMap storage self, address key, bytes32 val) returns (bool) {
    if (self.bytesentries[key] == val) return false;
    self.bytesentries[key] = val;
    return true;
  }

  function insert(AddressBoolMap storage self, address key) returns (bool) {
    if (self.boolentries[key]) return false;
    self.boolentries[key] = true;
    return true;
  }

  function insert(AddressAddressMap storage self, address key, address val) returns (bool) {
    if (self.addrentries[key] == val) return false;
    self.addrentries[key] = val;
    return true;
  }

  function remove(AddressBytesMap storage self, address key) returns (bool) {
    if (self.bytesentries[key] == 0x0) return false;
    self.bytesentries[key] = 0x0;
    return true;
  }

  function remove(AddressBoolMap storage self, address key) returns (bool) {
    if (!self.boolentries[key]) return false;
    self.boolentries[key] = false;
    return true;
  }

  function remove(AddressAddressMap storage self, address key) returns (bool) {
    if (self.addrentries[key] == 0x0000000000000000000000000000000000000000) return false;
    self.addrentries[key] = 0x0000000000000000000000000000000000000000;
    return true;
  }

  function contains(AddressBytesMap storage self, address key) returns (bool) {
    if (self.bytesentries[key] != 0x0) return true;
  }

  function contains(AddressBoolMap storage self, address key) returns (bool) {
    return self.boolentries[key];
  }

  function contains(AddressAddressMap storage self, address key) returns (bool) {
    if (self.addrentries[key] != 0x0000000000000000000000000000000000000000) return true;
  }

  function containsAndMatches(AddressBytesMap storage self, address key, bytes32 val) returns (bool) {
    return (self.bytesentries[key] == val);
  }

  function containsAndMatches(AddressAddressMap storage self, address key, address val) returns (bool) {
    return (self.addrentries[key] == val);
  }

}

contract DigixConfiguration {

  address owner;
  Directory.AddressBoolMap admins;

  mapping (bytes32 => address) configaddr;
  mapping (bytes32 => uint256) configint;
  mapping (bytes32 => bytes32) configbytes;

  event SetOwner(address indexed owner, address indexed by);
  event AddConfigEntryA(bytes32 indexed key, address indexed val, address indexed by);
  event AddConfigEntryI(bytes32 indexed key, uint256 indexed val, address indexed by);
  event AddConfigEntryB(bytes32 indexed key, bytes32 indexed val, address indexed by);
  event RegisterAdmin(address indexed account, address indexed by);
  event UnregisterAdmin(address indexed account, address indexed by);

  function DigixConfiguration() {
    owner = msg.sender;
  }

  modifier ifowner { if(msg.sender == owner) _ }
  modifier ifadmin { if((msg.sender == owner) || isAdmin(msg.sender)) _ }

  function getOwner() public constant returns (address) {
    return owner;
  }

  function setOwner(address _newowner) ifowner {
    owner = _newowner;
    SetOwner(_newowner, msg.sender);
  }

  function addConfigEntryAddr(bytes32 _key, address _val) ifowner returns (bool) {
    configaddr[_key] = _val;
    AddConfigEntryA(_key, _val, msg.sender);
    return true;
  }

  function getConfigEntryAddr(bytes32 _key) public constant returns (address) {
    return configaddr[_key];
  }

  function addConfigEntryInt(bytes32 _key, uint256 _val) ifowner returns (bool) {
    configint[_key] = _val;
    AddConfigEntryI(_key, _val, msg.sender);
    return true;
  }

  function getConfigEntryInt(bytes32 _key) public constant returns (uint256) {
    return configint[_key];
  }

  function addConfigEntryBytes(bytes32 _key, bytes32 _val) ifowner returns (bool) {
    configbytes[_key] = _val;
    AddConfigEntryB(_key, _val, msg.sender);
    return true;
  }

  function getConfigEntryBytes(bytes32 _key) public constant returns (bytes32) {
    return configbytes[_key];
  }

  function registerAdmin(address _acct) ifowner returns (bool) {
    if (!Directory.insert(admins, _acct))
      throw;
    RegisterAdmin(_acct, msg.sender);
    return true;
  }

  function unregisterAdmin(address _acct) ifowner {
    if (!Directory.remove(admins, _acct))
      throw;
    UnregisterAdmin(_acct, msg.sender);
  }

  function isAdmin(address _acct) public returns (bool) {
    return Directory.contains(admins, _acct);
  }

}
