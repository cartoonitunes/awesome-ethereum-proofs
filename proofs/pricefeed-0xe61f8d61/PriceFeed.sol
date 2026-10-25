// Submitted by EthereumHistory (ethereumhistory.com)

// This si marker
// for contract not
// to be deployed to 
// any environment
contract abstract {}

contract owned is abstract {
  address owner;
  function owned() {
    owner = msg.sender;
  }
  function changeOwner(address newOwner) onlyowner {
    owner = newOwner;
  }
  modifier onlyowner() {
    if (msg.sender==owner) _
  }
}

contract mortal is abstract, owned {
  function kill() onlyowner {
    if (msg.sender == owner) suicide(owner);
  }
}

contract NameReg is abstract {
  function register(bytes32 name) {}
  function unregister() {}
  function addressOf(bytes32 name) constant returns (address addr) {}
  function nameOf(address addr) constant returns (bytes32 name) {}
  function kill() {}
}

contract nameRegAware is abstract {
  function nameRegAddress() returns (address) {
    return 0x985509582b2c38010bfaa3c8d2be60022d3d00da;
  }
  
  function named(bytes32 name) returns (address) {
    return NameReg(nameRegAddress()).addressOf(name);
  }
}

contract named is abstract, nameRegAware {
  function named(bytes32 name) {
    NameReg(nameRegAddress()).register(name);
  }
}

// contract with util functions
contract util is abstract {
  // Converts 'string' to 'bytes32'
  function s2b(string s) internal returns (bytes32) {
      bytes memory b = bytes(s);
      uint r = 0;
      for (uint i = 0; i < 32; i++) {
          if (i < b.length) {
              r = r | uint(b[i]);
          }
          if (i < 31) r = r * 256;
      }
      return bytes32(r);
  }
}

contract PriceFeedApi {
    
    // block time when the prices were last updated 
    uint public updateTime;

    // returns the price of an asset 
    // the price is represented as uint: (double price) * 1000000
    function getPrice(bytes32 symbol) constant returns(uint currPrice);  
    
    // returns the timestamp of the latest price for an asset 
    // normally this is the exchange timestamp, but if exchange 
    // doesn't supply such info the latest data retrieval time is returned
    function getTimestamp(bytes32 symbol) constant returns(uint timestamp);
}

contract PriceFeed is PriceFeedApi, owned, mortal, named("ether-camp/price-feed")  {
    
    mapping (bytes32 => uint) priceMap;     // symbol => price
    mapping (bytes32 => uint) timestampMap; // symbol => time
    
    mapping (address => uint) updaters; // who can update the price
    
    function PriceFeed() {
        addUpdater(msg.sender);
    }

    function update(bytes32[] symbols, uint[] newPrices, uint[] timestamps) {
        if (updaters[msg.sender] == 1) {
            updateTime = now;
            for (uint i = 0; i < symbols.length; i++) {
                priceMap[symbols[i]] = newPrices[i];
                timestampMap[symbols[i]] = timestamps[i];
            }
        }
    }
    
    function getPrice(bytes32 symbol) constant returns(uint currPrice) {
        return priceMap[symbol];
    }    
    
    function getTimestamp(bytes32 symbol) constant returns(uint timestamp) {
        return timestampMap[symbol];
    }
    
    function addUpdater(address updater) onlyowner {
        updaters[updater] = 1;
    }

    function removeUpdater(address updater) onlyowner {
        updaters[updater] = 0;
    }
}

