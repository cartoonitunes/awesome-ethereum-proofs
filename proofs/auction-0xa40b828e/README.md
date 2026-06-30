# SimpleAuction (Solidity-docs open auction) — Bytecode Proof
Reconstructed source for a Frontier/Homestead contract, compiled byte-exact with an era-correct soljson build.

| Field | Value |
|-------|-------|
| Address | `0xa40b828e0e0bdDeE4a75aA9DE359e731DcFc6Dcc` |
| Deployed | May 9, 2016 (block 1,488,297) |
| Compiler | soljson-v0.1.3+commit.028f561d |
| Optimizer | ON |
| Runtime | 534 bytes — **exact byte-for-byte match** |
| Creation | 597 bytes + two 32-byte ABI-encoded constructor args (`_biddingTime`, `_beneficiary`) — **exact byte-for-byte match** |
| Runtime SHA-256 | `4efe05e20a1db37bd2800fb1eb8b0e41fbc5bd319965a9b5e0dfd87f279fcac1` |
| Cluster | 1 deployment (unique); verified live via `eth_getCode` |
| Proved by | [@spiderwars](https://ethereumhistory.com/historian/spiderwars) |

## Scope
Exact match of **both the on-chain runtime and creation bytecode**, reproduced by the stock
`soljson-v0.1.3+commit.028f561d` build (optimizer ON; runtime + creation are byte-identical across
v0.1.3–v0.3.5). The deploy tx appends two 32-byte ABI-encoded constructor args
(`_biddingTime = 600` seconds, `_beneficiary = 0x59a0483901ea237de87b63c66f1b7cfeca6d8501`);
`target_creation.txt` is the full on-chain creation and `verify.js` asserts the compiled creation
equals it minus those 64 bytes.

This is an early variant of the **Simple Open Auction** from the Solidity documentation: bidders call
`bid()` (each new high bid refunds the previous `highestBidder` directly and fires
`HighestBidIncreased`), and `auctionEnd()` pays the contract balance to the `beneficiary` once, firing
`AuctionEnded`. This deployment differs from the canonical docs version in three ways recovered from the
bytecode: the bid refund and the beneficiary payout ignore `send()`'s return value, `auctionEnd()` sends
`this.balance` (not `highestBid`) and has no time guard (only a one-shot `ended` flag), and the contract
has an explicit reverting fallback (`function() { throw; }`). Event topics
`HighestBidIncreased(address,uint256)` = `f4757a49…` and `AuctionEnded(address,uint256)` = `daec4582…`
are present on-chain.

## Verify
```
node verify.js
```

## Files
- `auction.sol` — reconstructed source
- `target_runtime.txt` — on-chain runtime bytecode (`eth_getCode`)
- `target_creation.txt` — on-chain creation bytecode (deploy tx input)
- `addresses.json` — the deployment address
- `verify.js` — reproducible verification script
