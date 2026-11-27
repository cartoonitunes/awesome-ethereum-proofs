# NAV Tracker - Bytecode Verification Proof

| Field | Value |
|-------|-------|
| Address | `0x93fc50922d4ab63300abf7378a5b9196c2a15da1` |
| Deployed | February 23, 2016 (block 1046601) |
| Deployer | `0x8b9346aa412b52954b5138dbb72adab97273766e` |
| Deploy tx | `0x7bf019a073f97951040d69887bbf442bf044872bc522609a6dfa9fda763893f9` |
| Compiler | `soljson-v0.2.2+commit.ef92f566` |
| Optimizer | ON |
| Runtime | 1,845 bytes |
| Creation | 2337 bytes (364 bytes init, 128 bytes constructor args) |
| Runtime SHA-256 | `7a9cbf87653fd22282a0b6d6403e002c23a2b3a554ea0d63c1f6805c10cb2d91` |
| Creation SHA-256 | `8611e9b7ab958e489660a7b1a7ad07693b9c501a360e43f5f7551b8b8a68445a` |
| Byte match | - |
| Proved by | [@lecram2025](https://ethereumhistory.com/historian/lecram2025) |


## Contract

A fund NAV (net asset value) tracker, version "1.0.1", deployed on February 23, 2016 (block 1,046,601) by 0x8b9346aa412b52954b5138dbb72adab97273766e. It keeps two on-chain logs for a fund: a NAV price history, appended by setNav(uint32) with a millisecond timestamp, and a trade history, appended by addHistory(address,bool,uint8,uint32,uint64,uint32), where the address is the order contract that carried the trade. get() returns the latest NAV and its timestamp, the version string, the owner, the fund id and the fund's daily trading window (opening and cut-off, in seconds after midnight). kill() self-destructs the contract and has no access control.

This instance was deployed with an initial NAV of 2555, fund id 0 and a trading window of 28800 to 68400 (08:00 to 19:00), and was never used afterwards. A byte-identical instance at 0x41ea839c0e1e562d60bf9675bf74a9caa6a7b80c was used in May and June 2016: on May 24, May 30 and June 7 it recorded a new NAV followed by a BUY trade, each trade pointing at a version "1.0.2" order contract (the Trade contracts this developer's platform used for the subscription lifecycle).

## Verification

`node verify.js` downloads soljson v0.2.2+commit.ef92f566, compiles `Nav.sol` six times in one session and prints how far each compile is from the on-chain runtime (117, 117, 117, 117, 117, 0 bytes). It requires compile #6 to equal `target_runtime.txt` and its init code plus the 128 bytes of constructor arguments to equal `target_creation.txt`, and exits 0.

## Notes

- **Warm-session match.** A fresh single compile of `Nav.sol` with soljson v0.2.2 (optimizer ON) is 117 bytes off: the instruction multiset is identical, only the scheduling of two independent SLOADs in `get()` and `getHistory` differs. Compiling the same source repeatedly in ONE soljson session cycles through outputs, and the 6th compile matches runtime and creation byte for byte, deterministically. `verify.js` reproduces this and prints the per-compile diff. The likely origin is browser-solidity, which recompiled on every keystroke, so the deployed code came from a warm compiler. One-shot verifiers (Etherscan, Sourcify) cannot reproduce this contract.
- Compiler pinned by calibration: soljson v0.2.2+commit.ef92f566 rebuilds the Etherscan-verified sibling `Trade` (0xADB7359Eda153b22d46B03FC0121a0256Df57a33, same deployer and block) byte for byte.
- `getHistory` declares `currency` as `uint`, not `uint8` as in the ABI submitted for the clone; `uint8` adds a redundant `0xff` mask in the return encoder.
- `get()` declares an unnamed sixth return value that is never assigned and always returns 0.
- The constructor pushes the first NAV entry (`now * 1000` milliseconds), then stores the fund id, cut-off and opening.

## Storage layout

| Slot | Type | Name |
|------|------|------|
| 0 | address (bytes 0-19), uint64 (bytes 20-27) | owner, cut_off |
| 1 | uint64, uint64 | opening, id_fund |
| 2 | Entry[] {address transaction; bool buy; uint8 currency; uint32 volume; uint64 date; uint32 amount} | history |
| 3 | NavEntry[] {uint32 nav; uint64 date} | navHistory |
