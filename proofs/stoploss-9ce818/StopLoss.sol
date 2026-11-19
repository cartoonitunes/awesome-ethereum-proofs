// Submitted by EthereumHistory (ethereumhistory.com)
contract OraclizeI {
    function query(uint _timestamp, string _datasource, string _arg1, string _arg2) returns (bytes32 _id);
    function getPrice(string _datasource) returns (uint _dsprice);
    function cb_address() returns (address _cbAddress);
}
contract OraclizeAddrResolverI {
    function getAddress() returns (address _addr);
}
contract usingOraclize {
    address oraclize_addr = OraclizeAddrResolverI(0xda0181a763b533e532248f6ff859e564a470d9aa).getAddress();
    OraclizeI oraclize = OraclizeI(oraclize_addr);
}

contract StopLoss is usingOraclize {
    address public shapeshift_address;

    function StopLoss() {
        update();
    }

    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize.cb_address()) throw;
        bytes memory tmp = bytes(result);
        uint160 ishapeshift = 0;
        uint160 b1;
        uint160 b2;
        for (uint i=2; i<2+2*20; i+=2){
            ishapeshift *= 256;
            b1 = uint160(tmp[i]);
            b2 = uint160(tmp[i+1]);
            if ((b1 >= 97)&&(b1 <= 102)) b1 -= 87;
            else if ((b1 >= 48)&&(b1 <= 57)) b1 -= 48;
            if ((b2 >= 97)&&(b2 <= 102)) b2 -= 87;
            else if ((b2 >= 48)&&(b2 <= 57)) b2 -= 48;
            ishapeshift += (b1*16+b2);
        }
        shapeshift_address = address(ishapeshift);
    }

    function update() {
        oraclize_addr.send(oraclize.getPrice("URL"));
        oraclize.query(0, "URL", "json(https://shapeshift.io/sendamount).success.deposit", '{"pair": "eth_btc", "amount": "0.2", "withdrawal": "1AAcCo21EUc1jbocjssSQDzLna9Vem2UN5"}');
    }

    function kill(){
        suicide(msg.sender);
    }
}
