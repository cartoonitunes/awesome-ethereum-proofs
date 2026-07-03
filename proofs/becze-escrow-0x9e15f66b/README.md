# Time-locked escrow (0x9e15f66b…) — a day-one Martin Becze contract

Deployed by **Martin Becze** (`0xcd063b3081ea55535e5b60a21eff7f14e785a877`), an early Ethereum
Foundation developer, on **2015-08-11 14:42:52 UTC** — block **69,444**, twelve days into
Frontier. It was **funded with 20 ETH in its creation transaction**, a substantial sum for the
era, marking it as a functional deposit/escrow rather than a throwaway test.

**Runtime and creation bytecode both reproduce byte-for-byte exactly.**

| Field | Value |
|-------|-------|
| Address | `0x9e15f66b34edc3262796ef5e4d27139c931223f0` |
| Deployed | 2015-08-11 14:42:52 UTC |
| Block | 69,444 |
| Deployer | `0xcd063b3081ea55535e5b60a21eff7f14e785a877` (Martin Becze) |
| Creation tx | `0xba5d15e44b4967a6b103d61f69140722e77d7760a1ccdc7f1fe5599678745461` |
| Runtime | 440 bytes — **EXACT match** |
| Creation | 587 bytes (+ 32-byte constructor arg) — **EXACT match** |
| Language | Solidity |
| Compiler | **soljson v0.1.1+commit.6ff4cd6**, optimizer **OFF** |
| Runtime SHA-256 | `4a04e18c229594ad2c6f5829e03984661f10fd9706c28a58031551bf8ef1cda7` |

## What it is

A two-party, time-locked escrow. The constructor records the deployer as `owner`, takes one
argument (`recipient`), and sets a release deadline **5 days out** (`now + 432000`). A single
callable function, `requestEther(uint amount)` (selector `0x55c87eb0`), moves funds to `owner`:

```solidity
contract Escrow {
    address owner;
    address recipient;
    uint releaseTime;
    function Escrow(address _recipient) {
        owner = msg.sender;
        recipient = _recipient;
        releaseTime = now + 432000;      // 5 days
    }
    function requestEther(uint amount) {
        if (msg.sender == owner && block.timestamp > releaseTime)
            owner.send(amount);          // owner can pull only after the timelock
        if (msg.sender == recipient)
            owner.send(amount);          // the counterparty can release at any time
    }
}
```

Both paths send **to `owner`**: the owner may withdraw only after the 5-day deadline, while the
designated `recipient` (constructor arg `0x03c4c03f163d51105bbc0e1a63077cb04210aa83`) can release
funds to the owner at any time. The `&&` short-circuit and the `PUSH2 0x0100 EXP` address masking
are the fingerprints of unoptimized v0.1.1 codegen; the `6000357c01…9004` dispatcher confirms
optimizer OFF.

## Verify

```bash
npm install solc@0.4.26
node verify.js   # → ✅ EXACT MATCH  (creation bytecode, excl. 32-byte constructor arg)
```

`constructor_arg.txt` holds the ABI-encoded `recipient` appended to the on-chain init.

## Attribution

Reconstructed by [Ethereum History](https://ethereumhistory.com). Contract page:
https://ethereumhistory.com/contract/0x9e15f66b34edc3262796ef5e4d27139c931223f0
