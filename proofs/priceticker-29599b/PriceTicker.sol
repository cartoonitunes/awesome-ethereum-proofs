// Submitted by EthereumHistory (ethereumhistory.com)
contract Oraclize {
    function query(uint timestamp, string datasource, string arg) returns (bytes32 id);
    function cb_address() returns (address _cbAddress);
}

contract PriceTicker {
    Oraclize oraclize = Oraclize(0xfa5186a0af28454ba31bfc7b1100880b01b2051d);
    string public ETHXBT = "?????";

    function PriceTicker() {
        update();
    }

    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize.cb_address()) throw;
        ETHXBT = result;
        update();
    }

    function update() {
        bytes32 myid = oraclize.query(60, "URL", "json(https://api.kraken.com/0/public/Ticker?pair=ETHXBT).result.XETHXXBT.c.0");
    }

    function kill() {
        suicide(0x0047a8033cc6d6ca2ed5044674fd421f44884de8);
    }
}
