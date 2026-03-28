# ShippingEscrow Contract Verification

Bytecode verification proof for a shipping escrow contract with penalty system.

## Contract

| Field | Value |
|-------|-------|
| Address | `0x50fb8066db65333dcd07087263bdb534a2edbb59` |
| Deployed | Jan 9, 2016 (block 821,894) |
| Compiler | soljson-v0.1.5+commit.23865e39 |
| Optimizer | OFF |
| Runtime | 1155 bytes |
| Creation | 1955 bytes (+ 576 bytes constructor args) |
| Runtime SHA-256 | `12e587181858efb54f658a94048faadb31f77e09183b9491ca0d65d4822b39f0` |
| Creation SHA-256 | `51a5f27acf170bf6bb51509b5685b6b295ed48958010649aee7d081deeb17dd0` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Siblings

Same deployer created multiple escrow contracts on Jan 9-10, 2016:
- `0x47618f0CbA4E98886F169f2bD9E58F39b8f11b45` (2039B runtime, with public getters)
- `0xbfb62a95d7adc28d7e2af3b39ea7255b6922e668` (identical to 0x47618f)
- `0xaddDDbD21963Ff1E5619F8B168F804594Cd22b79` (identical to 0x47618f)

## Verification

```bash
node verify.js
```

The script downloads soljson-v0.1.5, compiles `ShippingEscrow.sol` with optimizer OFF, and compares the output byte-for-byte against the on-chain runtime and creation bytecode.

## Source

```solidity
contract ShippingEscrow {
    struct Seller { bytes32 name; bytes32 company; bytes32 id; address addr; }
    struct EscrowData {
        bytes32 cargoName; string description; uint8 quantity;
        uint penaltyActive; uint maxPenaltyDays;
        bytes32 originCountry; bytes32 destCountry;
        uint createdAt; uint shippedAt; uint paymentAmount; uint penaltyRate;
        string ipfsHash; uint8 isActive;
    }
    struct Buyer { bytes32 name; bytes32 company; bytes32 id; address addr; bool isPaid; }

    // 4 functions: ShippingEscrow (constructor), Escrow, ReleasePayment, Arrival, Agreement
    // 3 events: paymentReleased, delayedShipment, newAgreement
    // Full source in ShippingEscrow.sol
}
```
