# EtherPot (draft build) - Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x47f53b00f6d67da01dd67f1d6ea6e9fbe7416adf` |
| Deployed | August 21, 2015 (block 121824) |
| Deployer | `0xb735bf53abc79525a4f585a004a620d08cc66b27` |
| Deploy tx | `0x37b4a22ec59bad6152b5cf35be0583cc9b2ff17c3e2c5842f395064501da2fd2` |
| Compiler | soljson v0.1.1+commit.6ff4cd6 |
| Optimizer | OFF |
| Runtime | 2,227 bytes |
| Creation | 2,246 bytes (19 init + 2,227 runtime payload, 0 constructor args) |
| Runtime SHA-256 | `d680a92a9e11813a20b55289b5276095967b7d92eb76930f390365da83ae8b52` |
| Creation SHA-256 | `621530c5eb0e131d202d721df50e7f9bb1d4e9951e2bb705cc73fc49dcca4952` |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |

## Contract

This is an early development build of EtherPot, the decentralized lottery written by Aakil Fernandes and collaborators in the first weeks of the Ethereum Frontier network. Players buy tickets by sending ether to the contract. Each round lasts a fixed number of blocks, and the winner of a round is chosen from the blockhash of a block mined just after the round closes, which gives an on-chain source of randomness that no single party controls. To limit any one miner's incentive to manipulate that blockhash, a round's pot is split into subpots no larger than the block reward, so the value of grinding a result stays below the value of mining honestly. Each subpot is paid out independently by calling `cash`.

This particular deployment is not the version EtherPot shipped to the public. It was deployed on August 21, 2015, roughly three weeks after Frontier launched. It is a draft: `blocksPerRound` is set to 10 (about two and a half minutes) rather than the 6800 used in production, which is the kind of short round you choose to watch a full cycle complete while testing. It also stores tickets in a single `address[] tickets` array with one entry per ticket, and `calculateWinner` indexes that array directly. The published contract later refactored this into a deduplicated `buyers` array plus `ticketsCount` and a `ticketsCountByBuyer` mapping. The same deployer shipped the canonical public EtherPot at `0x539f2912831125c9b86451420bc0d37b219587f9` four days later, on August 25, 2015, with `blocksPerRound` of 6800 (and that contract did take real plays). The deployer address sent out 34 contract creations in this period, the signature of an iterate-and-redeploy development loop.

The contract was deployed and then abandoned. Its only transaction is the deploy itself; no tickets were ever bought and its balance has always been zero. It survives as an artifact of EtherPot's design before any source for it was made public.

## Verification

`node verify.js` downloads soljson v0.1.1+commit.6ff4cd6, recompiles `Lotto.sol` with the optimizer off, and compares the result byte-for-byte against both the on-chain runtime (`target_runtime.txt`) and the on-chain creation bytecode (`target_creation.txt`). The contract takes no constructor arguments, so the compiled creation output equals the on-chain creation exactly.

## Notes

- The match hinges on one fallback statement. The array is grown in bulk with `tickets.length = tickets.length + ticketsCount` and then filled in a loop, not pushed one element at a time. Writing it as `tickets.length += ticketsCount` collapses an extra storage-slot keccak recomputation that the on-chain code performs, leaving a 27-byte gap. The explicit `x = x + y` form reads and writes the slot as two separate accesses, which is what the deployed bytecode does.
- Guards use early `return`, and there are no `throw` statements or events in this build (zero LOG opcodes on chain).
- The winner is read straight out of the tickets array (`tickets[blockhash % tickets.length]`) with no buyer-accumulation loop, which is the structural tell that distinguishes this draft from the published EtherPot.

## Storage layout

`rounds` is a `mapping(uint => Round)` at slot 0. Each `Round` struct holds:

| Offset | Type | Name |
|--------|------|------|
| 0 | `address[]` | tickets |
| 1 | `uint` | pot |
| 2 | `mapping(uint => bool)` | isCashed |
