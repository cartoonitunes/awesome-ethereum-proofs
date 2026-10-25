// Submitted by EthereumHistory (ethereumhistory.com)
contract OraclizeAddrResolver {
    function OraclizeAddrResolver(){
        owner = msg.sender;
    }
    function setAddr(address newaddr){
        if (msg.sender != owner) throw;
        addr = newaddr;
    }
    function getAddress() returns (address oaddr){
        return addr;
    }
    address public addr;
    address owner;
}
