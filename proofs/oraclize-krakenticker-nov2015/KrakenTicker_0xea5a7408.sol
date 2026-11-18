// Submitted by EthereumHistory (ethereumhistory.com)
contract OraclizeI {
    function query(uint timestamp, string datasource, string arg) returns (bytes32 id);
    function query(uint timestamp, string datasource, string arg1, string arg2) returns (bytes32 id);
    function getPrice(string datasource) returns (uint dsprice);
    function cb_address() returns (address);
}

contract OraclizeAddrResolverI {
    function getAddress() returns (address addr);
}

contract usingOraclize {
    OraclizeI oraclize;

    modifier oraclizeAPI {
        OraclizeAddrResolverI OAR = OraclizeAddrResolverI(0x1d11e5eae3112dbd44f99266872ff1d07c77dce8);
        oraclize = OraclizeI(OAR.getAddress());
        _
    }

    function oraclize_query(uint timestamp, string datasource, string arg) oraclizeAPI returns (bytes32 id) {
        oraclize.send(oraclize.getPrice.gas(200000)(datasource));
        oraclize.query(timestamp, datasource, arg);
    }

    function oraclize_query(uint timestamp, string datasource, string arg1, string arg2) oraclizeAPI returns (bytes32 id) {
        oraclize.send(oraclize.getPrice(datasource));
        oraclize.query(timestamp, datasource, arg1, arg2);
    }

    function oraclize_cbaddress() oraclizeAPI returns (address) {
        return oraclize.cb_address();
    }
}

contract KrakenTicker is usingOraclize {
    address owner;
    string public ETHXBT;
    function KrakenTicker() {
        owner = msg.sender;
        update();
    }
    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbaddress()) throw;
        ETHXBT = result;
        update();
    }
    function update() {
        oraclize_query(60, "URL", "json(https://api.kraken.com/0/public/Ticker?pair=ETHXBT).result.XETHXXBT.c.0");
    }
    function kill() {
        if (msg.sender == owner) suicide(msg.sender);
    }
}
