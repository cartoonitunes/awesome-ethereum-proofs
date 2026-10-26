# Tiny Human reconstruction — STATUS (97.9%, 121 bytes from exact)

**Address:** `0xc7696b27830dd8aa4823a1cba8440c27c36adec4`
**Deployer:** `0x421291621428555e77f5ad58f217c9efa84d901f` (BlockApps)
**Deployed:** 2015-10-01 21:46:28 UTC, block 319,299 (the day before the public Mycelia release)
**Runtime:** 5,673 bytes · **Not** verified on Etherscan.

> Correction to README: deploy time is **21:46:28 UTC** (chain), not 22:26:28.

## Compiler
**solc 0.1.3+commit.028f561d, optimizer OFF.** Earliest build that accepts the source;
matches the Oct 1 2015 date. 0.1.1/0.1.2 reject the source; 0.1.4+ emit 5,976.
Etherscan matches on **runtime**, so the constructor (8 contributor names/shares) is
reconstruction-free — it never reaches the runtime.

## Current best: `TinyHuman.sol` (this dir)
- Compiles under 0.1.3 opt-OFF to **5,826 bytes** vs target **5,673** → **+153 bytes (over)**.
- First **374 bytes byte-identical** (dispatcher head); divergence after is only shifted
  jump destinations caused by the size delta.
- Build/diff: `node compile_ih.js /tmp/soljson/soljson-v0.1.3+commit.028f561d.js TinyHuman.sol 0`
  then compare the printed runtime hex to `runtime.hex`.

## Validated findings (high confidence)
- **All 28 function selectors recovered** (names in README).
- **Both events recovered:** `purchasedRight(address,bytes32)` (topic 0x39d73252…),
  `transferredRight(address,bytes32)` (topic 0x44bbf497…).
- **Storage layout slots 0–17:** shares(0), admin(1), oracle(2), BLOCKAPPS(3),
  BOARD_1/2/3(4/5/6), approvals mapping(7), usdEthPrice(8), downloadPriceInWei(9),
  stemPriceInWei(10), priceLastUpdated(11), owners[]{addr,name}(12), ownersCount(13),
  txLog[]{buyer,collectionId,block,value,usdEthPrice}(14), txCount(15),
  transferLog[]{to,collectionId,block}(16), transferCount(17).
- **Constants inlined (PUSH, not storage):** TOTALSHARES=1,000,000, USDDOWNLOADPRICE=60,
  USDSTEMPRICE=4,500.
- **Dispatcher is selector-sorted** → source function order is free.
- **Fix that worked:** the original uses **unchecked bare `.send()`** (no `if(!send) throw`)
  in the refund and payout paths. Removing those checks recovered 40 bytes (193→153).

## What's left (the 153 bytes)
Localized by per-function body-size comparison (split at dispatcher JUMPDESTs):
- **`transferRightIfApproved`: FIXED** — target returns **void** (entry ends `JUMPDEST STOP`); my `returns (bool)` added a 20-byte encode+RETURN epilogue. Changing it to a no-return function recovered 32 bytes (153→121) and extended the identical prefix 209→374.
- **~121 bytes in the shared helper/constant-getter region.** All individual function bodies now match in size; the first *real* (non-jump-pointer) divergence is at 0x642, where my three inlined constant-getter stubs (PUSH3 0f4240 / PUSH1 3c / PUSH2 1194) sit against differently-ordered target code. Remaining work is matching 0.1.3 code-section layout / helper ordering in this tail — deep codegen archaeology.

## Dead ends (do NOT retry — made it worse)
The Palkeoramix decompile (`decompile_palkeoramix.txt`, and the fuller EH copy) is
**unfaithful on control flow** — it failed on 30/33 functions. Structural changes taken
from it regressed the size:
- redundant nested `purchase()` refund (per decompile): 153 → 265
- field-by-field struct writes (per decompile): 153 → 273
→ The original uses a **clean** `purchase()` and **struct-constructor** assignment
(`Tx(...)`, `Transfer(...)`), as in the current `TinyHuman.sol`.

## Path to byte-exact
Opcode-level: disassemble the target's `transferRightIfApproved` body (between its
JUMPDEST and the next), diff opcode-by-opcode against the compiled version, infer the exact
source, recompile; then the shared tail. Decompile-guided guessing is exhausted.

**Do not submit to Etherscan until the compiled runtime is byte-identical to `runtime.hex`.**
First line of the submitted source must be `// Submitted by EthereumHistory (ethereumhistory.com)`.
