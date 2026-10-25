// Submitted by EthereumHistory (ethereumhistory.com)
//
// The contract to store addresses of others, including the main storage and verifiers.
//

contract Lookup {
  address owner;

  modifier owneronly { if (msg.sender == owner) _ }

  function setOwner(address addr) owneronly {
    owner = addr;
  }

  function Lookup() {
    owner = msg.sender;
  }

  address public addrStorage;
  function setStorage(address addr) owneronly {
    addrStorage = addr;
  }


  uint8 public accountProvider_ALL = 0;
  uint8 public accountProvider_TWITTER = 1;
  uint8 public accountProvider_FACEBOOK = 2;
  uint8 public accountProvider_GITHUB = 3;

  mapping(uint8 => address) public accountProviders;
  function setAccountProvider(uint8 accountProvider, address addr) owneronly {
    accountProviders[accountProvider] = addr;
  }
}

// <ORACLIZE_API>
/*
Copyright (c) 2015 Oraclize srl, Thomas Bertani



Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:



The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.



THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

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

contract administrated is abstract, owned {
    mapping (address => uint) admins;

    function addAdministrator(address admin) onlyowner {
        admins[admin] = 1;
    }

    function removeAdministrator(address admin) onlyowner {
        admins[admin] = 0;
    }

    modifier onlyadmin() {
        if (msg.sender == owner || admins[msg.sender] == 1) _
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
    return 0x084f6a99003dae6d3906664fdbf43dd09930d0e3;
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


contract OraclizeI is abstract {
    address public cbAddress;
    function query(uint _timestamp, string _datasource, string _arg) returns (bytes32 _id);
    function query_withGasLimit(uint _timestamp, string _datasource, string _arg, uint _gaslimit) returns (bytes32 _id);
    function query2(uint _timestamp, string _datasource, string _arg1, string _arg2) returns (bytes32 _id);
    function query2_withGasLimit(uint _timestamp, string _datasource, string _arg1, string _arg2, uint _gaslimit) returns (bytes32 _id);
    function getPrice(string _datasource) returns (uint _dsprice);
    function getPrice(string _datasource, uint gaslimit) returns (uint _dsprice);
    function useCoupon(string _coupon);
    function setProofType(byte _proofType);
}
contract OraclizeAddrResolverI is abstract {
    function getAddress() returns (address _addr);
}
contract usingOraclize {
    uint constant day = 60*60*24;
    uint constant week = 60*60*24*7;
    uint constant month = 60*60*24*30;
    byte constant proofType_NONE = 0x00;
    byte constant proofType_TLSNotary = 0x10;
    byte constant proofStorage_IPFS = 0x01;

    OraclizeI oraclize;
    modifier oraclizeAPI {
        OraclizeAddrResolverI OAR = OraclizeAddrResolverI(0x1d11e5eae3112dbd44f99266872ff1d07c77dce8);
        oraclize = OraclizeI(OAR.getAddress());
        _
    }
    modifier coupon(string code){
        OraclizeAddrResolverI OAR = OraclizeAddrResolverI(0x1d11e5eae3112dbd44f99266872ff1d07c77dce8);
        oraclize = OraclizeI(OAR.getAddress());
        oraclize.useCoupon(code);
        _
    }
    function oraclize_query(string datasource, string arg) oraclizeAPI internal returns (bytes32 id){
        return oraclize.query.value(oraclize.getPrice(datasource))(0, datasource, arg);
    }
    function oraclize_query(uint timestamp, string datasource, string arg) oraclizeAPI internal returns (bytes32 id){
        return oraclize.query.value(oraclize.getPrice(datasource))(timestamp, datasource, arg);
    }
    function oraclize_query(uint timestamp, string datasource, string arg, uint gaslimit) oraclizeAPI internal returns (bytes32 id){
        return oraclize.query_withGasLimit.value(oraclize.getPrice(datasource, gaslimit))(timestamp, datasource, arg, gaslimit);
    }
    function oraclize_query(string datasource, string arg, uint gaslimit) oraclizeAPI internal returns (bytes32 id){
        return oraclize.query_withGasLimit.value(oraclize.getPrice(datasource, gaslimit))(0, datasource, arg, gaslimit);
    }
    function oraclize_query(string datasource, string arg1, string arg2) oraclizeAPI internal returns (bytes32 id){
        return oraclize.query2.value(oraclize.getPrice(datasource))(0, datasource, arg1, arg2);
    }
    function oraclize_query(uint timestamp, string datasource, string arg1, string arg2) oraclizeAPI internal returns (bytes32 id){
        return oraclize.query2.value(oraclize.getPrice(datasource))(timestamp, datasource, arg1, arg2);
    }
    function oraclize_query(uint timestamp, string datasource, string arg1, string arg2, uint gaslimit) oraclizeAPI internal returns (bytes32 id){
        return oraclize.query2_withGasLimit.value(oraclize.getPrice(datasource, gaslimit))(timestamp, datasource, arg1, arg2, gaslimit);
    }
    function oraclize_query(string datasource, string arg1, string arg2, uint gaslimit) oraclizeAPI internal returns (bytes32 id){
        return oraclize.query2_withGasLimit.value(oraclize.getPrice(datasource, gaslimit))(0, datasource, arg1, arg2, gaslimit);
    }
    function oraclize_cbAddress() oraclizeAPI internal returns (address){
        return oraclize.cbAddress();
    }
    function oraclize_setProof(byte proofP) oraclizeAPI {
        return oraclize.setProofType(proofP);
    }



    function parseAddr(string _a) internal returns (address){
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i=2; i<2+2*20; i+=2){
            iaddr *= 256;
            b1 = uint160(tmp[i]);
            b2 = uint160(tmp[i+1]);
            if ((b1 >= 97)&&(b1 <= 102)) b1 -= 87;
            else if ((b1 >= 48)&&(b1 <= 57)) b1 -= 48;
            if ((b2 >= 97)&&(b2 <= 102)) b2 -= 87;
            else if ((b2 >= 48)&&(b2 <= 57)) b2 -= 48;
            iaddr += (b1*16+b2);
        }
        return address(iaddr);
    }


    function strCompare(string _a, string _b) internal returns (int) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
   } 

    function indexOf(string _haystack, string _needle) internal returns (int)
    {
    	bytes memory h = bytes(_haystack);
    	bytes memory n = bytes(_needle);
    	if(h.length < 1 || n.length < 1 || (n.length > h.length)) 
    		return -1;
    	else if(h.length > (2**128 -1))
    		return -1;									
    	else
    	{
    		uint subindex = 0;
    		for (uint i = 0; i < h.length; i ++)
    		{
    			if (h[i] == n[0])
    			{
    				subindex = 1;
    				while(subindex < n.length && (i + subindex) < h.length && h[i + subindex] == n[subindex])
    				{
    					subindex++;
    				}	
    				if(subindex == n.length)
    					return int(i);
    			}
    		}
    		return -1;
    	}	
    }

    function strConcat(string _a, string _b) internal returns (string) {
        bytes memory ba = bytes(_a);
        bytes memory bb = bytes(_b);
        bytes memory bc = "                                                                                                                                                                                                                              ";
        uint k = 0;
        for (uint i = 0; i < ba.length; i ++){
            bc[k] = ba[i];
            k++;
        }
        for (i = 0; i < bb.length; i ++){
            bc[k] = bb[i];
            k++;
        }
        for (i = k; i < bc.length; i ++){
            bc[i] = 0;
        }
        return string(bc);
    }


    // parseInt
    function parseInt(string _a) internal returns (uint) {
        bytes memory bresult = bytes(_a);
        uint mint = 0;
        for (uint i=0; i<bresult.length; i++){
            if ((bresult[i] >= 48)&&(bresult[i] <= 57)){
               mint *= 10;
               mint += uint(bresult[i]) - 48;
            } else break;
        }
       return mint;
    }

    // parseInt(parseFloat*10^_b)
    function parseInt(string _a, uint _b) internal returns (uint) {
        bytes memory bresult = bytes(_a);
        uint mint = 0;
        bool decimals = false;
        for (uint i=0; i<bresult.length; i++){
            if ((bresult[i] >= 48)&&(bresult[i] <= 57)){
                if (decimals){
                   if (_b == 0) break;
                    else _b--;
                }
                mint *= 10;
                mint += uint(bresult[i]) - 48;
            } else if (bresult[i] == 46) decimals = true;
        }
        return mint;
    }
    



}
// </ORACLIZE_API>


contract accountProviderBase is abstract, usingOraclize {
  function nibbleToChar(uint nibble) internal returns (uint ret) {
    if (nibble > 9)
      return nibble + 87; // nibble + 'a'- 10
    else
      return nibble + 48; // '0'
  }

  // basically this is an int to hexstring function, but limited to 160 bits
  // FIXME: could be much simpler if we have a simple way of converting bytes32 to bytes or string
  function addressToBytes(address _address) internal returns (bytes) {
    uint160 tmp = uint160(_address);

    // 40 bytes of space, but actually uses 64 bytes
    string memory holder = "                                              ";
    bytes memory ret = bytes(holder);

    // NOTE: this is written in an expensive way, as out-of-order array access
    //       is not supported yet, e.g. we cannot go in reverse easily
    //       (or maybe it is a bug: https://github.com/ethereum/solidity/issues/212)
    uint j = 0;
    for (uint i = 0; i < 20; i++) {
      uint _tmp = tmp / (2 ** (8*(19-i))); // shr(tmp, 8*(19-i))
      uint nb1 = (_tmp / 0x10) & 0x0f;     // shr(tmp, 8) & 0x0f
      uint nb2 = _tmp & 0x0f;
      ret[j++] = byte(nibbleToChar(nb1));
      ret[j++] = byte(nibbleToChar(nb2));
    }

    return ret;
  }

  // To be implemented by the provider
  function verify(bytes32 id, string userId, string proofLocation);
  function score(bytes32 id, string userId);
}


contract Storage {
  Lookup lookup;

  address owner;

  modifier owneronly { if (msg.sender == owner) _ }

  function setOwner(address addr) owneronly {
    owner = addr;
  }

  function Storage() {
    owner = msg.sender;
  }

  function setLookup(address addr) owneronly {
    lookup = Lookup(addr);
  }

  struct Account {
    bool verified;
    uint8 accountProvider;
    string userId;
    bytes32 ipfsProof;
    uint24 score; // fits 0..1000000 (where 0 means no score yet, while >1 is a score)
  }

  struct Person {
    bytes32 id;
    address[] ethaddrs; // not yet populated
    mapping (uint8 => Account) accounts;
    mapping (bytes32 => bytes) extraDataBytes; // unverified data
    mapping (bytes32 => uint) extraDataUnit; // unverified data
  }

  // map unique id to person
  mapping (bytes32 => Person) public persons;

  // quick lookup index based on ethereum addresses
  mapping (address => bytes32) public addressToPersonId;

  // well, this can be removed if we assume id != 0
  mapping (address => bool) public addressPresent;

  function bindEthereumAddress(address addr, bytes32 id) internal {
    addressPresent[addr] = true;
    addressToPersonId[addr] = id;
    // FIXME: amend person.ethaddrs too
  }

  function unbindEthereumAddress(address addr, bytes32 id) internal {
    delete addressPresent[addr];
    delete addressToPersonId[addr];
    // FIXME: amend person.ethaddress too
  }

  // For methods which needs to come from a registered user
  modifier useronly {
    if (!addressPresent[msg.sender])
      throw;
    _
  }

  // Register a new user
  function register() returns (bytes32 id) {
    // is it already set up?
    if (addressPresent[msg.sender])
      throw;

    // create new record
    Person memory person;
    id = person.id = sha3(msg.sender, block.number);

    // set up mappings
    persons[id] = person;
    bindEthereumAddress(msg.sender, id);
  }

  // add new ethereum address
  function linkAddress(address addr) useronly {
    if (addressPresent[addr])
      throw; // already linked

    bindEthereumAddress(addr, addressToPersonId[msg.sender]);
  }

  // remove ethereum link
  function unlinkAddress(address addr) useronly {
    bytes32 id = addressToPersonId[addr];

    // does the userid of `addr` belongs to the sender?
    if (addressToPersonId[msg.sender] != id)
      throw;

    // FIXME: check if its the only address linked and reject if it is

    unbindEthereumAddress(addr, id);
  }

  // Start the verification process, call up the actual verifier and expect an answer in `updateAccount`
  function linkAccount(uint8 accountProvider, string userId, string proofLocation) useronly {
    bytes32 id = addressToPersonId[msg.sender];
    Person person = persons[id];

    // Prepare new account for the user, set it to non-verified
    Account memory account;
    account.verified = false;
    account.accountProvider = accountProvider;
    account.userId = userId;
    person.accounts[accountProvider] = account;

    accountProviderBase(lookup.accountProviders(accountProvider)).verify(id, userId, proofLocation);
  }

  // Internal function, only accountProviders can call this
  function updateAccount(uint8 accountProvider, bytes32 id, bool result, bytes32 ipfsProof) {
    if (msg.sender != lookup.accountProviders(accountProvider))
      throw;

    Person person = persons[id];
    // This ID is not in the system yet
    if (person.id != id)
      throw; // FIXME: throw?

    // Update the account with the verification result
    Account account = person.accounts[accountProvider];
    // This verification wasn't initiated from Storage
    if (account.accountProvider == 0)
      throw; // FIXME: throw?

    account.verified = result;
    account.ipfsProof = ipfsProof;
    person.accounts[accountProvider] = account; // FIXME: is this needed? I don't think its needed as above is not memory? I think it's already done automatically being a reference
  }

  function getScore(uint8 accountProvider, bytes32 id) public returns (uint24) {
    Person person = persons[id];
    // This ID is not in the system yet
    if (person.id != id)
      throw; // FIXME: throw?

    // Update the account with the verification result
    Account account = person.accounts[accountProvider];
    // This verification wasn't initiated from Storage
    if (account.accountProvider == 0)
      throw; // FIXME: throw?

    return account.score;
  }

  // Internal function, only accountProviders can call this. It updates the score
  function updateScore(uint8 accountProvider, bytes32 id, uint24 score) {
    if (msg.sender != lookup.accountProviders(accountProvider))
      throw;

    Person person = persons[id];
    // This ID is not in the system yet
    if (person.id != id)
      throw; // FIXME: throw?

    Account account = person.accounts[accountProvider];
    // The account isn't created yet
    if (account.accountProvider == 0)
      throw; // FIXME: throw?

    account.score = score;
    person.accounts[accountProvider] = account; // FIXME: is this needed? I don't think its needed as above is not memory? I think it's already done automatically being a reference
  }

  // Initiate recalculation of a score
  function refreshScore(uint8 accountProvider, bytes32 id) {
    Person person = persons[id];
    // This ID is not in the system yet
    if (person.id != id)
      throw; // FIXME: throw?

    Account account = person.accounts[accountProvider];
    // The account isn't created yet
    if (account.accountProvider == 0)
      throw; // FIXME: throw?

    accountProviderBase(lookup.accountProviders(accountProvider)).score(id, account.userId);
  }
}

