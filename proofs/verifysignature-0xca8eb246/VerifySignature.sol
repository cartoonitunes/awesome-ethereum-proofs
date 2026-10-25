// Submitted by EthereumHistory (ethereumhistory.com)
contract VerifySignature {
    address owner;

    function VerifySignature() {
        owner = msg.sender;
    }

    function useBytes() returns (bytes) {
        return returnBytes("ciao");
    }

    function log() returns (bytes) {
        bytes memory b = parseBytes("0336");
        return b;
    }

    function parseBytes(string _a) returns (bytes) {
        bytes memory tmp = bytes(_a);
        bytes memory res;
        for (uint i=0; i<tmp.length; i++){
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

    function returnBytes(string _a) returns (bytes) {
        return bytes(_a);
    }

    function kill() {
        if (msg.sender == owner) suicide(msg.sender);
    }

}
