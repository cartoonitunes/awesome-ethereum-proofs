# Tiny Human reconstruction — STATUS (99.4%, 34 bytes from exact)

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
- Compiles under 0.1.3 opt-OFF to **5,707 bytes** vs target **5,673** → **+34 bytes (over)**.
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

## What's left (the 121 bytes)
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

## Tail analysis (next iteration starts here)
The constant-getter *entries* are byte-identical (0x1d3/0x3cf/0x564). Divergence is the
jump target to each one's constant-returning stub:
- MINE: 3 stubs grouped at ~0x641-0x64d (declared constants together).
- TARGET: scattered at 0x0a93, 0x0ce7, 0x0f50 — interleaved among other function bodies.
=> In the ORIGINAL, the 3 constants were declared *interspersed* among the state
   vars/functions; solc emits accessor bodies in declaration order. Grouping them (as in
   current source) mislays them. Moving them as a block (top vs end) does NOT help — they
   must be spread to the exact original positions.
Note: scattering is a POSITION diff, not a SIZE diff. The +121-byte SIZE excess is a
separate, still-unlocated issue (all named function bodies size-match; getter entries match).
Two problems remain for byte-exact: (a) locate ~121 bytes of extra code; (b) reproduce the
exact declaration interleaving. This is opcode-level archaeology; convergence not guaranteed.

## Update: indexed event params (121 -> 107)
Target emits **LOG2** (opcode a2) for both events; mine emitted LOG1 (a1). => the address
param of each event is **indexed**:
  event purchasedRight(address indexed buyer, bytes32 collectionId);
  event transferredRight(address indexed to, bytes32 collectionId);
(indexed does not change the topic-0 signature hash, so recovered sigs still hold.)
Recovered 14 bytes (121 -> 107). Four validated fixes total: unchecked .send(),
void transferRightIfApproved, indexed events, (storage layout). Remaining +107 is
DISTRIBUTED micro-differences in the shared tail helper codegen (ABI encoders / struct
accessors), not one isolable block; token-alignment can't cleanly separate it due to many
near-identical getter blocks. Needs per-helper opcode matching.

## Update: positive-guard setters (107 -> 62)
Target's access guards compile as `EQ ISZERO JUMPI <shared return-0 epilogue>` (guard is
`if (owner == caller) { body }`, failure jumps to a SHARED return-false). Mine wrote
`if (owner != caller) return false;` -> `EQ ISZERO ISZERO` (double-negate) + an INLINED
return-false in each setter. Rewriting all setters to positive-guard form
`if (admin == msg.sender) { ...; return true; }` (implicit false on fall-through) let solc
share one return-0 epilogue -> saved 45 bytes (107 -> 62). Fifth validated fix.
Same inline-return-false pattern remains in changeAdminFromBoard and purchase (next).

## Update: combined positive guard for changeAdminFromBoard (62 -> 39)
Rewrote the three sequential `if(approvals[BOARD_n] != newAdmin) return false;` as one
combined positive guard `if(a==x && b==x && c==x){ admin=x; return true; }` -> shared
return-0 epilogue, -23 bytes. Sixth fix. Total 193 -> 39 (99.3%).

## Remaining +39: constant-stub emission ORDER (compiler-internal)
First real (non-pointer) divergence is at 0x642: mine emits the three constant-returner
stubs GROUPED (JUMPDEST PUSH <const> DUP2 JUMP x3) right after setPrice's RETURN; the
TARGET scatters them at 0xa93 / 0xce7 / 0xf50, interleaved among function impl bodies.
This is solc 0.1.3 emitting accessor stubs in source DECLARATION order. Matching it needs
the original's exact interleaving of the 3 `uint public constant` decls among the other
members. Moving them as a block (top vs end) does not scatter them; individual interleaving
is required and the exact positions are not recoverable without the original source.

## Update: price expressions use literals (39 -> 34); function-order is LAYOUT-ONLY
- CORRECTION: function declaration order does NOT change bytecode length (every ordering
  compiles to the same size; verified across many permutations). It only permutes byte
  POSITIONS. An earlier "down to 20 via ordering" reading was a measurement error. Ordering
  will matter only AFTER the size matches exactly (for final byte alignment).
- Price math uses LITERAL expressions, not the named constants:
    downloadPriceInWei = 60 * 1 ether / usdEthPrice;      (literal 60, not USDDOWNLOADPRICE)
    stemPriceInWei     = 125 * 10**16 * 3600 / usdEthPrice; (exactly the decompile's form)
  Using the named constant USDDOWNLOADPRICE in the expression adds 2 bytes vs literal 60;
  the stem form `125*10**16*3600` is 3 bytes smaller than `4500*1e18`. Net 39 -> 34. (7th fix.)
  The constants USDDOWNLOADPRICE/USDSTEMPRICE/TOTALSHARES remain as public-constant getters.
- Remaining +34 is DISTRIBUTED across the struct-array public getters (owners/txLog/
  transferLog) encoders — near-identical blocks that differ in small 0.1.3 codegen ways,
  not one isolable block. Block-multiset diff: 21 mine-only blocks vs 33 target-only, net +34.

## Guard/price codegen analysis (brackets 0, can't land) + source hunt exhausted
Identified the exact remaining mechanisms for the +34:
- **Guard operand order:** solc 0.1.3 evaluates the RIGHT operand of `==` first. Target
  loads `admin`/`oracle` first => original source is `msg.sender == admin` /
  `msg.sender == oracle` (mine was `admin == msg.sender`). This is a CONTENT fix (same size).
- **Price computation:** target keeps `60 * 1 ether` UNFOLDED in a shared subroutine
  (runtime MUL); mine folds to a constant. Using the named constant `USDDOWNLOADPRICE`
  produces the unfolded form but nets +2; the stem form `125*10**16*3600` nets -3.
- **Internal getter-helper trick** for guards is a huge lever (admin-helper -61, oracle-helper
  +20, both -7) but the target setters are INLINE (no helper), so that's the wrong structure.
Tested combinations bracket 0 (-27, -7, +34, +36, +54) but none LANDS on 0. The exact
original source structure is required and cannot be uniquely inferred from bytecode.

Source hunt (all negative):
- Deployer 0x421291... made exactly ONE contract (this one) — no sibling.
- BlockApps GitHub: no 2015 Solidity contracts (earliest ethereum-rlp; rest 2016+ SDK).
- Wayback: blockapps.net website only (2015-11-27); myceliaformusic.org no snapshot.
- GitHub code search for unique fn names (transferRightIfApproved, stemPriceInWei, etc.): none.

CONCLUSION: 99.4% reconstruction (34/5673). Byte-exact blocked on solc 0.1.3 internal
codegen (guard operand order + constant fold/subroutine) that cannot be uniquely reproduced
without the original source, which is not publicly available. NOT submitted (34 != 0).
