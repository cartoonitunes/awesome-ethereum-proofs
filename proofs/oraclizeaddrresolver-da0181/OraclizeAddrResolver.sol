// Submitted by EthereumHistory (ethereumhistory.com)
contract OraclizeAddrResolver {
    function OraclizeAddrResolver(){
        owner = msg.sender;
    }
    address public addr;
    function getAddress() returns (address oaddr){
        return oaddr;
    }
    function setAddr(address newaddr){
        if (msg.sender != owner) throw;
        addr = newaddr;
    }
    address owner;
}
