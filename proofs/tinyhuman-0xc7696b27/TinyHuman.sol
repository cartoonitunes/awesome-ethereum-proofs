// Submitted by EthereumHistory (ethereumhistory.com)
contract TinyHuman {
    uint public constant TOTALSHARES = 1000000;
    uint public constant USDDOWNLOADPRICE = 60;
    uint public constant USDSTEMPRICE = 4500;

    mapping (bytes32 => mapping (bytes32 => uint)) public shares;
    address public admin;
    address public oracle;
    address public BLOCKAPPS;
    address public BOARD_1;
    address public BOARD_2;
    address public BOARD_3;
    mapping (address => address) approvals;
    uint public usdEthPrice;
    uint public downloadPriceInWei;
    uint public stemPriceInWei;
    uint public priceLastUpdated;

    struct Owner { address addr; bytes32 name; }
    Owner[] public owners;
    uint public ownersCount;

    struct Tx { address buyer; bytes32 collectionId; uint blockNumber; uint value; uint usdEthPrice; }
    Tx[] public txLog;
    uint public txCount;

    struct Transfer { address to; bytes32 collectionId; uint blockNumber; }
    Transfer[] public transferLog;
    uint public transferCount;

    event purchasedRight(address indexed buyer, bytes32 collectionId);
    event transferredRight(address indexed to, bytes32 collectionId);

    function TinyHuman(address board1, address board2, address board3) {
        admin = msg.sender;
        BOARD_1 = board1;
        BOARD_2 = board2;
        BOARD_3 = board3;
        owners.length = 8;
        owners[0] = Owner(msg.sender, "Imogen Heap");
        owners[1] = Owner(msg.sender, "Stephanie Appelhans");
        owners[2] = Owner(msg.sender, "Diego Romano");
        owners[3] = Owner(msg.sender, "Yasin Gundisch");
        owners[4] = Owner(msg.sender, "Hoang Nguyen");
        owners[5] = Owner(msg.sender, "Simon Minshall");
        owners[6] = Owner(msg.sender, "David Horwich");
        owners[7] = Owner(msg.sender, "Simon Heyworth");
        ownersCount = 8;
    }

    function setBlockappsAddr(address a) returns (bool) {
        if (admin == msg.sender) {
            BLOCKAPPS = a;
            return true;
        }
    }

    function setNewAdmin(address a) returns (bool) {
        if (admin == msg.sender) {
            admin = a;
            return true;
        }
    }

    function setNewOracle(address a) returns (bool) {
        if (admin == msg.sender) {
            oracle = a;
            return true;
        }
    }

    function setPrice(uint price) returns (bool) {
        if (oracle == msg.sender) {
            usdEthPrice = price;
            downloadPriceInWei = USDDOWNLOADPRICE * 1000000000000000000 / usdEthPrice;
            stemPriceInWei = USDSTEMPRICE * 1000000000000000000 / usdEthPrice;
            priceLastUpdated = block.timestamp;
            return true;
        }
    }

    function setAddr(uint id, address a) returns (bool) {
        if (admin == msg.sender) {
            owners[id].addr = a;
            return true;
        }
    }

    function changeAdminFromBoard(address newAdmin) returns (bool) {
        if (msg.sender == BOARD_1) approvals[msg.sender] = newAdmin;
        else if (msg.sender == BOARD_2) approvals[msg.sender] = newAdmin;
        else if (msg.sender == BOARD_3) approvals[msg.sender] = newAdmin;
        if (approvals[BOARD_1] == newAdmin && approvals[BOARD_2] == newAdmin && approvals[BOARD_3] == newAdmin) {
            admin = newAdmin;
            return true;
        }
    }

    function purchase(bytes32 collectionId) returns (bool) {
        if (collectionId == "DOWNLOAD") {
            if (msg.value < downloadPriceInWei) { msg.sender.send(msg.value); return false; }
        } else if (collectionId == "STEM") {
            if (msg.value < stemPriceInWei) { msg.sender.send(msg.value); return false; }
        } else {
            msg.sender.send(msg.value);
            return false;
        }
        txLog.length = txCount + 1;
        txLog[txCount] = Tx(msg.sender, collectionId, block.number, msg.value, usdEthPrice);
        txCount++;
        uint i = 0;
        while (i < ownersCount) {
            if (shares[owners[i].name][collectionId] > 0) {
                owners[i].addr.send(msg.value * shares[owners[i].name][collectionId] / TOTALSHARES);
            }
            i++;
        }
        purchasedRight(msg.sender, collectionId);
        return true;
    }

    function transferRightIfApproved(address to, bytes32 collectionId) {
        if (msg.sender == BLOCKAPPS) {
            transferLog.length = transferCount + 1;
            transferLog[transferCount] = Transfer(to, collectionId, block.number);
            transferCount++;
            transferredRight(to, collectionId);
        }
    }
}
