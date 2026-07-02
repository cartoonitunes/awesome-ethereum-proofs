# Vitalik's first contract (0x034dF870…) — a provably-fair betting game (Serpent)

Deployed by **Vitalik Buterin** (`0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6`, Etherscan
"Vb 2") on **2015-09-20** — block **263291**, roughly two months into the Frontier
network. This is one of the earliest contracts Vitalik ever put on mainnet. **Written in
Serpent, his own language — not Solidity.** Source was never published; it is fully
reconstructed here from the bytecode.

**Runtime and creation bytecode both reproduce byte-for-byte exactly.**

| Field | Value |
|-------|-------|
| Address | `0x034dF87052894BbE35CBd4546fD1d3Bdf7200E2F` |
| Deployed | 2015-09-20 14:38:13 UTC |
| Block | 263291 |
| Deployer | `0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6` (Vitalik) |
| Creation tx | `0xcf24ed0d6ccee963ac5bd97d7a90717a8a6b8a5286e07fc775470837bc5b0271` |
| Runtime | 1264 bytes — **EXACT match** |
| Creation | 1286 bytes — **EXACT match** (incl. `init` constructor) |
| Language | **Serpent** (ethereum/serpent) |
| Compiler | commit **f0b4128** (also **146cc8a**, the 2015-09-20 commit) |

- runtime sha256: `96fc31b95c65b4110a4c25de8e01c1b6abd3094b972f16ccf1d91d64d9fe7ca0`
- creation sha256: `22efde675afdfa05b2bb6335ff2a9d5ff3411ce49786fac6c5ed2e98f37e03e1`

## What it is

A **provably-fair, self-banked betting game**. Bettors stake ETH and pick their own odds;
the house (owner) periodically reveals a seed to settle every open bet at once. If the
owner goes silent for two days, anyone can trigger a full refund and self-destruct.

- **`bet(guess, odds)`** *(payable)* — place a bet. `odds` is your win-chance in per-mille
  (0–1000); `guess` is a bytes32 you contribute to the draw entropy. Payout is set to
  `msg.value * 1000 / odds` (a fair, zero-edge line). Rejected if there are already 100
  open bets (returns `-1`) or if the bank can't cover the payout (returns `-2`); the stake
  is refunded in both cases. Emits `Bet(sender, value, odds)`.
- **`set_curseed(a, b)`** *(owner only)* — settle the round. Requires `sha3(curseed) == a`
  (or a first-run `curseed == 0`). For every open bet, `rand = sha3([a, guess]) / (2²⁵⁶/1000)`
  gives a number in `[0,1000)`; if `rand < odds`, the bettor is paid `payout`. Then all bets
  clear, `curseed` is set to the new commitment `b`, the 2-day deadline resets, and it emits
  `NewSeed()`.
- **`emergency_withdraw()`** — only callable after the deadline passes. Refunds every open
  bet its original stake (`payout * odds / 1000`) and `SELFDESTRUCT`s.
- **`withdraw()`** — sweeps the bank's free balance (`this.balance − reserved`) to the owner.
- **`get_curseed()` / `get_num_bets()` / `get_bet(id)`** — views.

Storage: `owner` (slot 0), `curseed` (1), `deadline` (2), a `bets[2¹⁰⁰]` struct array of
`(sender, guess, payout, odds)` based at slot 3, then `numbets` and `reserved` at
`2¹⁰²+3 / 2¹⁰²+4` (Serpent lays scalars after the array region). On-chain history shows it
was only ever solo-tested by Vitalik — 14 `set_curseed` calls, no external bettors.

## Why this is Serpent, not Solidity

- **Init marker** `600061037f53` — `PUSH1 0 PUSH2 0x037f MSTORE8`, Serpent's runtime-length
  stamp, not Solidity's `6060604052`.
- **`5990590160009052` allocator** — Serpent's dynamic-array allocation idiom, all over the
  function preludes. Solidity never emits this.
- **Raw `LOG1` with literal 32-byte topics** (`04d83c80…`, `f41b7910…`) — hand-rolled
  Serpent `log()`, not Solidity event glue.
- **Named storage at `0x40…03`/`0x40…04`** — Serpent's post-array scalar placement.

## Reconstruction notes (the tricky parts)

Getting to an exact match hinged on several Serpent-specific codegen quirks:

- **`msg.data` copy prelude** appears on `set_curseed`/`bet` because they have **typed
  arguments** (`a:bytes32`, `guess:bytes32`). Any `:type` annotation sets Serpent's
  `haveVarg` flag → it copies calldata even though the args are still read as plain words.
- **Function selectors are typed**: `bet(bytes32,int256)` = `00a044ac` (leading zero →
  pushed as `PUSH3 a044ac`), `set_curseed(bytes32,bytes32)` = `4f3739bc`. Untyped guesses
  never matched — the annotations are load-bearing for the ABI.
- **`sha3(arr:arr)` / `return(arr:arr)`** — the `:arr` cast makes Serpent read the array
  length from its header at runtime (`mload(ptr-32)`), vs. `items=N` which hard-codes it.
- **The `2²⁵⁶/1000` seed** is written as the decimal literal
  `115792089237316195423570985008687907853269984665640564039457584007913129639`
  (`2^256` overflows to 0 in Serpent, so the expression form won't fold).
- **Operand order**: Serpent pushes binary operands right-to-left, so `msg.value * 1000`
  and `payout * odds` (variable first) are required to match the stack layout.
- **Control flow**: guard clauses are early-returns (`if cond: return(0)`), not nested
  if/else — visible in the single-vs-double `ISZERO` normalization.

## Reproduce

```
docker run -d --platform linux/amd64 --name serpentbuild \
  --entrypoint sleep serpent-compiler:latest infinity
docker cp betting.se serpentbuild:/betting.se
docker exec serpentbuild sh -c \
  'cd /serpent && git checkout -q f0b4128 && make serpentc >/dev/null && \
   ./serpent compile /betting.se'
# output == target_creation.txt exactly (runtime = bytes[18 : 18+1264])
```
