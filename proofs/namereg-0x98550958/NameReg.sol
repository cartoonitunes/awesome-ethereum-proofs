// Submitted by EthereumHistory (ethereumhistory.com)
// Used as a marker to not auto-create the contract by ide.ether.camp
contract abstract {}

contract NameReg is abstract {
    
  mapping (address => bytes32) toName;
  mapping (bytes32 => address) toAddress;
  mapping (bytes32 => address) nameOwner;
    
  event Register(address indexed addr, bytes32 name);
  event Unregister(address indexed addre, bytes32 name);
    
  function NameReg() {
    toName[this] = "NameReg";
    toAddress["NameReg"] = this;
    nameOwner["NameReg"] = msg.sender;
    
    Register(this, "NameReg");
  }
  
  function register(bytes32 name) {
    if (toAddress[name] != address(0) && nameOwner[name] != tx.origin) return;
    
    bytes32 oldName = toName[msg.sender];
    if (oldName != "") {
      toAddress[oldName] = address(0);
      nameOwner[oldName] = address(0);
      
      Unregister(msg.sender, oldName);
    }
    
    toName[msg.sender] = name;
    toAddress[name] = msg.sender;
    nameOwner[name] = tx.origin;
    
    Register(msg.sender, name);
  }

  function unregister() { 
    bytes32 name = toName[msg.sender];
    if (name == "" || nameOwner[name] != tx.origin) return;
    
    toName[msg.sender] = "";
    toAddress[name] = address(0);
    nameOwner[name] = address(0);
    
    Unregister(msg.sender, name);
  }

  function unregister(bytes32 name) { 
    if (nameOwner[name] != msg.sender) return;
    
    toName[msg.sender] = "";
    address addr = toAddress[name];
    toAddress[name] = address(0);
    nameOwner[name] = address(0);
    
    Unregister(addr, name);
  }

  function addressOf(bytes32 name) constant returns (address addr) {
    return toAddress[name];
  }

  function nameOf(address addr) constant returns (bytes32 name) {
    return toName[addr];
  }
}