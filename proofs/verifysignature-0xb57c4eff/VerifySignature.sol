// Submitted by EthereumHistory (ethereumhistory.com)
contract VerifySignature {
    address owner;

    function VerifySignature() {
        owner = msg.sender;
    }

    function ciao() returns (byte[32]) {
        byte[32] memory x;
        x[0] = 0x14;
        x[1] = 0x20;
        return x;
    }

    function useBytes() returns (bytes) {
        return returnBytes("ciao");
    }

    function parseBytes32(string _a) returns (byte[32]) {
        bytes memory tmp = bytes(_a);
        byte[32] memory res;
        uint i = 0;
        for (i=0; i<2*32; i++){
            uint j = i*2;
            uint8 b1 = uint8(tmp[j]);
            uint8 b2 = uint8(tmp[j+1]);
            if ((b1 >= 97)&&(b1 <= 102)) b1 -= 87;
            else if ((b1 >= 48)&&(b1 <= 57)) b1 -= 48;
            if ((b2 >= 97)&&(b2 <= 102)) b2 -= 87;
            else if ((b2 >= 48)&&(b2 <= 57)) b2 -= 48;
            res[i] = byte(b1*16+b2);
        }
        return res;
    }

    function kill() {
        if (msg.sender == owner) suicide(msg.sender);
    }

    function returnBytes(string _a) returns (bytes) {
        return bytes(_a);
    }

    function parse() returns (byte[32]) {
        return parseBytes32("036421f6eca2ef7a43ce0af4a150b933afb3cf0764323b8ff9ebfd4935fd86d436");
    }

}
