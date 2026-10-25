// Submitted by EthereumHistory (ethereumhistory.com)
contract VerifySignature {
    address owner;

    event Log(byte[32] _data);

    function VerifySignature() {
        owner = msg.sender;
    }

    function parseBytes32(string _a) returns (bytes32) {
        bytes memory tmp = bytes(_a);
        uint iaddr = 0;
        for (uint i=0; i<32; i++){
            iaddr = iaddr * 256;
            uint j = i*2;
            uint8 b1 = uint8(tmp[j]);
            uint8 b2 = uint8(tmp[j+1]);
            if ((b1 >= 97)&&(b1 <= 102)) b1 -= 87;
            else if ((b1 >= 48)&&(b1 <= 57)) b1 -= 48;
            if ((b2 >= 97)&&(b2 <= 102)) b2 -= 87;
            else if ((b2 >= 48)&&(b2 <= 57)) b2 -= 48;
            iaddr += (b1*16+b2);
        }
        return bytes32(iaddr);
    }

    function kill() {
        if (msg.sender == owner) suicide(msg.sender);
    }

    function useBytes() returns (bytes) {
        return returnBytes("ciao");
    }

    function ciao() returns (byte) {
        byte[32] memory x;
        x[0] = 0x14;
        x[1] = 0x20;
        x[2] = 0x20;
        x[3] = 0x84;
        x[4] = 0x84;
        Log(x);
        return x[1];
    }

    function returnBytes(string _a) returns (bytes) {
        return bytes(_a);
    }

    function parse2() returns (bytes32) {
        bytes32 r = parseBytes32("036421f6eca2ef7a43ce0af4a150b933afb3cf0764323b8ff9ebfd4935fd86d436");
        return r;
    }


    function test() returns (address) {
        bytes32 a = parseBytes32("036421f6eca2ef7a43ce0af4a150b933afb3cf0764323b8ff9ebfd4935fd86d436");
        bytes1 v = 0x20;
        bytes32 r = parseBytes32("0b7effb7704f726bc64139753dc2d0a3929af2309dd2930ad7a722f5b214cf6e");
        bytes32 s = parseBytes32("73a461ce418e9e483f13a98c0cba5cddf07f647ea1d6ba2e88d494dfcd411c9c");
        bytes32 h = parseBytes32("58e2f335bbd6f2b0da93eae19342e7309654fbfeed9a214a1e5d835ac09cc226");
        return ecrecover(h, uint8(v), r, s);
    }

}
