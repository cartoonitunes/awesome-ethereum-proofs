contract ShippingEscrow {
    struct Seller {
        bytes32 name;
        bytes32 company;
        bytes32 id;
        address addr;
    }

    struct EscrowData {
        bytes32 cargoName;
        string description;
        uint8 quantity;
        uint penaltyActive;
        uint maxPenaltyDays;
        bytes32 originCountry;
        bytes32 destCountry;
        uint createdAt;
        uint shippedAt;
        uint paymentAmount;
        uint penaltyRate;
        string ipfsHash;
        uint8 isActive;
    }

    struct Buyer {
        bytes32 name;
        bytes32 company;
        bytes32 id;
        address addr;
        bool isPaid;
    }

    Seller seller;
    EscrowData escrowData;
    Buyer buyer;

    event paymentReleased(string message, uint amount);
    event delayedShipment(string message, uint penaltyDays);
    event newAgreement(string message, bytes32 sellerName, bytes32 buyerName);

    function ShippingEscrow(
        bytes32 _sellerName,
        bytes32 _sellerCompany,
        bytes32 _sellerID,
        bytes32 _cargoName,
        string _description,
        uint8 _quantity,
        uint _penaltyActive,
        uint _maxPenaltyDays,
        bytes32 _originCountry,
        bytes32 _destCountry,
        uint _shippedAt,
        uint _penaltyRate,
        string _ipfsHash
    ) {
        seller.name = _sellerName;
        seller.company = _sellerCompany;
        seller.id = _sellerID;
        seller.addr = msg.sender;
        escrowData.cargoName = _cargoName;
        escrowData.description = _description;
        escrowData.quantity = _quantity;
        escrowData.penaltyActive = _penaltyActive;
        escrowData.maxPenaltyDays = _maxPenaltyDays;
        escrowData.originCountry = _originCountry;
        escrowData.destCountry = _destCountry;
        escrowData.shippedAt = _shippedAt;
        escrowData.penaltyRate = _penaltyRate;
        escrowData.ipfsHash = _ipfsHash;
        escrowData.isActive = 0;
    }

    function Escrow() {
        if (buyer.isPaid) throw;
        if (escrowData.createdAt + 259200 >= block.timestamp) {
            ReleasePayment();
        }
    }

    function ReleasePayment() {
        if (buyer.isPaid) throw;
        seller.addr.send(escrowData.paymentAmount);
        buyer.isPaid = true;
        paymentReleased("Payment released!", escrowData.paymentAmount);
    }

    function Arrival() {
        uint timeDiff = block.timestamp - escrowData.shippedAt;
        uint daySeconds = 86400;
        uint numDays = 0;
        if (timeDiff >= daySeconds) {
            numDays = timeDiff / daySeconds;
            uint penalty = numDays * escrowData.penaltyRate;
            delayedShipment("The shipment has arrived late. Delay penalty will be charged.", penalty);
        }
    }

    function Agreement(bytes32 _buyerName, bytes32 _buyerCompany, bytes32 _buyerID) {
        buyer.name = _buyerName;
        buyer.company = _buyerCompany;
        buyer.id = _buyerID;
        buyer.addr = msg.sender;
        escrowData.paymentAmount = msg.value;
        buyer.isPaid = false;
        escrowData.createdAt = block.timestamp;
        escrowData.isActive = 1;
        newAgreement("New Agreement between two Parties!", seller.name, buyer.name);
        Escrow();
    }
}
