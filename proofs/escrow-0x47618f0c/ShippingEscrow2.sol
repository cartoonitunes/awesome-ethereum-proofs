contract ShippingEscrow2 {
    struct Seller {
        bytes32 name;
        bytes32 company;
        bytes32 id;
        address addr;
    }

    struct EscrowData {
        bytes32 cargoName;
        string description;
        bool quantity;
        uint penaltyActive;
        uint maxPenaltyDays;
        bytes32 originCountry;
        bytes32 destCountry;
        uint createdAt;
        uint shippedAt;
        uint paymentAmount;
        uint penaltyRate;
        string ipfsHash;
        bool isActive;
    }

    struct Buyer {
        bytes32 name;
        bytes32 company;
        bytes32 id;
        address addr;
        bool isPaid;
    }

    Seller public seller;
    EscrowData public cargo;
    Buyer public buyer;

    event paymentReleased(string message, uint amount);
    event delayedShipment(string message, uint penaltyDays);
    event newAgreement(string message, bytes32 sellerName, bytes32 buyerName);

    function ShippingEscrow2(
        bytes32 _sellerName,
        bytes32 _sellerCompany,
        bytes32 _sellerID,
        bytes32 _cargoName,
        string _description,
        bool _quantity,
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
        cargo.cargoName = _cargoName;
        cargo.description = _description;
        cargo.quantity = _quantity;
        cargo.penaltyActive = _penaltyActive;
        cargo.maxPenaltyDays = _maxPenaltyDays;
        cargo.originCountry = _originCountry;
        cargo.destCountry = _destCountry;
        cargo.shippedAt = _shippedAt;
        cargo.penaltyRate = _penaltyRate;
        cargo.ipfsHash = _ipfsHash;
        cargo.isActive = false;
    }

    function agreement(bytes32 _buyerName, bytes32 _buyerCompany, bytes32 _buyerID) {
        buyer.name = _buyerName;
        buyer.company = _buyerCompany;
        buyer.id = _buyerID;
        buyer.addr = msg.sender;
        cargo.paymentAmount = msg.value;
        buyer.isPaid = false;
        cargo.createdAt = block.timestamp;
        cargo.isActive = true;
        newAgreement("New Agreement between two Parties!", seller.name, buyer.name);
    }

    function escrow() {
        if (buyer.isPaid) throw;
        if (cargo.createdAt + 259200 >= block.timestamp) {
            releasePayment();
        }
    }

    function releasePayment() {
        if (buyer.isPaid) throw;
        seller.addr.send(cargo.paymentAmount);
        buyer.isPaid = true;
        paymentReleased("Payment released!", cargo.paymentAmount);
    }

    function arrival() {
        uint timeDiff = block.timestamp - cargo.shippedAt;
        uint daySeconds = 86400;
        uint numDays = 0;
        if (timeDiff >= daySeconds) {
            numDays = timeDiff / daySeconds;
            uint penalty = numDays * cargo.penaltyRate;
            delayedShipment("The shipment has arrived late. Delay penalty will be charged.", penalty);
        }
    }
}
