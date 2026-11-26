// Obama Oracle by Thomas Bertani (Oraclize), 0x66c67a9e26f5f1bf04c0e8797a4ae2f01db5785a
// (byte-identical copies at 0x593f6c40... and 0x29b46a3f...)
// Block 422591, 2015-10-22. soljson v0.1.6, optimizer OFF.

contract OraclizeI {
    function query(uint timestamp, string datasource, string arg) returns (uint);
}

contract ObamaOracle {
    address constant owner    = 0x0047a8033cc6d6ca2ed5044674fd421f44884de8;
    address constant cbProxy  = 0x26588a9301b0428d95e6fc3a5024fce8bec12d51;
    OraclizeI constant oracle = OraclizeI(0xd4cb3eb955e03ac64644678fd3d6a7f3104ee70d);

    uint public fOjqVd = 5; // original name unknown: 0x14ff041d, no match for names up to 6 chars; collision name used

    function ObamaOracle() {
        OraclizeI o = oracle;
        o.query(0, "WolframAlpha", "president of the United States");
    }

    // Canonical 2015 Oraclize stringutils indexOf
    function indexOf(string _haystack, string _needle) returns (int) {
        bytes memory h = bytes(_haystack);
        bytes memory n = bytes(_needle);
        if (h.length < 1 || n.length < 1 || (n.length > h.length))
            return -1;
        else if (h.length > (2**128 - 1))
            return -1;
        else {
            uint subindex = 0;
            for (uint i = 0; i < h.length; i++) {
                if (h[i] == n[0]) {
                    subindex = 1;
                    while (subindex < n.length && (i + subindex) < h.length && h[i + subindex] == n[subindex]) {
                        subindex++;
                    }
                    if (subindex == n.length)
                        return int(i);
                }
            }
            return -1;
        }
    }

    function callback() {
        if (indexOf(string(msg.data), "Obama") == -1) suicide(owner);
        OraclizeI o = oracle;
        o.query(0, "WolframAlpha", "president of the United States");
    }

    function() {
        if (msg.sender == cbProxy) callback();
    }

    function kill() {
        if (msg.sender == owner) suicide(owner);
    }
}
