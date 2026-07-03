# Escrow (0x139a5a08)

| Field | Value |
|-------|-------|
| Address | `0x139a5a0812bfc9b3d9234c9fd2d8c5d790f71e18` |
| Deployed | Oct 30, 2016 |
| Deployer | Vitalik Buterin (`0x1db3439a22ee7c4d034e9b26437d3960b5af0517`) |
| Compiler | solc 0.4.2+commit.af6afb04 (optimizer OFF) |
| Runtime | 695 bytes |
| Verification | `exact_bytecode_match` — byte-for-byte (Sourcify runtime match) |

A minimal two-party escrow with an arbitrator. The buyer deploys, naming a seller and an
arbitrator. Funds held by the contract are released to the seller by `finalize()` (callable by
buyer or arbitrator) or returned to the buyer by `refund()` (callable by seller or arbitrator).

This contract is **byte-for-byte identical** to the verified sibling
[`0x9b27a23006b6612b2dfc840d0a25f4e347121d21`](https://www.ethereumhistory.com/contract/0x9b27a23006b6612b2dfc840d0a25f4e347121d21).
It is verified on Sourcify (chain 1, runtime match).

## Source

```solidity
contract Escrow {
    address seller;
    address buyer;
    address arbitrator;

    function Escrow(address _seller, address _arbitrator) {
        seller = _seller;
        arbitrator = _arbitrator;
        buyer = msg.sender;
    }

    function finalize() {
        if (msg.sender == buyer || msg.sender == arbitrator)
            seller.send(this.balance);
    }

    function refund() {
        if (msg.sender == seller || msg.sender == arbitrator)
            buyer.send(this.balance);
    }
}
```

## Verification

```bash
solc-select use 0.4.2
solc --bin-runtime Escrow.sol
```

Reproduces the 695-byte runtime in `onchain_runtime.hex`.

- runtime sha256 `2e7cf2ed0a6804c2d1dc7b34d49ae1aa0f17a07b8ffd920f1676be79ac9a6b53`
- Sourcify: `https://sourcify.dev/#/lookup/0x139a5a0812bfc9b3d9234c9fd2d8c5d790f71e18`
