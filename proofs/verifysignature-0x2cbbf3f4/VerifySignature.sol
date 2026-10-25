// Submitted by EthereumHistory (ethereumhistory.com)
contract VerifySignature {
    address owner;

    function VerifySignature() {
        owner = msg.sender;
    }

    function log() returns (address) {
        address a = parseAddr("036421f6eca2ef7a43ce0af4a150b933afb3cf0764323b8ff9ebfd4935fd86d436");
        return a;
    }


    function log2() returns (bytes32) {
        bytes32 a = bytes32(parseAddr("73a461ce418e9e483f13a98c0cba5cddf07f647ea1d6ba2e88d494dfcd411c9c"));
        return a;
    }

    function test() returns (address) {
        address a = parseAddr("036421f6eca2ef7a43ce0af4a150b933afb3cf0764323b8ff9ebfd4935fd86d436");
        bytes1 v = bytes1(parseAddr("20"));
        bytes32 r = bytes32(parseAddr("0b7effb7704f726bc64139753dc2d0a3929af2309dd2930ad7a722f5b214cf6e"));
        bytes32 s = bytes32(parseAddr("73a461ce418e9e483f13a98c0cba5cddf07f647ea1d6ba2e88d494dfcd411c9c"));
        bytes32 h = bytes32(parseAddr("58e2f335bbd6f2b0da93eae19342e7309654fbfeed9a214a1e5d835ac09cc226"));
        return ecrecover(h, uint8(v), r, s);
    }

    function parseAddr(string _a) returns (address) {
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


    function kill() {
        if (msg.sender == owner) suicide(msg.sender);
    }



}
